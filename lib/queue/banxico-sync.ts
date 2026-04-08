import { Queue } from "bullmq";
import { getRedis } from "@/lib/redis";

const QUEUE_NAME = "banxico-sync";
const LATEST_POLL_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
const HISTORICAL_SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

let queue: Queue | null = null;

function getQueue() {
  if (!queue) {
    queue = new Queue(QUEUE_NAME, { connection: getRedis() });
  }
  return queue;
}

export type BanxicoSyncMode = "latest" | "historical" | "full";

export interface BanxicoSyncJobData {
  mode: BanxicoSyncMode;
  triggeredBy: "scheduler" | "manual";
}

export async function setupBanxicoSyncScheduler() {
  const q = getQueue();

  await q.upsertJobScheduler(
    "banxico-latest-poll",
    { every: LATEST_POLL_INTERVAL_MS },
    {
      name: "banxico-sync",
      data: {
        mode: "latest",
        triggeredBy: "scheduler",
      } satisfies BanxicoSyncJobData,
      opts: {
        attempts: 5,
        backoff: { type: "exponential", delay: 15_000 },
      },
    },
  );

  await q.upsertJobScheduler(
    "banxico-historical-daily",
    { every: HISTORICAL_SYNC_INTERVAL_MS },
    {
      name: "banxico-sync",
      data: {
        mode: "historical",
        triggeredBy: "scheduler",
      } satisfies BanxicoSyncJobData,
      opts: {
        attempts: 3,
        backoff: { type: "exponential", delay: 60_000 },
      },
    },
  );
}

export async function enqueueBanxicoSync(
  mode: BanxicoSyncMode,
): Promise<string | undefined> {
  const q = getQueue();

  const job = await q.add(
    "banxico-sync",
    { mode, triggeredBy: "manual" } satisfies BanxicoSyncJobData,
    {
      jobId: `banxico-sync-manual__${Date.now()}`,
      attempts: 5,
      backoff: { type: "exponential", delay: 15_000 },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 200 },
    },
  );

  return job.id;
}

export function getBanxicoSyncQueue() {
  return getQueue();
}
