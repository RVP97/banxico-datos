"use server";

import {
	getStartDateForPeriod,
	type Period,
	SERIES,
	type SeriesId,
	toDateStr,
} from "@/lib/constants";
import { getMultipleLatest, getSeriesData } from "@/lib/data";
import type { MoneyMarketData, MoneyMarketPoint } from "../types/money-market";

const MONEY_MARKET_SERIES: SeriesId[] = [
	SERIES.TASA_OBJETIVO,
	SERIES.TIIE_FONDEO_COMP_28,
	SERIES.TIIE_28,
	SERIES.TIIE_91,
	SERIES.CETES_28,
	SERIES.CETES_91,
	SERIES.CETES_182,
	SERIES.CETES_364,
];

const SERIES_KEY_MAP: Record<string, keyof Omit<MoneyMarketPoint, "date">> = {
	[SERIES.TASA_OBJETIVO]: "tasaObjetivo",
	[SERIES.TIIE_FONDEO_COMP_28]: "tiieFondeo",
	[SERIES.TIIE_28]: "tiie28",
	[SERIES.TIIE_91]: "tiie91",
	[SERIES.CETES_28]: "cetes28",
	[SERIES.CETES_91]: "cetes91",
	[SERIES.CETES_182]: "cetes182",
	[SERIES.CETES_364]: "cetes364",
};

const CETES_CURVE_SPECS: {
	id: SeriesId;
	maturity: string;
	days: number;
}[] = [
	{ id: SERIES.CETES_28, maturity: "28d", days: 28 },
	{ id: SERIES.CETES_91, maturity: "91d", days: 91 },
	{ id: SERIES.CETES_182, maturity: "182d", days: 182 },
	{ id: SERIES.CETES_364, maturity: "364d", days: 364 },
];

export async function getMoneyMarketData(
	period: Period = "5Y",
): Promise<MoneyMarketData> {
	const startDate = getStartDateForPeriod(period) ?? undefined;
	const endDate = new Date();

	const [seriesData, latest] = await Promise.all([
		Promise.all(
			MONEY_MARKET_SERIES.map((id) => getSeriesData(id, startDate, endDate)),
		),
		getMultipleLatest(MONEY_MARKET_SERIES),
	]);

	const dateMap = new Map<string, MoneyMarketPoint>();

	MONEY_MARKET_SERIES.forEach((seriesId, idx) => {
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

	const spreadData = chartData.flatMap((p) => {
		if (p.tiie28 == null || p.tasaObjetivo == null) return [];
		return [{ date: p.date, spread: p.tiie28 - p.tasaObjetivo }];
	});

	const latestBySeriesId = Object.fromEntries(
		latest.map((l) => [l.seriesId, l]),
	);
	const yieldCurve = CETES_CURVE_SPECS.flatMap((spec) => {
		const l = latestBySeriesId[spec.id];
		if (!l) return [];
		return [{ maturity: spec.maturity, days: spec.days, rate: l.value }];
	});

	return {
		chartData,
		spreadData,
		yieldCurve,
		latest: latest.map((l) => ({
			seriesId: l.seriesId,
			shortLabel: l.shortLabel,
			value: l.value,
			previousValue: l.previousValue,
			date: l.date,
		})),
	};
}
