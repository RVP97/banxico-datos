"use server";

import {
	getStartDateForPeriod,
	type Period,
	SERIES,
	type SeriesId,
	toDateStr,
} from "@/lib/constants";
import { getMultipleLatest, getSeriesData } from "@/lib/data";
import type { ActivityData, ActivityPoint } from "../types/activity";

const IGAE_SERIES: SeriesId[] = [
	SERIES.IGAE,
	SERIES.IGAE_PRIMARIAS,
	SERIES.IGAE_SECUNDARIAS,
	SERIES.IGAE_TERCIARIAS,
];

const INDUSTRIAL_SERIES: SeriesId[] = [
	SERIES.PROD_INDUSTRIAL,
	SERIES.PROD_MANUFACTURA,
	SERIES.PROD_MINERIA,
];

const ACTIVITY_SERIES: SeriesId[] = [...IGAE_SERIES, ...INDUSTRIAL_SERIES];

const SERIES_KEY_MAP: Record<string, keyof Omit<ActivityPoint, "date">> = {
	[SERIES.IGAE]: "total",
	[SERIES.IGAE_PRIMARIAS]: "primarias",
	[SERIES.IGAE_SECUNDARIAS]: "secundarias",
	[SERIES.IGAE_TERCIARIAS]: "terciarias",
	[SERIES.PROD_INDUSTRIAL]: "prodIndustrial",
	[SERIES.PROD_MANUFACTURA]: "prodManufactura",
	[SERIES.PROD_MINERIA]: "prodMineria",
};

export async function getActivityData(
	period: Period = "5Y",
): Promise<ActivityData> {
	const startDate = getStartDateForPeriod(period) ?? undefined;
	const endDate = new Date();

	const [seriesData, latest] = await Promise.all([
		Promise.all(
			ACTIVITY_SERIES.map((id) => getSeriesData(id, startDate, endDate)),
		),
		getMultipleLatest(IGAE_SERIES),
	]);

	const dateMap = new Map<string, ActivityPoint>();

	ACTIVITY_SERIES.forEach((seriesId, idx) => {
		const key = SERIES_KEY_MAP[seriesId];
		for (const d of seriesData[idx]) {
			const dateStr = toDateStr(d.date);
			const existing = dateMap.get(dateStr) ?? { date: dateStr };
			Object.assign(existing, { [key]: d.value });
			dateMap.set(dateStr, existing);
		}
	});

	const chartData = Array.from(dateMap.values()).sort((a, b) =>
		a.date.localeCompare(b.date),
	);

	const gridData = [...chartData].sort((a, b) => b.date.localeCompare(a.date));

	return {
		chartData,
		gridData,
		latest: latest.map((l) => ({
			seriesId: l.seriesId,
			shortLabel: l.shortLabel,
			value: l.value,
			previousValue: l.previousValue,
		})),
	};
}
