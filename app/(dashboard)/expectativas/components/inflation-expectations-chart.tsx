"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
import type { ExpectationPoint } from "../types/expectations";

const chartConfig = {
	inflacion: {
		label: "Inflación esperada (cierre año)",
		color: "var(--destructive)",
	},
};

interface Props {
	data: ExpectationPoint[];
	period: Period;
}

export function InflationExpectationsChart({ data, period }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handlePeriodChange = (p: Period) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("period", p);
		router.push(`?${params.toString()}`);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Inflación esperada</CardTitle>
				<PeriodSelector value={period} onChange={handlePeriodChange} />
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
							domain={["dataMin - 0.5", "dataMax + 0.5"]}
							className="text-xs text-muted-foreground"
						/>
						<ReferenceLine
							y={3}
							stroke="var(--muted-foreground)"
							strokeDasharray="6 3"
							label={{
								value: "Meta 3%",
								position: "insideTopRight",
								className: "text-xs fill-muted-foreground",
							}}
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Area
							type="monotone"
							dataKey="inflacion"
							stroke="var(--destructive)"
							fill="var(--destructive)"
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
