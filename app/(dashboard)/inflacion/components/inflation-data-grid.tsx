"use client";

import { useMemo } from "react";
import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { InflationPoint } from "../types/inflation";

function indexCell(value: unknown): string {
	if (typeof value !== "number") return "—";
	return formatNumber(value, 3);
}

function pctCell(value: unknown): string {
	if (typeof value !== "number") return "—";
	return `${formatNumber(value, 2)}%`;
}

const columns: DataGridColumn[] = [
	{
		key: "date",
		label: "Fecha",
		format: (v) => (typeof v === "string" ? formatDisplayDate(v) : "—"),
	},
	{
		key: "inpc",
		label: "INPC",
		align: "right",
		format: indexCell,
	},
	{
		key: "core",
		label: "INPC Core",
		align: "right",
		format: indexCell,
	},
	{
		key: "inpcNoSub",
		label: "INPC No Core",
		align: "right",
		format: indexCell,
	},
	{
		key: "inflacionGeneral",
		label: "Inflación General %",
		align: "right",
		format: pctCell,
	},
	{
		key: "inflacionSub",
		label: "Inflación Core %",
		align: "right",
		format: pctCell,
	},
];

interface InflationDataGridProps {
	data: InflationPoint[];
}

export function InflationDataGrid({ data }: InflationDataGridProps) {
	const rows = useMemo(
		() => data.map((row) => ({ ...row }) as Record<string, unknown>),
		[data],
	);

	return <DataGrid columns={columns} data={rows} csvFilename="inflacion" />;
}
