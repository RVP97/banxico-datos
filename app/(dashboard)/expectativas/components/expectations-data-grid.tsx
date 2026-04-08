"use client";

import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { ExpectationPoint } from "../types/expectations";

const columns: DataGridColumn[] = [
	{
		key: "date",
		label: "Fecha",
		align: "left",
		format: (v) => (typeof v === "string" ? formatDisplayDate(v) : "—"),
	},
	{
		key: "inflacion",
		label: "Inflación esperada (%)",
		align: "right",
		format: (v) => (typeof v === "number" ? `${formatNumber(v, 2)}%` : "—"),
	},
	{
		key: "pibActual",
		label: "PIB año actual (%)",
		align: "right",
		format: (v) => (typeof v === "number" ? `${formatNumber(v, 2)}%` : "—"),
	},
	{
		key: "pibSiguiente",
		label: "PIB siguiente año (%)",
		align: "right",
		format: (v) => (typeof v === "number" ? `${formatNumber(v, 2)}%` : "—"),
	},
	{
		key: "desempleo",
		label: "Desempleo esperado (%)",
		align: "right",
		format: (v) => (typeof v === "number" ? `${formatNumber(v, 2)}%` : "—"),
	},
];

export function ExpectationsDataGrid({ data }: { data: ExpectationPoint[] }) {
	const rows: Record<string, unknown>[] = [...data].reverse().map((row) => ({
		date: row.date,
		inflacion: row.inflacion ?? null,
		pibActual: row.pibActual ?? null,
		pibSiguiente: row.pibSiguiente ?? null,
		desempleo: row.desempleo ?? null,
	}));

	return (
		<DataGrid
			columns={columns}
			data={rows}
			csvFilename="expectativas"
			caption="Encuesta de especialistas del sector privado (Banxico)"
		/>
	);
}
