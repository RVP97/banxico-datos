"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
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
import type { MoneyMarketPoint } from "../types/money-market";

const TASA_OBJETIVO_COLOR = "var(--chart-1)";
const TIIE_FONDEO_COLOR = "var(--chart-3)";
const TIIE_28_COLOR = "var(--chart-2)";
const CETES_28_COLOR = "var(--chart-4)";

const chartConfig = {
	tasaObjetivo: {
		label: "Tasa Objetivo",
		color: TASA_OBJETIVO_COLOR,
	},
	tiieFondeo: {
		label: "TIIE Fondeo",
		color: TIIE_FONDEO_COLOR,
	},
	tiie28: {
		label: "TIIE 28d",
		color: TIIE_28_COLOR,
	},
	cetes28: {
		label: "Cetes 28d",
		color: CETES_28_COLOR,
	},
};

interface MoneyMarketChartProps {
	data: MoneyMarketPoint[];
	period: Period;
}

export function MoneyMarketChart({ data, period }: MoneyMarketChartProps) {
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
				<CardTitle>Tasas clave del mercado de dinero</CardTitle>
				<PeriodSelector value={period} onChange={handlePeriodChange} />
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[400px] w-full">
					<ComposedChart
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
							stroke={TASA_OBJETIVO_COLOR}
							strokeWidth={2}
							strokeDasharray="6 4"
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="tiieFondeo"
							stroke={TIIE_FONDEO_COLOR}
							strokeWidth={1.5}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="tiie28"
							stroke={TIIE_28_COLOR}
							strokeWidth={1.5}
							dot={false}
							connectNulls
						/>
						<Line
							type="monotone"
							dataKey="cetes28"
							stroke={CETES_28_COLOR}
							strokeWidth={1.5}
							strokeDasharray="1 4"
							dot={false}
							connectNulls
						/>
					</ComposedChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
