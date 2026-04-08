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
import type { RatePoint } from "../types/interest-rates";

const chartConfig = {
	tasaObjetivo: {
		label: "Tasa Objetivo",
		color: "var(--chart-1)",
	},
	tiie28: {
		label: "TIIE 28d",
		color: "var(--chart-2)",
	},
	tiie91: {
		label: "TIIE 91d",
		color: "var(--chart-3)",
	},
	cetes28: {
		label: "Cetes 28d",
		color: "var(--chart-4)",
	},
	cetes91: {
		label: "Cetes 91d",
		color: "var(--chart-5)",
	},
	cetes182: {
		label: "Cetes 182d",
		color: "var(--color-muted-foreground)",
	},
	cetes364: {
		label: "Cetes 364d",
		color: "var(--chart-2)",
	},
};

interface RatesChartProps {
	data: RatePoint[];
	period: Period;
}

export function RatesChart({ data, period }: RatesChartProps) {
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
				<CardTitle>Tasas de Interés</CardTitle>
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
							tickFormatter={(v: number) => `${v}%`}
							className="text-xs text-muted-foreground"
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Line
							type="stepAfter"
							dataKey="tasaObjetivo"
							stroke="var(--chart-1)"
							strokeWidth={2}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="tiie28"
							stroke="var(--chart-2)"
							strokeWidth={1.5}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="tiie91"
							stroke="var(--chart-3)"
							strokeWidth={1.5}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="cetes28"
							stroke="var(--chart-4)"
							strokeWidth={1.5}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="cetes91"
							stroke="var(--chart-5)"
							strokeWidth={1.5}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="cetes182"
							stroke="var(--color-muted-foreground)"
							strokeWidth={1.5}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="cetes364"
							stroke="var(--chart-2)"
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
