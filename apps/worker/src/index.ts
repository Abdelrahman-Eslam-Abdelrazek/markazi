import { Worker } from "bullmq";
import IORedis from "ioredis";
import { QUEUE_NAMES } from "@markazi/jobs";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

const notificationWorker = new Worker(
  QUEUE_NAMES.NOTIFICATION,
  async (job) => {
    console.log(`[Notification] Processing: ${job.name}`, job.data);
    // TODO: Implement notification processing
  },
  { connection },
);

const paymentWorker = new Worker(
  QUEUE_NAMES.PAYMENT,
  async (job) => {
    console.log(`[Payment] Processing: ${job.name}`, job.data);
    // TODO: Implement payment reconciliation
  },
  { connection },
);

const reportWorker = new Worker(
  QUEUE_NAMES.REPORT,
  async (job) => {
    console.log(`[Report] Processing: ${job.name}`, job.data);
    // TODO: Implement report generation
  },
  { connection },
);

const certificateWorker = new Worker(
  QUEUE_NAMES.CERTIFICATE,
  async (job) => {
    console.log(`[Certificate] Processing: ${job.name}`, job.data);
    // TODO: Implement certificate PDF generation
  },
  { connection },
);

const workers = [notificationWorker, paymentWorker, reportWorker, certificateWorker];

workers.forEach((worker) => {
  worker.on("completed", (job) => {
    console.log(`[${worker.name}] Job ${job.id} completed`);
  });
  worker.on("failed", (job, err) => {
    console.error(`[${worker.name}] Job ${job?.id} failed:`, err.message);
  });
});

console.log("Markazi workers started successfully");

process.on("SIGTERM", async () => {
  console.log("Shutting down workers...");
  await Promise.all(workers.map((w) => w.close()));
  process.exit(0);
});
