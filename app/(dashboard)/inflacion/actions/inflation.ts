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
	InflationData,
	InflationKPI,
	InflationPoint,
	InflationTableRow,
} from "../types/inflation";

const INFLATION_KPI_SERIES: SeriesId[] = [
	SERIES.INFLACION_NO_SUBYACENTE_ANUAL,
	SERIES.INPC,
	SERIES.INPC_SUBYACENTE,
];

export async function getInflationData(
	period: Period = "5Y",
): Promise<InflationData> {
	const startDate = getStartDateForPeriod(period) ?? undefined;
	const endDate = new Date();

	const [
		inpcData,
		coreData,
		noCoreData,
		inflacionData,
		inflacionSubData,
		latestAll,
	] = await Promise.all([
		getSeriesData(SERIES.INPC, startDate, endDate),
		getSeriesData(SERIES.INPC_SUBYACENTE, startDate, endDate),
		getSeriesData(SERIES.INPC_NO_SUBYACENTE, startDate, endDate),
		getSeriesData(SERIES.INFLACION_NO_SUBYACENTE_ANUAL, startDate, endDate),
		getSeriesData(SERIES.INFLACION_SUBYACENTE_ANUAL, startDate, endDate),
		getMultipleLatest(INFLATION_KPI_SERIES),
	]);

	const dateMap = new Map<string, InflationPoint>();

	for (const d of inpcData) {
		const dateStr = toDateStr(d.date);
		const existing = dateMap.get(dateStr) ?? { date: dateStr };
		existing.inpc = d.value;
		dateMap.set(dateStr, existing);
	}

	for (const d of coreData) {
		const dateStr = toDateStr(d.date);
		const existing = dateMap.get(dateStr) ?? { date: dateStr };
		existing.core = d.value;
		dateMap.set(dateStr, existing);
	}

	for (const d of noCoreData) {
		const dateStr = toDateStr(d.date);
		const existing = dateMap.get(dateStr) ?? { date: dateStr };
		existing.inpcNoSub = d.value;
		dateMap.set(dateStr, existing);
	}

	for (const d of inflacionData) {
		const dateStr = toDateStr(d.date);
		const existing = dateMap.get(dateStr) ?? { date: dateStr };
		existing.inflacionGeneral = d.value;
		dateMap.set(dateStr, existing);
	}

	for (const d of inflacionSubData) {
		const dateStr = toDateStr(d.date);
		const existing = dateMap.get(dateStr) ?? { date: dateStr };
		existing.inflacionSub = d.value;
		dateMap.set(dateStr, existing);
	}

	const chartData = Array.from(dateMap.values()).sort((a, b) =>
		a.date.localeCompare(b.date),
	);

	const gridData = [...chartData].sort((a, b) => b.date.localeCompare(a.date));

	const inpcByDate = new Map(
		inpcData.map((d) => {
			const dateStr = toDateStr(d.date);
			return [dateStr, d.value];
		}),
	);

	const tableData: InflationTableRow[] = chartData.map((point) => {
		const currentDate = new Date(point.date);
		const yearAgo = new Date(currentDate);
		yearAgo.setFullYear(yearAgo.getFullYear() - 1);
		const yearAgoStr = yearAgo.toISOString().split("T")[0];

		const yearAgoValue = inpcByDate.get(yearAgoStr);
		const yoyChange =
			yearAgoValue != null && point.inpc != null
				? ((point.inpc - yearAgoValue) / yearAgoValue) * 100
				: null;

		return {
			date: point.date,
			inpc: point.inpc ?? null,
			core: point.core ?? null,
			yoyChange,
		};
	});

	const kpis: InflationKPI[] = latestAll.map((l) => ({
		label: l.shortLabel,
		value: l.value,
		unit: l.seriesId === SERIES.INFLACION_NO_SUBYACENTE_ANUAL ? "%" : "Índice",
		previousValue: l.previousValue,
	}));

	return { chartData, gridData, tableData: tableData.reverse(), kpis };
}
