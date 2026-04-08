"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { PeriodSelector } from "@/components/period-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { formatChartTick, formatNumber, type Period } from "@/lib/constants";
import type { MonetaryBasePoint } from "../types/central-bank";

const chartConfig = {
	billetesMonedas: {
		label: "Billetes y monedas",
		color: "var(--chart-1)",
	},
	depositosBancarios: {
		label: "Depósitos bancarios",
		color: "var(--chart-2)",
	},
};

interface BaseMonetariaChartProps {
	data: MonetaryBasePoint[];
	period: Period;
}

export function BaseMonetariaChart({ data, period }: BaseMonetariaChartProps) {
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
				<CardTitle>
					Base monetaria: billetes y monedas vs depósitos bancarios
				</CardTitle>
				<PeriodSelector value={period} onChange={handlePeriodChange} />
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[400px] w-full">
					<AreaChart
						data={data}
						margin={{ top: 10, right: 10, bottom: 0, left: 10 }}
					>
						<defs>
							<linearGradient id="fillBilletes" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor="var(--chart-1)"
									stopOpacity={0.25}
								/>
								<stop
									offset="100%"
									stopColor="var(--chart-1)"
									stopOpacity={0.02}
								/>
							</linearGradient>
							<linearGradient id="fillDepositos" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									stopColor="var(--chart-2)"
									stopOpacity={0.25}
								/>
								<stop
									offset="100%"
									stopColor="var(--chart-2)"
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
							tickFormatter={(v: number) => formatNumber(v, 0)}
							className="text-xs text-muted-foreground"
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Area
							type="monotone"
							dataKey="billetesMonedas"
							stackId="base"
							stroke="var(--chart-1)"
							fill="url(#fillBilletes)"
							strokeWidth={2}
							connectNulls
						/>
						<Area
							type="monotone"
							dataKey="depositosBancarios"
							stackId="base"
							stroke="var(--chart-2)"
							fill="url(#fillDepositos)"
							strokeWidth={2}
							connectNulls
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
