"use server";

import {
	getStartDateForPeriod,
	type Period,
	SERIES,
	type SeriesId,
} from "@/lib/constants";
import { getMultipleLatest, getSeriesData } from "@/lib/data";
import type { BOPData, IEDPoint } from "../types/bop";

const IED_SERIES: SeriesId[] = [
	SERIES.IED_TOTAL,
	SERIES.IED_NUEVAS,
	SERIES.IED_REINVERSION,
	SERIES.IED_CUENTAS,
];

const IED_KEY_MAP: Record<
	string,
	"total" | "nuevas" | "reinversion" | "cuentas"
> = {
	[SERIES.IED_TOTAL]: "total",
	[SERIES.IED_NUEVAS]: "nuevas",
	[SERIES.IED_REINVERSION]: "reinversion",
	[SERIES.IED_CUENTAS]: "cuentas",
};

const BOP_LATEST_SERIES: SeriesId[] = [
	SERIES.IED_TOTAL,
	SERIES.IED_NUEVAS,
	SERIES.IED_REINVERSION,
	SERIES.IED_CUENTAS,
	SERIES.DEUDA_EXTERNA,
	SERIES.TURISMO_INGRESOS,
	SERIES.TURISMO_SALDO,
	SERIES.RESERVAS,
];

function toDateKey(d: Date | string): string {
	if (d instanceof Date) return d.toISOString().split("T")[0];
	return String(d);
}

export async function getBOPData(period: Period = "5Y"): Promise<BOPData> {
	const startDate = getStartDateForPeriod(period) ?? undefined;
	const endDate = new Date();

	const [iedSeriesData, debtDataRaw, tourismIngresos, tourismSaldo, latestRaw] =
		await Promise.all([
			Promise.all(
				IED_SERIES.map((id) => getSeriesData(id, startDate, endDate)),
			),
			getSeriesData(SERIES.DEUDA_EXTERNA, startDate, endDate),
			getSeriesData(SERIES.TURISMO_INGRESOS, startDate, endDate),
			getSeriesData(SERIES.TURISMO_SALDO, startDate, endDate),
			getMultipleLatest(BOP_LATEST_SERIES),
		]);

	const iedDateMap = new Map<string, IEDPoint>();

	IED_SERIES.forEach((seriesId, idx) => {
		const field = IED_KEY_MAP[seriesId];
		for (const d of iedSeriesData[idx]) {
			const dateStr = toDateKey(d.date);
			const existing = iedDateMap.get(dateStr) ?? { date: dateStr };
			Object.assign(existing, { [field]: d.value });
			iedDateMap.set(dateStr, existing);
		}
	});

	const iedData = Array.from(iedDateMap.values()).sort((a, b) =>
		a.date.localeCompare(b.date),
	);

	const debtData = debtDataRaw.map((d) => ({
		date: toDateKey(d.date),
		deuda: d.value,
	}));

	const tourMap = new Map<
		string,
		{ date: string; ingresos?: number; saldo?: number }
	>();

	for (const d of tourismIngresos) {
		const dateStr = toDateKey(d.date);
		const existing = tourMap.get(dateStr) ?? { date: dateStr };
		existing.ingresos = d.value;
		tourMap.set(dateStr, existing);
	}

	for (const d of tourismSaldo) {
		const dateStr = toDateKey(d.date);
		const existing = tourMap.get(dateStr) ?? { date: dateStr };
		existing.saldo = d.value;
		tourMap.set(dateStr, existing);
	}

	const tourismData = Array.from(tourMap.values()).sort((a, b) =>
		a.date.localeCompare(b.date),
	);

	const latest = latestRaw.map((l) => ({
		seriesId: l.seriesId,
		shortLabel: l.shortLabel,
		value: l.value,
		previousValue: l.previousValue,
		date: l.date,
	}));

	return {
		iedData,
		debtData,
		tourismData,
		latest,
	};
}
