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
import type { ActivityPoint } from "../types/activity";

const chartConfig = {
	total: {
		label: "IGAE total",
		color: "var(--chart-1)",
	},
	primarias: {
		label: "Primarias",
		color: "var(--chart-2)",
	},
	secundarias: {
		label: "Secundarias",
		color: "var(--chart-3)",
	},
	terciarias: {
		label: "Terciarias",
		color: "var(--chart-4)",
	},
};

interface ActivityChartProps {
	data: ActivityPoint[];
	period: Period;
}

export function ActivityChart({ data, period }: ActivityChartProps) {
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
				<CardTitle>Actividad Económica (IGAE)</CardTitle>
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
							className="text-xs text-muted-foreground"
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Line
							type="monotone"
							dataKey="total"
							stroke="var(--chart-1)"
							strokeWidth={2.5}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="primarias"
							stroke="var(--chart-2)"
							strokeWidth={1.5}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="secundarias"
							stroke="var(--chart-3)"
							strokeWidth={1.5}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="terciarias"
							stroke="var(--chart-4)"
							strokeWidth={1.5}
							dot={false}
							connectNulls
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
