"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { formatChartTick } from "@/lib/constants";
import type { ExpectationPoint } from "../types/expectations";

const chartConfig = {
	desempleo: {
		label: "Desempleo esperado",
		color: "var(--chart-1)",
	},
};

interface Props {
	data: ExpectationPoint[];
}

export function UnemploymentExpectationsChart({ data }: Props) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Desempleo esperado</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[300px] w-full">
					<AreaChart
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
							minTickGap={40}
							tickFormatter={formatChartTick}
							className="text-xs text-muted-foreground"
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickFormatter={(v: number) => `${v}%`}
							domain={["dataMin - 0.2", "dataMax + 0.2"]}
							className="text-xs text-muted-foreground"
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Area
							type="monotone"
							dataKey="desempleo"
							stroke="var(--chart-1)"
							fill="var(--chart-1)"
							fillOpacity={0.1}
							strokeWidth={2}
							dot={false}
							connectNulls
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
