"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useId } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ReferenceLine,
	XAxis,
	YAxis,
} from "recharts";
import { PeriodSelector } from "@/components/period-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { formatChartTick, type Period } from "@/lib/constants";

const SPREAD_POSITIVE = "var(--chart-3)";
const SPREAD_STROKE = "var(--chart-3)";

const chartConfig = {
	spread: {
		label: "TIIE 28d − Tasa Objetivo",
		color: SPREAD_STROKE,
	},
};

interface SpreadChartProps {
	data: { date: string; spread: number }[];
	period: Period;
}

export function SpreadChart({ data, period }: SpreadChartProps) {
	const rawId = useId();
	const fillId = `spreadFill-${rawId.replace(/:/g, "")}`;
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
				<CardTitle>Spread TIIE 28d vs tasa objetivo</CardTitle>
				<PeriodSelector value={period} onChange={handlePeriodChange} />
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[320px] w-full">
					<AreaChart
						data={data}
						margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
					>
						<defs>
							<linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor={SPREAD_POSITIVE}
									stopOpacity={0.45}
								/>
								<stop
									offset="100%"
									stopColor={SPREAD_POSITIVE}
									stopOpacity={0.08}
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
							tickFormatter={(v: number) => `${v.toFixed(2)} pp`}
							className="text-xs text-muted-foreground"
						/>
						<ReferenceLine
							y={0}
							stroke="var(--destructive)"
							strokeWidth={1.5}
							strokeDasharray="4 4"
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Area
							type="monotone"
							dataKey="spread"
							stroke={SPREAD_STROKE}
							strokeWidth={1.5}
							fill={`url(#${fillId})`}
							baseLine={0}
							dot={false}
							connectNulls
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
