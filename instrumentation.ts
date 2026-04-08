export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startBanxicoSyncWorker } = await import("@/workers/banxico-sync");
    const { setupBanxicoSyncScheduler } = await import(
      "@/lib/queue/banxico-sync"
    );

    await setupBanxicoSyncScheduler();

    const workers = [startBanxicoSyncWorker()];

    async function shutdown() {
      console.log("[instrumentation] Shutting down workers...");
      await Promise.allSettled(workers.map((w) => w.close()));
      process.exit(0);
    }

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  }
}
