"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatChartTick } from "@/lib/constants";
import type { TourismSpendingPoint } from "../types/tourism";

const chartConfig = {
  turista: { label: "Turista General", color: "var(--chart-1)" },
  noFronterizo: { label: "No Fronterizo", color: "var(--chart-3)" },
  crucero: { label: "Crucero", color: "var(--chart-4)" },
};

interface Props {
  data: TourismSpendingPoint[];
}

export function SpendingChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gasto Medio por Visitante (USD)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <LineChart
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
              tickFormatter={(v: number) => `$${v.toFixed(0)}`}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="noFronterizo"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={false}
              type="monotone"
            />
            <Line
              dataKey="turista"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
              type="monotone"
            />
            <Line
              dataKey="crucero"
              stroke="var(--chart-4)"
              strokeWidth={1.5}
              dot={false}
              type="monotone"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
