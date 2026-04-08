"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Line,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { PeriodSelector } from "@/components/period-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	formatChartTick,
	formatDisplayDate,
	formatNumber,
	type Period,
} from "@/lib/constants";
import type { FiscalPoint } from "../types/fiscal";

const chartConfig = {
	ingresos: {
		label: "Ingresos",
		color: "var(--chart-3)",
	},
	gasto: {
		label: "Gasto",
		color: "var(--destructive)",
	},
	balancePresupuestario: {
		label: "Balance Presupuestario",
		color: "var(--chart-4)",
	},
	balancePrimario: {
		label: "Balance Primario",
		color: "var(--chart-5)",
	},
};

function billionsFmt(value: unknown): string {
	if (value == null || value === "") return "—";
	const n = typeof value === "number" ? value : Number(value);
	if (Number.isNaN(n)) return "—";
	return formatNumber(n / 1_000_000, 2);
}

const gridColumns: DataGridColumn[] = [
	{
		key: "date",
		label: "Fecha",
		align: "left",
		format: (value) => (value != null ? formatDisplayDate(String(value)) : "—"),
	},
	{
		key: "ingresos",
		label: "Ingresos (mil millones MXN)",
		align: "right",
		format: billionsFmt,
	},
	{
		key: "gasto",
		label: "Gasto (mil millones MXN)",
		align: "right",
		format: billionsFmt,
	},
	{
		key: "balancePresupuestario",
		label: "Balance presupuestario (mil millones MXN)",
		align: "right",
		format: billionsFmt,
		isChange: true,
	},
	{
		key: "balancePrimario",
		label: "Balance primario (mil millones MXN)",
		align: "right",
		format: billionsFmt,
		isChange: true,
	},
];

interface FiscalChartProps {
	data: FiscalPoint[];
	period: Period;
}

export function FiscalChart({ data, period }: FiscalChartProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handlePeriodChange = (newPeriod: Period) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("period", newPeriod);
		router.push(`?${params.toString()}`);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Finanzas públicas</CardTitle>
				<PeriodSelector value={period} onChange={handlePeriodChange} />
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[400px] w-full">
					<ComposedChart
						data={data}
						margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
					>
						<CartesianGrid
							vertical={false}
							strokeDasharray="3 3"
							className="stroke-border"
						/>
						<XAxis
							dataKey="date"
							tickLine={false}
							axisLine={false}
							minTickGap={32}
							tickFormatter={formatChartTick}
							className="text-xs text-muted-foreground"
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)}B`}
							className="text-xs text-muted-foreground"
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						<ReferenceLine y={0} stroke="var(--border)" />
						<Bar
							dataKey="ingresos"
							fill="var(--chart-3)"
							radius={[1, 1, 0, 0]}
						/>
						<Bar
							dataKey="gasto"
							fill="var(--destructive)"
							radius={[1, 1, 0, 0]}
						/>
						<Line
							type="monotone"
							dataKey="balancePresupuestario"
							stroke="var(--chart-4)"
							strokeWidth={2}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="balancePrimario"
							stroke="var(--chart-5)"
							strokeWidth={2}
							dot={false}
							connectNulls
						/>
					</ComposedChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

interface FiscalDataGridProps {
	data: FiscalPoint[];
}

export function FiscalDataGrid({ data }: FiscalDataGridProps) {
	const rows = useMemo(() => {
		const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));
		return sorted.map((row) => ({
			date: row.date,
			ingresos: row.ingresos ?? null,
			gasto: row.gasto ?? null,
			balancePresupuestario: row.balancePresupuestario ?? null,
			balancePrimario: row.balancePrimario ?? null,
		})) as Record<string, unknown>[];
	}, [data]);

	return (
		<DataGrid
			columns={gridColumns}
			data={rows}
			csvFilename="finanzas-publicas"
			caption="Series mensuales (miles de MXN mostrados como miles de millones: valor ÷ 1.000.000)"
		/>
	);
}
