"use client";

import { useMemo } from "react";
import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { TradePoint } from "../types/trade";

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
		key: "exportaciones",
		label: "Exportaciones",
		align: "right",
		format: num2,
	},
	{
		key: "importaciones",
		label: "Importaciones",
		align: "right",
		format: num2,
	},
	{
		key: "balanza",
		label: "Balanza",
		align: "right",
		format: num2,
	},
	{
		key: "expPetroleras",
		label: "Exp. Petroleras",
		align: "right",
		format: num2,
	},
	{
		key: "expNoPetroleras",
		label: "Exp. No Petroleras",
		align: "right",
		format: num2,
	},
];

interface TradeDataGridProps {
	data: TradePoint[];
}

export function TradeDataGrid({ data }: TradeDataGridProps) {
	const rows = useMemo(
		() => data.map((row) => ({ ...row }) as Record<string, unknown>),
		[data],
	);

	return (
		<DataGrid
			columns={columns}
			data={rows}
			csvFilename="comercio-exterior"
			caption="Comercio exterior (miles de USD)"
		/>
	);
}
