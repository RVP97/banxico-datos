"use server";

import {
	getStartDateForPeriod,
	type Period,
	SERIES,
	type SeriesId,
	toDateStr,
} from "@/lib/constants";
import { getMultipleLatest, getSeriesData } from "@/lib/data";
import type { TradeData, TradePoint } from "../types/trade";

const TRADE_SERIES: SeriesId[] = [
	SERIES.EXPORTACIONES,
	SERIES.IMPORTACIONES,
	SERIES.BALANZA_COMERCIAL,
	SERIES.EXPORTACIONES_PETROLERAS,
	SERIES.EXPORTACIONES_NO_PETROLERAS,
];

const SERIES_KEY_MAP: Record<string, keyof Omit<TradePoint, "date">> = {
	[SERIES.EXPORTACIONES]: "exportaciones",
	[SERIES.IMPORTACIONES]: "importaciones",
	[SERIES.BALANZA_COMERCIAL]: "balanza",
	[SERIES.EXPORTACIONES_PETROLERAS]: "expPetroleras",
	[SERIES.EXPORTACIONES_NO_PETROLERAS]: "expNoPetroleras",
};

export async function getTradeData(period: Period = "5Y"): Promise<TradeData> {
	const startDate = getStartDateForPeriod(period) ?? undefined;
	const endDate = new Date();

	const [seriesData, latest] = await Promise.all([
		Promise.all(
			TRADE_SERIES.map((id) => getSeriesData(id, startDate, endDate)),
		),
		getMultipleLatest(TRADE_SERIES),
	]);

	const dateMap = new Map<string, TradePoint>();

	TRADE_SERIES.forEach((seriesId, idx) => {
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
