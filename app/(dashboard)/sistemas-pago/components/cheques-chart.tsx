"use client";

import { useMemo } from "react";
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
import type { ChequesPoint } from "../types/payments";

const chartConfig = {
  totalNum: { label: "Cheques MN (Total)", color: "var(--chart-1)" },
  mismoMonto: { label: "Importe Mismo Bco (MDP)", color: "var(--chart-2)" },
  interMonto: { label: "Importe Interbanc. (MDP)", color: "var(--chart-3)" },
};

interface Props {
  data: ChequesPoint[];
}

export function ChequesChart({ data }: Props) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        date: d.date,
        totalNum: (d.mismoNum ?? 0) + (d.interNum ?? 0),
        mismoMonto: d.mismoMonto,
        interMonto: d.interMonto,
      })),
    [data],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cheques — Volumen e Importe</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <LineChart
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
              tickFormatter={(v: number) =>
                v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M`
                  : `${(v / 1_000).toFixed(0)}k`
              }
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="totalNum"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
              type="monotone"
            />
            <Line
              dataKey="mismoMonto"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
              type="monotone"
            />
            <Line
              dataKey="interMonto"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={false}
              type="monotone"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
