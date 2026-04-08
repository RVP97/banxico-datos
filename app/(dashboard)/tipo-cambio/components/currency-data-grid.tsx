"use client";

import { useMemo } from "react";
import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { ExchangeRateGridRow } from "../types/exchange-rates";

function num4(value: unknown): string {
	if (typeof value !== "number") return "—";
	return formatNumber(value, 4);
}

const columns: DataGridColumn[] = [
	{
		key: "date",
		label: "Fecha",
		align: "left",
		format: (v) => (typeof v === "string" ? formatDisplayDate(v) : "—"),
	},
	{
		key: "usdFix",
		label: "USD FIX",
		align: "right",
		format: num4,
	},
	{
		key: "usdLiq",
		label: "USD Liq",
		align: "right",
		format: num4,
	},
	{
		key: "eur",
		label: "EUR",
		align: "right",
		format: num4,
	},
	{
		key: "gbp",
		label: "GBP",
		align: "right",
		format: num4,
	},
	{
		key: "cad",
		label: "CAD",
		align: "right",
		format: num4,
	},
	{
		key: "jpy",
		label: "JPY",
		align: "right",
		format: num4,
	},
	{
		key: "cny",
		label: "CNY",
		align: "right",
		format: num4,
	},
];

interface CurrencyDataGridProps {
	gridData: ExchangeRateGridRow[];
}

export function CurrencyDataGrid({ gridData }: CurrencyDataGridProps) {
	const rows = useMemo(
		() =>
			[...gridData]
				.sort((a, b) => b.date.localeCompare(a.date))
				.map(
					(row) =>
						({
							date: row.date,
							usdFix: row.usdFix ?? null,
							usdLiq: row.usdLiq ?? null,
							eur: row.eur ?? null,
							gbp: row.gbp ?? null,
							cad: row.cad ?? null,
							jpy: row.jpy ?? null,
							cny: row.cny ?? null,
						}) as Record<string, unknown>,
				),
		[gridData],
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Series diarias</CardTitle>
			</CardHeader>
			<CardContent>
				<DataGrid columns={columns} data={rows} csvFilename="tipo-cambio" />
			</CardContent>
		</Card>
	);
}
