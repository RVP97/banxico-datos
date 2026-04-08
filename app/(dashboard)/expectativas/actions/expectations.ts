"use server";

import {
	getStartDateForPeriod,
	type Period,
	SERIES,
	type SeriesId,
	toDateStr,
} from "@/lib/constants";
import { getMultipleLatest, getSeriesData } from "@/lib/data";
import type { ExpectationPoint, ExpectationsData } from "../types/expectations";

const EXPECTATION_SERIES: SeriesId[] = [
	SERIES.EXP_INFLACION,
	SERIES.EXP_PIB_ACTUAL,
	SERIES.EXP_PIB_SIGUIENTE,
	SERIES.EXP_DESEMPLEO,
];

function mergeSeriesIntoMap(
	dateMap: Map<string, ExpectationPoint>,
	seriesData: { date: Date; value: number }[],
	field: keyof Pick<
		ExpectationPoint,
		"inflacion" | "pibActual" | "pibSiguiente" | "desempleo"
	>,
) {
	for (const d of seriesData) {
		const dateStr = toDateStr(d.date);
		const existing = dateMap.get(dateStr) ?? { date: dateStr };
		existing[field] = d.value;
		dateMap.set(dateStr, existing);
	}
}

export async function getExpectationsData(
	period: Period = "5Y",
): Promise<ExpectationsData> {
	const startDate = getStartDateForPeriod(period) ?? undefined;
	const endDate = new Date();

	const [
		inflacionData,
		pibActualData,
		pibSiguienteData,
		desempleoData,
		latestAll,
	] = await Promise.all([
		getSeriesData(SERIES.EXP_INFLACION, startDate, endDate),
		getSeriesData(SERIES.EXP_PIB_ACTUAL, startDate, endDate),
		getSeriesData(SERIES.EXP_PIB_SIGUIENTE, startDate, endDate),
		getSeriesData(SERIES.EXP_DESEMPLEO, startDate, endDate),
		getMultipleLatest(EXPECTATION_SERIES),
	]);

	const dateMap = new Map<string, ExpectationPoint>();
	mergeSeriesIntoMap(dateMap, inflacionData, "inflacion");
	mergeSeriesIntoMap(dateMap, pibActualData, "pibActual");
	mergeSeriesIntoMap(dateMap, pibSiguienteData, "pibSiguiente");
	mergeSeriesIntoMap(dateMap, desempleoData, "desempleo");

	const chartData = Array.from(dateMap.values()).sort((a, b) =>
		a.date.localeCompare(b.date),
	);

	const latest = latestAll.map((l) => ({
		seriesId: l.seriesId,
		shortLabel: l.shortLabel,
		value: l.value,
		previousValue: l.previousValue,
		date: l.date,
	}));

	return { chartData, latest };
}
