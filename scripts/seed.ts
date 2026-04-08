import { sql } from "drizzle-orm";
import { db } from "../db";
import { dataPoints, series } from "../db/schema";
import { fetchSeriesFromAPI } from "../lib/banxico";
import { ALL_SERIES_IDS, SERIES_META } from "../lib/constants";

async function seed() {
  console.log("Starting seed: pulling historical data from Banxico...\n");

  for (const id of ALL_SERIES_IDS) {
    const meta = SERIES_META[id];
    console.log(`Fetching ${meta.shortLabel} (${id})...`);

    try {
      const [parsed] = await fetchSeriesFromAPI([id]);

      await db
        .insert(series)
        .values({
          id: parsed.id,
          title: parsed.title,
          frequency: meta.frequency,
          unit: meta.unit,
          lastSyncedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: series.id,
          set: { title: parsed.title, lastSyncedAt: new Date() },
        });

      if (parsed.data.length > 0) {
        const chunkSize = 500;
        let total = 0;
        for (let i = 0; i < parsed.data.length; i += chunkSize) {
          const chunk = parsed.data.slice(i, i + chunkSize).map((d) => ({
            seriesId: parsed.id,
            date: d.date,
            value: String(d.value),
          }));

          await db
            .insert(dataPoints)
            .values(chunk)
            .onConflictDoUpdate({
              target: [dataPoints.seriesId, dataPoints.date],
              set: { value: sql`excluded.value` },
            });
          total += chunk.length;
        }
        console.log(`  -> ${total} data points upserted`);
      } else {
        console.log("  -> No data points returned");
      }
    } catch (error) {
      console.error(`  -> Error fetching ${id}:`, error);
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  console.log("\nSeed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
