"use server";

import {
	getStartDateForPeriod,
	type Period,
	SERIES,
	type SeriesId,
	toDateStr,
} from "@/lib/constants";
import { getMultipleLatest, getSeriesData } from "@/lib/data";
import type { MonetaryData, MonetaryPoint } from "../types/monetary";

const MONETARY_SERIES: SeriesId[] = [SERIES.M1, SERIES.M2, SERIES.M4];

const SERIES_KEY_MAP: Record<string, keyof Omit<MonetaryPoint, "date">> = {
	[SERIES.M1]: "m1",
	[SERIES.M2]: "m2",
	[SERIES.M4]: "m4",
};

export async function getMonetaryData(
	period: Period = "5Y",
): Promise<MonetaryData> {
	const startDate = getStartDateForPeriod(period) ?? undefined;
	const endDate = new Date();

	const [seriesData, latest] = await Promise.all([
		Promise.all(
			MONETARY_SERIES.map((id) => getSeriesData(id, startDate, endDate)),
		),
		getMultipleLatest(MONETARY_SERIES),
	]);

	const dateMap = new Map<string, MonetaryPoint>();

	MONETARY_SERIES.forEach((seriesId, idx) => {
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
