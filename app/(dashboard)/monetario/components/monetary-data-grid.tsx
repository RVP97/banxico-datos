"use client";

import { useMemo } from "react";
import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { MonetaryPoint } from "../types/monetary";

function num0(value: unknown): string {
	if (typeof value !== "number") return "—";
	return formatNumber(value, 0);
}

const columns: DataGridColumn[] = [
	{
		key: "date",
		label: "Fecha",
		format: (v) => (typeof v === "string" ? formatDisplayDate(v) : "—"),
	},
	{
		key: "m1",
		label: "M1",
		align: "right",
		format: num0,
	},
	{
		key: "m2",
		label: "M2",
		align: "right",
		format: num0,
	},
];

interface MonetaryDataGridProps {
	data: MonetaryPoint[];
}

export function MonetaryDataGrid({ data }: MonetaryDataGridProps) {
	const rows = useMemo(
		() => data.map((row) => ({ ...row }) as Record<string, unknown>),
		[data],
	);

	return (
		<DataGrid
			columns={columns}
			data={rows}
			csvFilename="agregados-monetarios"
			caption="Agregados monetarios (miles de pesos)"
		/>
	);
}
