"use client";

import { useMemo } from "react";
import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { ActivityPoint } from "../types/activity";

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
		key: "total",
		label: "IGAE",
		align: "right",
		format: num2,
	},
	{
		key: "primarias",
		label: "IGAE Primarias",
		align: "right",
		format: num2,
	},
	{
		key: "secundarias",
		label: "IGAE Secundarias",
		align: "right",
		format: num2,
	},
	{
		key: "terciarias",
		label: "IGAE Terciarias",
		align: "right",
		format: num2,
	},
	{
		key: "prodIndustrial",
		label: "Prod. Industrial",
		align: "right",
		format: num2,
	},
	{
		key: "prodManufactura",
		label: "Manufactura",
		align: "right",
		format: num2,
	},
	{
		key: "prodMineria",
		label: "Minería",
		align: "right",
		format: num2,
	},
];

interface ActivityDataGridProps {
	data: ActivityPoint[];
}

export function ActivityDataGrid({ data }: ActivityDataGridProps) {
	const rows = useMemo(
		() => data.map((row) => ({ ...row }) as Record<string, unknown>),
		[data],
	);

	return (
		<DataGrid
			columns={columns}
			data={rows}
			csvFilename="actividad-economica"
			caption="Serie histórica (IGAE y producción industrial, base 2018=100)"
		/>
	);
}
