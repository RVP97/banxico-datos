"use server";

import { SERIES, type SeriesId, subMonths, toDateStr } from "@/lib/constants";
import { getMultipleLatest, getSeriesData } from "@/lib/data";
import type { KPIData, OverviewData, SparklinePoint } from "../types/overview";

const KPI_GROUPS: { title: string; series: SeriesId[] }[] = [
	{
		title: "Mercados",
		series: [
			SERIES.USD_MXN,
			SERIES.EUR,
			SERIES.TASA_OBJETIVO,
			SERIES.TIIE_FONDEO_COMP_28,
			SERIES.CETES_28,
		],
	},
	{
		title: "Precios",
		series: [
			SERIES.INFLACION_NO_SUBYACENTE_ANUAL,
			SERIES.INFLACION_SUBYACENTE_ANUAL,
			SERIES.UDI,
			SERIES.INPC,
		],
	},
	{
		title: "Actividad",
		series: [
			SERIES.IGAE,
			SERIES.PROD_INDUSTRIAL,
			SERIES.DESOCUPACION,
			SERIES.REMESAS,
		],
	},
	{
		title: "Sector Externo",
		series: [SERIES.RESERVAS, SERIES.BALANZA_COMERCIAL, SERIES.IED_TOTAL],
	},
];

const KPI_SERIES_IDS = KPI_GROUPS.flatMap((g) => g.series);

const SPARKLINE_SERIES: SeriesId[] = [
	SERIES.USD_MXN,
	SERIES.EUR,
	SERIES.TASA_OBJETIVO,
	SERIES.TIIE_FONDEO_COMP_28,
	SERIES.INFLACION_NO_SUBYACENTE_ANUAL,
	SERIES.INFLACION_SUBYACENTE_ANUAL,
	SERIES.IGAE,
	SERIES.PROD_INDUSTRIAL,
	SERIES.RESERVAS,
	SERIES.UDI,
	SERIES.REMESAS,
	SERIES.BALANZA_COMERCIAL,
	SERIES.M2,
	SERIES.CETES_28,
	SERIES.DESOCUPACION,
	SERIES.IED_TOTAL,
];

function toKPIData(k: {
	seriesId: string;
	label: string;
	shortLabel: string;
	unit: string;
	value: number;
	previousValue: number | null;
	date: Date;
}): KPIData {
	return {
		seriesId: k.seriesId,
		label: k.label,
		shortLabel: k.shortLabel,
		unit: k.unit,
		value: k.value,
		previousValue: k.previousValue,
		date: k.date,
	};
}

export async function getOverviewData(): Promise<OverviewData> {
	const latestList = await getMultipleLatest(KPI_SERIES_IDS);
	const latestById = new Map(latestList.map((k) => [k.seriesId, k]));

	const kpiGroups = KPI_GROUPS.map(({ title, series }) => ({
		title,
		kpis: series
			.map((id) => latestById.get(id))
			.filter((k): k is NonNullable<typeof k> => k != null)
			.map(toKPIData),
	}));

	const endDate = new Date();
	const startDate = subMonths(endDate, 3);

	const sparklineEntries = await Promise.all(
		SPARKLINE_SERIES.map(async (id) => {
			const data = await getSeriesData(id, startDate, endDate);
			const points: SparklinePoint[] = data.map((d) => ({
				date: toDateStr(d.date),
				value: d.value,
			}));
			return [id, points] as const;
		}),
	);

	const sparklines: Partial<Record<SeriesId, SparklinePoint[]>> = {};
	for (const [id, points] of sparklineEntries) {
		sparklines[id] = points;
	}

	return {
		kpiGroups,
		sparklines,
		sparklineOrder: SPARKLINE_SERIES,
	};
}
