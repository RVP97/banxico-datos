"use server";

import {
	getStartDateForPeriod,
	type Period,
	SERIES,
	type SeriesId,
} from "@/lib/constants";
import { getMultipleLatest, getSeriesData } from "@/lib/data";
import type { LaborData, LaborPoint } from "../types/labor";

const LABOR_SERIES: SeriesId[] = [
	SERIES.DESOCUPACION,
	SERIES.SUBOCUPACION,
	SERIES.EXP_DESEMPLEO,
];

function dateKey(d: Date | string): string {
	return d instanceof Date
		? d.toISOString().split("T")[0]
		: String(d).slice(0, 10);
}

export async function getLaborData(period: Period = "5Y"): Promise<LaborData> {
	const startDate = getStartDateForPeriod(period) ?? undefined;
	const endDate = new Date();

	const [desocupacionData, subocupacionData, expData, latestRows] =
		await Promise.all([
			getSeriesData(SERIES.DESOCUPACION, startDate, endDate),
			getSeriesData(SERIES.SUBOCUPACION, startDate, endDate),
			getSeriesData(SERIES.EXP_DESEMPLEO, startDate, endDate),
			getMultipleLatest(LABOR_SERIES),
		]);

	const dateMap = new Map<string, LaborPoint>();

	for (const d of desocupacionData) {
		const key = dateKey(d.date);
		const existing = dateMap.get(key) ?? { date: key };
		existing.desocupacion = d.value;
		dateMap.set(key, existing);
	}

	for (const d of subocupacionData) {
		const key = dateKey(d.date);
		const existing = dateMap.get(key) ?? { date: key };
		existing.subocupacion = d.value;
		dateMap.set(key, existing);
	}

	for (const d of expData) {
		const key = dateKey(d.date);
		const existing = dateMap.get(key) ?? { date: key };
		existing.expDesempleo = d.value;
		dateMap.set(key, existing);
	}

	const chartData = Array.from(dateMap.values()).sort((a, b) =>
		a.date.localeCompare(b.date),
	);

	const latest = latestRows.map((l) => ({
		seriesId: l.seriesId,
		shortLabel: l.shortLabel,
		value: l.value,
		previousValue: l.previousValue,
		date: l.date,
	}));

	return { chartData, latest };
}
