"use client";

import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { IEDPoint } from "../types/bop";

const columns: DataGridColumn[] = [
	{
		key: "date",
		label: "Periodo",
		format: (v) => formatDisplayDate(String(v)),
	},
	{
		key: "total",
		label: "IED total",
		align: "right",
		format: (v) => (v == null ? "—" : formatNumber(Number(v), 2)),
	},
	{
		key: "nuevas",
		label: "Nuevas",
		align: "right",
		format: (v) => (v == null ? "—" : formatNumber(Number(v), 2)),
	},
	{
		key: "reinversion",
		label: "Reinversión",
		align: "right",
		format: (v) => (v == null ? "—" : formatNumber(Number(v), 2)),
	},
	{
		key: "cuentas",
		label: "Cuentas",
		align: "right",
		format: (v) => (v == null ? "—" : formatNumber(Number(v), 2)),
	},
];

export function BOPDataGrid({ data }: { data: IEDPoint[] }) {
	const rows: Record<string, unknown>[] = [...data].reverse().map((row) => ({
		date: row.date,
		total: row.total ?? null,
		nuevas: row.nuevas ?? null,
		reinversion: row.reinversion ?? null,
		cuentas: row.cuentas ?? null,
	}));

	return (
		<DataGrid
			caption="Millones de dólares (MDD). Orden: más reciente primero."
			columns={columns}
			data={rows}
			csvFilename="balanza-pagos"
		/>
	);
}
