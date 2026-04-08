"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { YieldCurvePoint } from "../types/interest-rates";

const chartConfig = {
	rate: {
		label: "Tasa",
		color: "var(--chart-1)",
	},
};

interface YieldCurveCardProps {
	data: YieldCurvePoint[];
}

export function YieldCurveCard({ data }: YieldCurveCardProps) {
	return (
		<Card className="h-full">
			<CardHeader className="pb-2">
				<CardTitle className="text-base">
					Curva de Rendimiento (Cetes)
				</CardTitle>
			</CardHeader>
			<CardContent>
				{data.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						Sin datos de Cetes para mostrar la curva.
					</p>
				) : (
					<ChartContainer config={chartConfig} className="h-[200px] w-full">
						<LineChart
							data={data}
							margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
						>
							<CartesianGrid
								vertical={false}
								strokeDasharray="3 3"
								className="stroke-border"
							/>
							<XAxis
								dataKey="maturity"
								tickLine={false}
								axisLine={false}
								className="text-xs text-muted-foreground"
							/>
							<YAxis
								tickLine={false}
								axisLine={false}
								tickFormatter={(v: number) => `${v}%`}
								className="text-xs text-muted-foreground"
							/>
							<ChartTooltip content={<ChartTooltipContent />} />
							<Line
								type="monotone"
								dataKey="rate"
								stroke="var(--chart-1)"
								strokeWidth={2}
								dot={{
									fill: "var(--chart-1)",
									stroke: "var(--chart-1)",
									r: 4,
								}}
								activeDot={{ r: 5 }}
							/>
						</LineChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
}
