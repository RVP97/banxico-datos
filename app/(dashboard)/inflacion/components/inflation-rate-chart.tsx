"use client";

import {
	Area,
	AreaChart,
	CartesianGrid,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { formatChartTick } from "@/lib/constants";
import type { InflationPoint } from "../types/inflation";

const chartConfig = {
	inflacionGeneral: {
		label: "Inflación General",
		color: "var(--chart-1)",
	},
};

interface InflationRateChartProps {
	data: InflationPoint[];
}

export function InflationRateChart({ data }: InflationRateChartProps) {
	const filtered = data.filter((d) => d.inflacionGeneral != null);
	if (filtered.length === 0) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Inflación General Interanual (%)</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[300px] w-full">
					<AreaChart
						data={filtered}
						margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
					>
						<defs>
							<linearGradient id="fillInflacion" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor="var(--chart-1)"
									stopOpacity={0.2}
								/>
								<stop
									offset="100%"
									stopColor="var(--chart-1)"
									stopOpacity={0.02}
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
							tickFormatter={(v: number) => `${v.toFixed(1)}%`}
							className="text-xs text-muted-foreground"
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<ReferenceLine
							y={3}
							stroke="var(--destructive)"
							strokeDasharray="5 5"
							label={{
								value: "Objetivo 3%",
								position: "right",
								className: "text-xs fill-destructive",
							}}
						/>
						<Area
							type="monotone"
							dataKey="inflacionGeneral"
							stroke="var(--chart-1)"
							fill="url(#fillInflacion)"
							strokeWidth={2}
							connectNulls
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
