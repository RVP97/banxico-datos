"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatChartTick } from "@/lib/constants";
import type { CardOpsPoint } from "../types/payments";

const chartConfig = {
  numTotal: { label: "Operaciones Totales", color: "var(--chart-1)" },
  numDebito: { label: "Operaciones Débito", color: "var(--chart-4)" },
};

interface Props {
  data: CardOpsPoint[];
}

export function CardOpsChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operaciones Diarias con Tarjetas</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
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
              minTickGap={32}
              tickFormatter={formatChartTick}
              className="text-xs text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) =>
                v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M`
                  : `${(v / 1_000).toFixed(0)}k`
              }
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="numTotal"
              fill="var(--chart-1)"
              stroke="var(--chart-1)"
              fillOpacity={0.3}
              type="monotone"
              dot={false}
            />
            <Area
              dataKey="numDebito"
              fill="var(--chart-4)"
              stroke="var(--chart-4)"
              fillOpacity={0.2}
              type="monotone"
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
