import { Queue } from "bullmq";
import IORedis from "ioredis";

export const QUEUE_NAMES = {
  NOTIFICATION: "notification",
  PAYMENT: "payment",
  REPORT: "report",
  CERTIFICATE: "certificate",
  IMPORT: "import",
  CLEANUP: "cleanup",
} as const;

export function createQueues(redisUrl: string) {
  const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

  return {
    notification: new Queue(QUEUE_NAMES.NOTIFICATION, { connection }),
    payment: new Queue(QUEUE_NAMES.PAYMENT, { connection }),
    report: new Queue(QUEUE_NAMES.REPORT, { connection }),
    certificate: new Queue(QUEUE_NAMES.CERTIFICATE, { connection }),
    import: new Queue(QUEUE_NAMES.IMPORT, { connection }),
    cleanup: new Queue(QUEUE_NAMES.CLEANUP, { connection }),
  };
}
