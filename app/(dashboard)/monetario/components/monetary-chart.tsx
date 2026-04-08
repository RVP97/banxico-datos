"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
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
import type { MonetaryPoint } from "../types/monetary";

const chartConfig = {
	m1: {
		label: "M1",
		color: "var(--chart-1)",
	},
	m2: {
		label: "M2",
		color: "var(--chart-5)",
	},
	m4: {
		label: "M4",
		color: "var(--chart-3)",
	},
};

interface MonetaryChartProps {
	data: MonetaryPoint[];
	period: Period;
}

export function MonetaryChart({ data, period }: MonetaryChartProps) {
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
				<CardTitle>Agregados Monetarios</CardTitle>
				<PeriodSelector value={period} onChange={handlePeriodChange} />
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[400px] w-full">
					<AreaChart
						data={data}
						margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
					>
						<defs>
							<linearGradient id="fillM1" x1="0" y1="0" x2="0" y2="1">
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
							<linearGradient id="fillM2" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor="var(--chart-5)"
									stopOpacity={0.2}
								/>
								<stop
									offset="100%"
									stopColor="var(--chart-5)"
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
							tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(1)}B`}
							className="text-xs text-muted-foreground"
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Area
							type="monotone"
							dataKey="m2"
							stroke="var(--chart-5)"
							fill="url(#fillM2)"
							strokeWidth={2}
							connectNulls
						/>
						<Area
							type="monotone"
							dataKey="m1"
							stroke="var(--chart-1)"
							fill="url(#fillM1)"
							strokeWidth={2}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="m4"
							stroke="var(--chart-3)"
							strokeWidth={2}
							dot={false}
							connectNulls
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
