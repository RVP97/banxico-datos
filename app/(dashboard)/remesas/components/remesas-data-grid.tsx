"use client";

import { useMemo } from "react";
import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { RemittancesPoint } from "../types/remittances";

function num2(value: unknown): string {
	if (typeof value !== "number") return "—";
	return formatNumber(value, 2);
}

const columns: DataGridColumn[] = [
	{
		key: "date",
		label: "Fecha",
		format: (v) => (typeof v === "string" ? formatDisplayDate(v) : "—"),
	},
	{
		key: "value",
		label: "Remesas (MDD)",
		align: "right",
		format: num2,
	},
];

interface RemesasDataGridProps {
	data: RemittancesPoint[];
}

export function RemesasDataGrid({ data }: RemesasDataGridProps) {
	const rows = useMemo(
		() => data.map((row) => ({ ...row }) as Record<string, unknown>),
		[data],
	);

	return (
		<DataGrid
			columns={columns}
			data={rows}
			csvFilename="remesas"
			caption="Remesas familiares (millones de dólares)"
		/>
	);
}
