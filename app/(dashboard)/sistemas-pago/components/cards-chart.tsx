"use client";

import { useMemo } from "react";
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
import type { CardsPoint } from "../types/payments";

const chartConfig = {
  credito: { label: "Crédito", color: "var(--chart-1)" },
  debito: { label: "Débito", color: "var(--chart-4)" },
};

interface Props {
  data: CardsPoint[];
}

export function CardsChart({ data }: Props) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        date: d.date,
        credito:
          (d.creditoMC ?? 0) + (d.creditoVisa ?? 0) + (d.creditoOtras ?? 0),
        debito: (d.debitoMC ?? 0) + (d.debitoVisa ?? 0) + (d.debitoOtras ?? 0),
      })),
    [data],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarjetas Bancarias en Circulación</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart
            data={chartData}
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
              tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)}M`}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="credito"
              fill="var(--chart-1)"
              radius={[1, 1, 0, 0]}
            />
            <Bar dataKey="debito" fill="var(--chart-4)" radius={[1, 1, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
