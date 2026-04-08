"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
	expNoPetroleras: {
		label: "No Petroleras",
		color: "var(--chart-2)",
	},
	expPetroleras: {
		label: "Petroleras",
		color: "var(--chart-5)",
	},
};

interface ExportBreakdownChartProps {
	data: TradePoint[];
	period: Period;
}

export function ExportBreakdownChart({ data }: ExportBreakdownChartProps) {
	const filtered = data.filter(
		(d) => d.expPetroleras != null || d.expNoPetroleras != null,
	);

	if (filtered.length === 0) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Exportaciones: Petroleras vs No Petroleras</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[350px] w-full">
					<AreaChart
						data={filtered}
						margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
					>
						<defs>
							<linearGradient id="fillNonPetro" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor="var(--chart-2)"
									stopOpacity={0.3}
								/>
								<stop
									offset="100%"
									stopColor="var(--chart-2)"
									stopOpacity={0.05}
								/>
							</linearGradient>
							<linearGradient id="fillPetro" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor="var(--chart-5)"
									stopOpacity={0.3}
								/>
								<stop
									offset="100%"
									stopColor="var(--chart-5)"
									stopOpacity={0.05}
								/>
							</linearGradient>
						</defs>
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
						<Area
							type="monotone"
							dataKey="expNoPetroleras"
							stackId="exp"
							stroke="var(--chart-2)"
							fill="url(#fillNonPetro)"
							strokeWidth={2}
							connectNulls
						/>
						<Area
							type="monotone"
							dataKey="expPetroleras"
							stackId="exp"
							stroke="var(--chart-5)"
							fill="url(#fillPetro)"
							strokeWidth={2}
							connectNulls
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
