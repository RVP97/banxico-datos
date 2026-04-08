"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceArea,
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
import type { LaborPoint } from "../types/labor";

const chartConfig = {
	desocupacion: {
		label: "Desocupación",
		color: "var(--chart-2)",
	},
	subocupacion: {
		label: "Subocupación",
		color: "var(--chart-1)",
	},
	expDesempleo: {
		label: "Desempleo esperado",
		color: "var(--muted-foreground)",
	},
};

interface LaborChartProps {
	data: LaborPoint[];
	period: Period;
}

export function LaborChart({ data, period }: LaborChartProps) {
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
				<CardTitle>Mercado laboral (%)</CardTitle>
				<PeriodSelector value={period} onChange={handlePeriodChange} />
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[400px] w-full">
					<LineChart
						data={data}
						margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
					>
						<ReferenceArea
							y1={2.85}
							y2={3.15}
							fill="var(--muted-foreground)"
							fillOpacity={0.12}
							ifOverflow="visible"
						/>
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
							tickFormatter={(v: number) => `${v}%`}
							className="text-xs text-muted-foreground"
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						<ReferenceLine
							y={3}
							stroke="var(--muted-foreground)"
							strokeDasharray="4 4"
							label={{
								value: "3% (tasa natural)",
								position: "right",
								className: "text-xs fill-muted-foreground",
							}}
						/>
						<Line
							type="monotone"
							dataKey="desocupacion"
							stroke="var(--chart-2)"
							strokeWidth={2}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="subocupacion"
							stroke="var(--chart-1)"
							strokeWidth={2}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="expDesempleo"
							stroke="var(--muted-foreground)"
							strokeWidth={2}
							strokeDasharray="6 4"
							dot={false}
							connectNulls
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
