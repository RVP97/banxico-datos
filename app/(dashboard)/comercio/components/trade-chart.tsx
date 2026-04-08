"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Line,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import { PeriodSelector } from "@/components/period-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { formatChartTick, type Period } from "@/lib/constants";
import type { TradePoint } from "../types/trade";

const chartConfig = {
	exportaciones: {
		label: "Exportaciones",
		color: "var(--chart-2)",
	},
	importaciones: {
		label: "Importaciones",
		color: "var(--chart-1)",
	},
	balanza: {
		label: "Balanza Comercial",
		color: "var(--chart-4)",
	},
};

interface TradeChartProps {
	data: TradePoint[];
	period: Period;
}

export function TradeChart({ data, period }: TradeChartProps) {
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
				<CardTitle>Comercio Exterior</CardTitle>
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
							dataKey="exportaciones"
							fill="var(--chart-2)"
							radius={[1, 1, 0, 0]}
						/>
						<Bar
							dataKey="importaciones"
							fill="var(--chart-1)"
							radius={[1, 1, 0, 0]}
						/>
						<Line
							type="monotone"
							dataKey="balanza"
							stroke="var(--chart-4)"
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
