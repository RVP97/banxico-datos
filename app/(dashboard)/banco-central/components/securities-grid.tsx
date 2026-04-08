"use client";

import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { formatDisplayDate, formatNumber } from "@/lib/constants";

const columns: DataGridColumn[] = [
	{
		key: "date",
		label: "Fecha",
		format: (v) => formatDisplayDate(v != null ? String(v) : null),
	},
	{
		key: "total",
		label: "Total",
		align: "right",
		format: (v) =>
			typeof v === "number" ? formatNumber(v / 1_000_000, 2) : "—",
	},
	{
		key: "cetes",
		label: "Cetes",
		align: "right",
		format: (v) =>
			typeof v === "number" ? formatNumber(v / 1_000_000, 2) : "—",
	},
	{
		key: "bonos",
		label: "Bonos",
		align: "right",
		format: (v) =>
			typeof v === "number" ? formatNumber(v / 1_000_000, 2) : "—",
	},
];

export function SecuritiesGrid({
	data,
}: {
	data: { date: string; total?: number; cetes?: number; bonos?: number }[];
}) {
	const rows = data.map((row) => ({
		date: row.date,
		total: row.total,
		cetes: row.cetes,
		bonos: row.bonos,
	})) as Record<string, unknown>[];

	return (
		<DataGrid
			columns={columns}
			data={rows}
			csvFilename="valores-gubernamentales"
			caption="Miles de pesos — valores mostrados en billones de MXN"
		/>
	);
}
