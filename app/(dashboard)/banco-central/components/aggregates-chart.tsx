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
import type { AggregatePoint } from "../types/central-bank";

const chartConfig = {
	m1: {
		label: "M1",
		color: "var(--chart-1)",
	},
	m2: {
		label: "M2",
		color: "var(--chart-2)",
	},
	m4: {
		label: "M4",
		color: "var(--chart-5)",
	},
};

interface AggregatesChartProps {
	data: AggregatePoint[];
	period: Period;
}

export function AggregatesChart({ data, period }: AggregatesChartProps) {
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
				<CardTitle>Agregados monetarios (M1, M2, M4)</CardTitle>
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
							tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(1)}B`}
							className="text-xs text-muted-foreground"
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Line
							type="monotone"
							dataKey="m1"
							stroke="var(--chart-1)"
							strokeWidth={2}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="m2"
							stroke="var(--chart-2)"
							strokeWidth={2}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="m4"
							stroke="var(--chart-5)"
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
