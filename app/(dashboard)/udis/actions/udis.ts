"use server";

import {
  getStartDateForPeriod,
  type Period,
  SERIES,
  toDateStr,
} from "@/lib/constants";
import { getLatestValue, getSeriesData } from "@/lib/data";
import type { UDIData } from "../types/udis";

export async function getUDIData(period: Period = "5Y"): Promise<UDIData> {
  const startDate = getStartDateForPeriod(period) ?? undefined;
  const endDate = new Date();

  const [data, latest] = await Promise.all([
    getSeriesData(SERIES.UDI, startDate, endDate),
    getLatestValue(SERIES.UDI),
  ]);

  return {
    chartData: data.map((d) => ({
      date: toDateStr(d.date),
      value: d.value,
    })),
    latestValue: latest?.value ?? null,
    latestDate: latest?.date ?? null,
    previousValue: latest?.previousValue ?? null,
  };
}
