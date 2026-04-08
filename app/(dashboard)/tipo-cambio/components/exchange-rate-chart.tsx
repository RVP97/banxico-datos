"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { PeriodSelector } from "@/components/period-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { formatChartTick, type Period } from "@/lib/constants";
import type { ExchangeRatePoint } from "../types/exchange-rates";

const chartConfig = {
	value: {
		label: "USD/MXN",
		color: "var(--chart-1)",
	},
};

interface ExchangeRateChartProps {
	data: ExchangeRatePoint[];
	period: Period;
}

export function ExchangeRateChart({ data, period }: ExchangeRateChartProps) {
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
				<CardTitle>Tipo de Cambio USD/MXN (FIX)</CardTitle>
				<PeriodSelector value={period} onChange={handlePeriodChange} />
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[400px] w-full">
					<AreaChart
						data={data}
						margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
					>
						<defs>
							<linearGradient id="fillUsd" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor="var(--chart-1)"
									stopOpacity={0.3}
								/>
								<stop
									offset="100%"
									stopColor="var(--chart-1)"
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
							domain={["auto", "auto"]}
							tickFormatter={(v: number) => v.toFixed(2)}
							className="text-xs text-muted-foreground"
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Area
							type="monotone"
							dataKey="value"
							stroke="var(--chart-1)"
							fill="url(#fillUsd)"
							strokeWidth={2}
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
