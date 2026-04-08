import { and, asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { dataPoints, series } from "@/db/schema";
import { fetchLatestFromAPI, fetchSeriesFromAPI } from "./banxico";
import {
  ALL_SERIES_IDS,
  SERIES_META,
  type SeriesId,
  subYears,
} from "./constants";
import { bustCache, cacheAside } from "./redis";

export interface DataPoint {
  date: Date;
  value: number;
}

export interface LatestValue {
  seriesId: string;
  label: string;
  shortLabel: string;
  unit: string;
  value: number;
  date: Date;
  previousValue: number | null;
}

const CACHE_TTL = {
  LATEST: 300, // 5 minutes
  RANGE: 3600, // 1 hour
  HISTORY: 86400, // 24 hours
} as const;

export async function getSeriesData(
  seriesId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<DataPoint[]> {
  const startKey = startDate ? startDate.toISOString().split("T")[0] : "all";
  const endKey = endDate ? endDate.toISOString().split("T")[0] : "now";
  const cacheKey = `banxico:${seriesId}:${startKey}:${endKey}`;
  const ttl = startDate ? CACHE_TTL.RANGE : CACHE_TTL.HISTORY;

  return cacheAside(cacheKey, ttl, async () => {
    const conditions = [eq(dataPoints.seriesId, seriesId)];
    if (startDate) conditions.push(gte(dataPoints.date, startDate));
    if (endDate) conditions.push(lte(dataPoints.date, endDate));

    const rows = await db
      .select({ date: dataPoints.date, value: dataPoints.value })
      .from(dataPoints)
      .where(and(...conditions))
      .orderBy(asc(dataPoints.date));

    return rows.map((r) => ({
      date: r.date,
      value: Number(r.value),
    }));
  });
}

export async function getLatestValue(
  seriesId: SeriesId,
): Promise<LatestValue | null> {
  const cacheKey = `banxico:${seriesId}:latest`;

  return cacheAside(cacheKey, CACHE_TTL.LATEST, async () => {
    const rows = await db
      .select({ date: dataPoints.date, value: dataPoints.value })
      .from(dataPoints)
      .where(eq(dataPoints.seriesId, seriesId))
      .orderBy(desc(dataPoints.date))
      .limit(2);

    if (rows.length === 0) return null;

    const meta = SERIES_META[seriesId];
    return {
      seriesId,
      label: meta.label,
      shortLabel: meta.shortLabel,
      unit: meta.unit,
      value: Number(rows[0].value),
      date: rows[0].date,
      previousValue: rows.length > 1 ? Number(rows[1].value) : null,
    };
  });
}

export async function getMultipleLatest(
  seriesIds: SeriesId[],
): Promise<LatestValue[]> {
  const results = await Promise.all(seriesIds.map(getLatestValue));
  return results.filter((r): r is LatestValue => r !== null);
}

export async function syncSeries(
  seriesIds: string[] = ALL_SERIES_IDS as unknown as string[],
): Promise<Record<string, number>> {
  const results: Record<string, number> = {};

  const batchSize = 20;
  for (let i = 0; i < seriesIds.length; i += batchSize) {
    const batch = seriesIds.slice(i, i + batchSize);

    try {
      const parsed = await fetchSeriesFromAPI(batch);

      for (const s of parsed) {
        await db
          .insert(series)
          .values({
            id: s.id,
            title: s.title,
            frequency:
              (SERIES_META as Record<string, { frequency?: string }>)[s.id]
                ?.frequency ?? null,
            unit:
              (SERIES_META as Record<string, { unit?: string }>)[s.id]?.unit ??
              null,
            lastSyncedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: series.id,
            set: { title: s.title, lastSyncedAt: new Date() },
          });

        if (s.data.length > 0) {
          const chunks = chunkArray(
            s.data.map((d) => ({
              seriesId: s.id,
              date: d.date,
              value: String(d.value),
            })),
            500,
          );

          let upserted = 0;
          for (const chunk of chunks) {
            await db
              .insert(dataPoints)
              .values(chunk)
              .onConflictDoUpdate({
                target: [dataPoints.seriesId, dataPoints.date],
                set: { value: sql`excluded.value` },
              });
            upserted += chunk.length;
          }
          results[s.id] = upserted;
        } else {
          results[s.id] = 0;
        }
      }
    } catch (err) {
      console.error(
        `[sync-series] Error syncing batch [${batch.join(",")}]:`,
        err,
      );
    }
  }

  await bustCache("banxico:*");
  return results;
}

export async function syncHistorical(
  seriesIds: string[] = ALL_SERIES_IDS as unknown as string[],
  years = 25,
): Promise<Record<string, number>> {
  const results: Record<string, number> = {};
  const now = new Date();
  const startDate = subYears(now, years);

  for (const id of seriesIds) {
    const meta =
      (SERIES_META as Record<string, { frequency?: string; unit?: string }>)[
        id
      ] ?? {};

    console.log(`[sync-historical] Fetching ${id} (${years}y window)...`);

    try {
      const parsed = await fetchSeriesFromAPI([id], startDate, now);
      const s = parsed[0];
      if (!s) {
        results[id] = 0;
        continue;
      }

      await db
        .insert(series)
        .values({
          id: s.id,
          title: s.title,
          frequency: meta.frequency ?? null,
          unit: meta.unit ?? null,
          lastSyncedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: series.id,
          set: { title: s.title, lastSyncedAt: new Date() },
        });

      if (s.data.length > 0) {
        const chunks = chunkArray(
          s.data.map((d) => ({
            seriesId: s.id,
            date: d.date,
            value: String(d.value),
          })),
          500,
        );

        let upserted = 0;
        for (const chunk of chunks) {
          await db
            .insert(dataPoints)
            .values(chunk)
            .onConflictDoUpdate({
              target: [dataPoints.seriesId, dataPoints.date],
              set: { value: sql`excluded.value` },
            });
          upserted += chunk.length;
        }
        results[s.id] = upserted;
      } else {
        results[s.id] = 0;
      }
    } catch (err) {
      console.error(`[sync-historical] Error syncing ${id}:`, err);
      results[id] = 0;
    }
  }

  await bustCache("banxico:*");
  return results;
}

export async function syncLatest(
  seriesIds: string[] = ALL_SERIES_IDS as unknown as string[],
): Promise<Record<string, number>> {
  const results: Record<string, number> = {};

  const batchSize = 20;
  for (let i = 0; i < seriesIds.length; i += batchSize) {
    const batch = seriesIds.slice(i, i + batchSize);

    try {
      const parsed = await fetchLatestFromAPI(batch);

      for (const s of parsed) {
        const meta =
          (
            SERIES_META as Record<string, { frequency?: string; unit?: string }>
          )[s.id] ?? {};

        await db
          .insert(series)
          .values({
            id: s.id,
            title: s.title ?? s.id,
            frequency: meta.frequency ?? null,
            unit: meta.unit ?? null,
            lastSyncedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: series.id,
            set: { lastSyncedAt: new Date() },
          });

        if (s.data.length > 0) {
          const values = s.data.map((d) => ({
            seriesId: s.id,
            date: d.date,
            value: String(d.value),
          }));

          await db
            .insert(dataPoints)
            .values(values)
            .onConflictDoUpdate({
              target: [dataPoints.seriesId, dataPoints.date],
              set: { value: sql`excluded.value` },
            });
          results[s.id] = values.length;
        }
      }
    } catch (err) {
      console.error(
        `[sync-latest] Error syncing batch [${batch.join(",")}]:`,
        err,
      );
    }
  }

  await bustCache("banxico:*");
  return results;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
