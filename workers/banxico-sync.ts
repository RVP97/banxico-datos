import { Worker } from "bullmq";
import type { BanxicoSyncJobData } from "@/lib/queue/banxico-sync";
import { getRedis } from "@/lib/redis";

const QUEUE_NAME = "banxico-sync";

export function startBanxicoSyncWorker() {
  const worker = new Worker<BanxicoSyncJobData>(
    QUEUE_NAME,
    async (job) => {
      const { mode, triggeredBy } = job.data;
      const start = Date.now();

      console.log(
        `[banxico-sync] Starting ${mode} sync (${triggeredBy}), attempt ${job.attemptsMade + 1}/${job.opts.attempts ?? 1}`,
      );

      const { syncSeries, syncLatest, syncHistorical } = await import(
        "@/lib/data"
      );

      let results: Record<string, number>;

      switch (mode) {
        case "latest":
          results = await syncLatest();
          break;
        case "historical":
          results = await syncHistorical();
          break;
        case "full":
          results = await syncSeries();
          break;
      }

      const totalPoints = Object.values(results).reduce((sum, n) => sum + n, 0);
      const elapsed = Date.now() - start;

      console.log(
        `[banxico-sync] ${mode} sync complete: ${totalPoints} data points across ${Object.keys(results).length} series in ${elapsed}ms`,
      );

      return { results, elapsed };
    },
    {
      connection: getRedis(),
      concurrency: 1,
      limiter: { max: 1, duration: 30_000 },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 200 },
    },
  );

  worker.on("failed", (job, err) => {
    const attempt = job?.attemptsMade ?? 0;
    const maxAttempts = job?.opts.attempts ?? 1;
    const isLastAttempt = attempt >= maxAttempts;

    console.error(
      `[banxico-sync] Job ${job?.id} failed (attempt ${attempt}/${maxAttempts}${isLastAttempt ? " FINAL" : ""}):`,
      err.message,
    );
  });

  worker.on("completed", (job) => {
    console.log(`[banxico-sync] Job ${job.id} completed`);
  });

  return worker;
}
