"use server";

import {
	getStartDateForPeriod,
	type Period,
	SERIES,
	type SeriesId,
	toDateStr,
} from "@/lib/constants";
import { getMultipleLatest, getSeriesData } from "@/lib/data";
import type {
	ExchangeRateData,
	ExchangeRateGridRow,
	FixVsLiqPoint,
} from "../types/exchange-rates";

const CURRENCY_SERIES: SeriesId[] = [
	SERIES.USD_MXN,
	SERIES.USD_MXN_LIQ,
	SERIES.EUR,
	SERIES.GBP,
	SERIES.CAD,
	SERIES.JPY,
	SERIES.CNY,
];

function mergeFixVsLiq(
	fixData: { date: Date | string; value: number }[],
	liqData: { date: Date | string; value: number }[],
): FixVsLiqPoint[] {
	const fixMap = new Map<string, number>();
	for (const row of fixData) {
		fixMap.set(toDateStr(row.date), row.value);
	}
	const liqMap = new Map<string, number>();
	for (const row of liqData) {
		liqMap.set(toDateStr(row.date), row.value);
	}
	const dates = new Set([...fixMap.keys(), ...liqMap.keys()]);
	return [...dates].sort().map((date) => {
		const point: FixVsLiqPoint = { date };
		const fix = fixMap.get(date);
		const liquidacion = liqMap.get(date);
		if (fix !== undefined) point.fix = fix;
		if (liquidacion !== undefined) point.liquidacion = liquidacion;
		return point;
	});
}

function buildGridData(
	usdFix: { date: Date | string; value: number }[],
	usdLiq: { date: Date | string; value: number }[],
	eur: { date: Date | string; value: number }[],
	gbp: { date: Date | string; value: number }[],
	cad: { date: Date | string; value: number }[],
	jpy: { date: Date | string; value: number }[],
	cny: { date: Date | string; value: number }[],
): ExchangeRateGridRow[] {
	const byDate = new Map<string, ExchangeRateGridRow>();

	function add(
		key: keyof Omit<ExchangeRateGridRow, "date">,
		rows: { date: Date | string; value: number }[],
	) {
		for (const row of rows) {
			const d = toDateStr(row.date);
			const existing = byDate.get(d);
			if (existing) {
				existing[key] = row.value;
			} else {
				byDate.set(d, { date: d, [key]: row.value });
			}
		}
	}

	add("usdFix", usdFix);
	add("usdLiq", usdLiq);
	add("eur", eur);
	add("gbp", gbp);
	add("cad", cad);
	add("jpy", jpy);
	add("cny", cny);

	return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getExchangeRateData(
	period: Period = "1Y",
): Promise<ExchangeRateData> {
	const startDate = getStartDateForPeriod(period) ?? undefined;
	const endDate = new Date();

	const [
		usdData,
		usdLiqData,
		eurData,
		gbpData,
		cadData,
		jpyData,
		cnyData,
		currencies,
	] = await Promise.all([
		getSeriesData(SERIES.USD_MXN, startDate, endDate),
		getSeriesData(SERIES.USD_MXN_LIQ, startDate, endDate),
		getSeriesData(SERIES.EUR, startDate, endDate),
		getSeriesData(SERIES.GBP, startDate, endDate),
		getSeriesData(SERIES.CAD, startDate, endDate),
		getSeriesData(SERIES.JPY, startDate, endDate),
		getSeriesData(SERIES.CNY, startDate, endDate),
		getMultipleLatest(CURRENCY_SERIES),
	]);

	const usdMxn = usdData.map((d) => ({
		date: toDateStr(d.date),
		value: d.value,
	}));

	return {
		usdMxn,
		fixVsLiq: mergeFixVsLiq(usdData, usdLiqData),
		currencies: currencies.map((c) => ({
			seriesId: c.seriesId,
			label: c.label,
			shortLabel: c.shortLabel,
			value: c.value,
			previousValue: c.previousValue,
			date: c.date,
		})),
		gridData: buildGridData(
			usdData,
			usdLiqData,
			eurData,
			gbpData,
			cadData,
			jpyData,
			cnyData,
		),
	};
}
