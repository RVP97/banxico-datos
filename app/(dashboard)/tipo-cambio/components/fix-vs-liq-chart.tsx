"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
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
import type { FixVsLiqPoint } from "../types/exchange-rates";

const chartConfig = {
	fix: {
		label: "FIX",
		color: "var(--chart-1)",
	},
	liquidacion: {
		label: "Liquidación",
		color: "var(--chart-3)",
	},
};

interface FixVsLiqChartProps {
	data: FixVsLiqPoint[];
	period: Period;
}

export function FixVsLiqChart({ data, period }: FixVsLiqChartProps) {
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
				<CardTitle>USD/MXN: FIX vs Liquidación</CardTitle>
				<PeriodSelector value={period} onChange={handlePeriodChange} />
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[400px] w-full">
					<LineChart
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
							domain={["auto", "auto"]}
							tickFormatter={(v: number) => v.toFixed(2)}
							className="text-xs text-muted-foreground"
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Line
							type="monotone"
							dataKey="fix"
							stroke="var(--chart-1)"
							strokeWidth={2}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="liquidacion"
							stroke="var(--chart-3)"
							strokeWidth={2}
							dot={false}
							connectNulls
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
