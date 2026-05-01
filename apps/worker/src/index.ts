import { Worker } from "bullmq";
import IORedis from "ioredis";
import { QUEUE_NAMES } from "@markazi/jobs";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

async function start() {
  const connection = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 500, 2000);
    },
  });

  await new Promise<void>((resolve, reject) => {
    connection.once("ready", resolve);
    connection.once("error", reject);
  });

  const notificationWorker = new Worker(
    QUEUE_NAMES.NOTIFICATION,
    async (job) => {
      console.log(`[Notification] Processing: ${job.name}`, job.data);
    },
    { connection },
  );

  const paymentWorker = new Worker(
    QUEUE_NAMES.PAYMENT,
    async (job) => {
      console.log(`[Payment] Processing: ${job.name}`, job.data);
    },
    { connection },
  );

  const reportWorker = new Worker(
    QUEUE_NAMES.REPORT,
    async (job) => {
      console.log(`[Report] Processing: ${job.name}`, job.data);
    },
    { connection },
  );

  const certificateWorker = new Worker(
    QUEUE_NAMES.CERTIFICATE,
    async (job) => {
      console.log(`[Certificate] Processing: ${job.name}`, job.data);
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
    await connection.quit();
    process.exit(0);
  });
}

start().catch((err) => {
  console.warn(`[Worker] Redis unavailable (${redisUrl}) — workers disabled.`);
  console.warn("[Worker] Start Redis to enable background jobs: docker compose -f docker/docker-compose.yml up -d redis");
});
