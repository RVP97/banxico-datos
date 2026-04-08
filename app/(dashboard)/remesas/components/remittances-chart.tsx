"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { PeriodSelector } from "@/components/period-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { formatChartTick, type Period } from "@/lib/constants";
import type { RemittancesPoint } from "../types/remittances";

const chartConfig = {
	value: {
		label: "Remesas (MDD)",
		color: "var(--chart-3)",
	},
};

interface RemittancesChartProps {
	data: RemittancesPoint[];
	period: Period;
}

export function RemittancesChart({ data, period }: RemittancesChartProps) {
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
				<CardTitle>Remesas Familiares</CardTitle>
				<PeriodSelector value={period} onChange={handlePeriodChange} />
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[400px] w-full">
					<BarChart
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
							tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}B`}
							className="text-xs text-muted-foreground"
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Bar dataKey="value" fill="var(--chart-3)" radius={[1, 1, 0, 0]} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
