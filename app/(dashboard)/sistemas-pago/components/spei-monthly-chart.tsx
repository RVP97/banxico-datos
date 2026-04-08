"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatChartTick } from "@/lib/constants";
import type { SpeiMonthlyPoint } from "../types/payments";

const chartConfig = {
  numero: { label: "Número de Operaciones", color: "var(--chart-1)" },
  monto: { label: "Monto (MXN)", color: "var(--chart-3)" },
};

interface Props {
  data: SpeiMonthlyPoint[];
}

export function SpeiMonthlyChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SPEI P2P — Agregado Mensual</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
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
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) =>
                v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(0)}M`
                  : `${(v / 1_000).toFixed(0)}k`
              }
              className="text-xs text-muted-foreground"
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => {
                if (v >= 1e12) return `${(v / 1e12).toFixed(1)}T`;
                if (v >= 1e9) return `${(v / 1e9).toFixed(0)}B`;
                return `${(v / 1e6).toFixed(0)}M`;
              }}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              yAxisId="left"
              dataKey="numero"
              fill="var(--chart-1)"
              radius={[1, 1, 0, 0]}
              opacity={0.8}
            />
            <Line
              yAxisId="right"
              dataKey="monto"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={false}
              type="monotone"
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
