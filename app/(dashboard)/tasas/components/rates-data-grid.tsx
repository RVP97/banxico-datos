"use client";

import { useMemo } from "react";
import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { RatePoint } from "../types/interest-rates";

function pctCell(value: unknown): string {
	if (typeof value !== "number") return "—";
	return formatNumber(value, 4);
}

const columns: DataGridColumn[] = [
	{
		key: "date",
		label: "Fecha",
		format: (v) => (typeof v === "string" ? formatDisplayDate(v) : "—"),
	},
	{
		key: "tasaObjetivo",
		label: "Tasa Objetivo",
		align: "right",
		format: pctCell,
	},
	{
		key: "tiieFondeo",
		label: "TIIE Fondeo",
		align: "right",
		format: pctCell,
	},
	{
		key: "tiie28",
		label: "TIIE 28d",
		align: "right",
		format: pctCell,
	},
	{
		key: "tiie91",
		label: "TIIE 91d",
		align: "right",
		format: pctCell,
	},
	{
		key: "cetes28",
		label: "Cetes 28d",
		align: "right",
		format: pctCell,
	},
	{
		key: "cetes91",
		label: "Cetes 91d",
		align: "right",
		format: pctCell,
	},
	{
		key: "cetes182",
		label: "Cetes 182d",
		align: "right",
		format: pctCell,
	},
	{
		key: "cetes364",
		label: "Cetes 364d",
		align: "right",
		format: pctCell,
	},
];

interface RatesDataGridProps {
	data: RatePoint[];
}

export function RatesDataGrid({ data }: RatesDataGridProps) {
	const rows = useMemo(
		() => data.map((row) => ({ ...row }) as Record<string, unknown>),
		[data],
	);

	return <DataGrid columns={columns} data={rows} csvFilename="tasas-interes" />;
}
