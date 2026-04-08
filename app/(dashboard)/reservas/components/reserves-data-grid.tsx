"use client";

import { useMemo } from "react";
import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { ReservesPoint } from "../types/reserves";

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
		label: "Reservas (MDD)",
		align: "right",
		format: num2,
	},
];

interface ReservesDataGridProps {
	data: ReservesPoint[];
}

export function ReservesDataGrid({ data }: ReservesDataGridProps) {
	const rows = useMemo(
		() => data.map((row) => ({ ...row }) as Record<string, unknown>),
		[data],
	);

	return (
		<DataGrid
			columns={columns}
			data={rows}
			csvFilename="reservas"
			caption="Reservas internacionales (millones de dólares)"
		/>
	);
}
