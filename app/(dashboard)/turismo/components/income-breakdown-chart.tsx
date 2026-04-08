"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatChartTick } from "@/lib/constants";
import type { TourismIncomeBreakdownPoint } from "../types/tourism";

const chartConfig = {
  noFronterizos: { label: "No Fronterizos", color: "var(--chart-1)" },
  cruceros: { label: "Cruceros", color: "var(--chart-4)" },
  frontPernocta: { label: "Fronterizo Pernocta", color: "var(--chart-2)" },
  frontSinPernocta: {
    label: "Fronterizo Sin Pernocta",
    color: "var(--chart-5)",
  },
};

interface Props {
  data: TourismIncomeBreakdownPoint[];
}

export function IncomeBreakdownChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos por Tipo de Visitante (Miles USD)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
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
              tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(1)}B`}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="noFronterizos"
              stackId="a"
              fill="var(--chart-1)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="frontPernocta"
              stackId="a"
              fill="var(--chart-2)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="frontSinPernocta"
              stackId="a"
              fill="var(--chart-5)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="cruceros"
              stackId="a"
              fill="var(--chart-4)"
              radius={[1, 1, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
