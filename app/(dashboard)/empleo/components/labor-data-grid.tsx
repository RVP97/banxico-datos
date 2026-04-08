"use client";

import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { LaborPoint } from "../types/labor";

const columns: DataGridColumn[] = [
	{
		key: "date",
		label: "Fecha",
		align: "left",
		format: (v) =>
			v != null && typeof v === "string" ? formatDisplayDate(v) : "—",
	},
	{
		key: "desocupacion",
		label: "Desocupación %",
		align: "right",
		format: (v) => (typeof v === "number" ? `${formatNumber(v, 2)}%` : "—"),
	},
	{
		key: "subocupacion",
		label: "Subocupación %",
		align: "right",
		format: (v) => (typeof v === "number" ? `${formatNumber(v, 2)}%` : "—"),
	},
	{
		key: "expDesempleo",
		label: "Exp. Desempleo %",
		align: "right",
		format: (v) => (typeof v === "number" ? `${formatNumber(v, 2)}%` : "—"),
	},
];

export function LaborDataGrid({ data }: { data: LaborPoint[] }) {
	const rows: Record<string, unknown>[] = [...data].reverse().map((p) => ({
		date: p.date,
		desocupacion: p.desocupacion ?? null,
		subocupacion: p.subocupacion ?? null,
		expDesempleo: p.expDesempleo ?? null,
	}));

	return (
		<DataGrid
			columns={columns}
			data={rows}
			csvFilename="empleo"
			caption="Historial mensual (ENEOI / expectativas según serie)"
		/>
	);
}
