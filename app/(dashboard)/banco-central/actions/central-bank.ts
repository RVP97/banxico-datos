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
	AggregatePoint,
	CentralBankData,
	MonetaryBasePoint,
} from "../types/central-bank";

const BASE_SERIES: SeriesId[] = [
	SERIES.BASE_MONETARIA,
	SERIES.BILLETES_MONEDAS,
	SERIES.DEPOSITOS_BANCARIOS,
];

const AGGREGATE_SERIES: SeriesId[] = [SERIES.M1, SERIES.M2, SERIES.M4];

const SECURITIES_SERIES: SeriesId[] = [
	SERIES.VALORES_GOB_TOTAL,
	SERIES.VALORES_CETES,
	SERIES.VALORES_BONOS,
];

const ALL_SERIES: SeriesId[] = [
	...BASE_SERIES,
	...AGGREGATE_SERIES,
	...SECURITIES_SERIES,
];

const BASE_KEY_MAP: Record<string, keyof Omit<MonetaryBasePoint, "date">> = {
	[SERIES.BASE_MONETARIA]: "baseMonetaria",
	[SERIES.BILLETES_MONEDAS]: "billetesMonedas",
	[SERIES.DEPOSITOS_BANCARIOS]: "depositosBancarios",
};

const AGGREGATE_KEY_MAP: Record<string, keyof Omit<AggregatePoint, "date">> = {
	[SERIES.M1]: "m1",
	[SERIES.M2]: "m2",
	[SERIES.M4]: "m4",
};

type SecuritiesField = "total" | "cetes" | "bonos";

const SECURITIES_KEY_MAP: Record<string, SecuritiesField> = {
	[SERIES.VALORES_GOB_TOTAL]: "total",
	[SERIES.VALORES_CETES]: "cetes",
	[SERIES.VALORES_BONOS]: "bonos",
};

export async function getCentralBankData(
	period: Period = "5Y",
): Promise<CentralBankData> {
	const startDate = getStartDateForPeriod(period) ?? undefined;
	const endDate = new Date();

	const [baseSeriesData, aggregateSeriesData, securitiesSeriesData, latest] =
		await Promise.all([
			Promise.all(
				BASE_SERIES.map((id) => getSeriesData(id, startDate, endDate)),
			),
			Promise.all(
				AGGREGATE_SERIES.map((id) => getSeriesData(id, startDate, endDate)),
			),
			Promise.all(
				SECURITIES_SERIES.map((id) => getSeriesData(id, startDate, endDate)),
			),
			getMultipleLatest(ALL_SERIES),
		]);

	const baseMap = new Map<string, MonetaryBasePoint>();
	BASE_SERIES.forEach((seriesId, idx) => {
		const key = BASE_KEY_MAP[seriesId];
		for (const d of baseSeriesData[idx]) {
			const dateStr = toDateStr(d.date);
			const existing = baseMap.get(dateStr) ?? { date: dateStr };
			Object.assign(existing, { [key]: d.value });
			baseMap.set(dateStr, existing);
		}
	});
	const baseData = Array.from(baseMap.values()).sort((a, b) =>
		a.date.localeCompare(b.date),
	);

	const aggregateMap = new Map<string, AggregatePoint>();
	AGGREGATE_SERIES.forEach((seriesId, idx) => {
		const key = AGGREGATE_KEY_MAP[seriesId];
		for (const d of aggregateSeriesData[idx]) {
			const dateStr = toDateStr(d.date);
			const existing = aggregateMap.get(dateStr) ?? { date: dateStr };
			Object.assign(existing, { [key]: d.value });
			aggregateMap.set(dateStr, existing);
		}
	});
	const aggregateData = Array.from(aggregateMap.values()).sort((a, b) =>
		a.date.localeCompare(b.date),
	);

	const securitiesMap = new Map<
		string,
		{ date: string; total?: number; cetes?: number; bonos?: number }
	>();
	SECURITIES_SERIES.forEach((seriesId, idx) => {
		const key = SECURITIES_KEY_MAP[seriesId];
		for (const d of securitiesSeriesData[idx]) {
			const dateStr = toDateStr(d.date);
			const existing = securitiesMap.get(dateStr) ?? { date: dateStr };
			Object.assign(existing, { [key]: d.value });
			securitiesMap.set(dateStr, existing);
		}
	});
	const securitiesData = Array.from(securitiesMap.values()).sort((a, b) =>
		b.date.localeCompare(a.date),
	);

	return {
		baseData,
		aggregateData,
		securitiesData,
		latest: latest.map((l) => ({
			seriesId: l.seriesId,
			shortLabel: l.shortLabel,
			value: l.value,
			previousValue: l.previousValue,
			date: l.date,
		})),
	};
}
