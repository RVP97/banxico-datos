"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import type { IEDPoint } from "../types/bop";

const chartConfig = {
	nuevas: {
		label: "Nuevas inversiones",
		color: "var(--chart-1)",
	},
	reinversion: {
		label: "Reinversión",
		color: "var(--chart-2)",
	},
	cuentas: {
		label: "Cuentas entre compañías",
		color: "var(--chart-3)",
	},
};

interface IEDChartProps {
	data: IEDPoint[];
	period: Period;
}

export function IEDChart({ data, period }: IEDChartProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handlePeriodChange = (newPeriod: Period) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("period", newPeriod);
		router.push(`?${params.toString()}`);
	};

	const filtered = data.filter(
		(d) => d.nuevas != null || d.reinversion != null || d.cuentas != null,
	);

	if (filtered.length === 0) return null;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>IED — desglose por componente</CardTitle>
				<PeriodSelector value={period} onChange={handlePeriodChange} />
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[400px] w-full">
					<BarChart
						data={filtered}
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
							minTickGap={24}
							tickFormatter={formatChartTick}
							className="text-xs text-muted-foreground"
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickFormatter={(v: number) => `${(v / 1_000).toFixed(0)}K`}
							className="text-xs text-muted-foreground"
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						<Bar
							dataKey="nuevas"
							stackId="ied"
							fill="var(--color-nuevas)"
							radius={[0, 0, 0, 0]}
						/>
						<Bar
							dataKey="reinversion"
							stackId="ied"
							fill="var(--color-reinversion)"
							radius={[0, 0, 0, 0]}
						/>
						<Bar
							dataKey="cuentas"
							stackId="ied"
							fill="var(--color-cuentas)"
							radius={[1, 1, 0, 0]}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
