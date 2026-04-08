"use server";

import {
	getStartDateForPeriod,
	type Period,
	SERIES,
	type SeriesId,
	toDateStr,
} from "@/lib/constants";
import { getMultipleLatest, getSeriesData } from "@/lib/data";
import type { FiscalData, FiscalPoint } from "../types/fiscal";

const FISCAL_SERIES: SeriesId[] = [
	SERIES.INGRESOS_PUBLICOS,
	SERIES.GASTO_PUBLICO,
	SERIES.BALANCE_PRESUPUESTARIO,
	SERIES.BALANCE_PRIMARIO,
];

const SERIES_KEY_MAP: Record<string, keyof Omit<FiscalPoint, "date">> = {
	[SERIES.INGRESOS_PUBLICOS]: "ingresos",
	[SERIES.GASTO_PUBLICO]: "gasto",
	[SERIES.BALANCE_PRESUPUESTARIO]: "balancePresupuestario",
	[SERIES.BALANCE_PRIMARIO]: "balancePrimario",
};

export async function getFiscalData(
	period: Period = "5Y",
): Promise<FiscalData> {
	const startDate = getStartDateForPeriod(period) ?? undefined;
	const endDate = new Date();

	const [seriesData, latest] = await Promise.all([
		Promise.all(
			FISCAL_SERIES.map((id) => getSeriesData(id, startDate, endDate)),
		),
		getMultipleLatest(FISCAL_SERIES),
	]);

	const dateMap = new Map<string, FiscalPoint>();

	FISCAL_SERIES.forEach((seriesId, idx) => {
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

	return {
		chartData,
		latest: latest.map((l) => ({
			seriesId: l.seriesId,
			shortLabel: l.shortLabel,
			value: l.value,
			previousValue: l.previousValue,
			date: l.date,
		})),
	};
}
