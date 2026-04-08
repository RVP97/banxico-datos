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
import type { SpeiP2PPoint } from "../types/payments";

const chartConfig = {
  menor8kNum: { label: "< 8,000 MXN", color: "var(--chart-1)" },
  entre8k300kNum: { label: "8k – 300k MXN", color: "var(--chart-2)" },
  mayor300kNum: { label: "> 300,000 MXN", color: "var(--chart-3)" },
};

interface Props {
  data: SpeiP2PPoint[];
}

export function SpeiP2PChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SPEI P2P — Distribución por Monto</CardTitle>
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
              tickFormatter={(v: number) =>
                v >= 1_000_000
                  ? `${(v / 1_000_000).toFixed(1)}M`
                  : `${(v / 1_000).toFixed(0)}k`
              }
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="menor8kNum"
              fill="var(--chart-1)"
              stackId="a"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="entre8k300kNum"
              fill="var(--chart-2)"
              stackId="a"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="mayor300kNum"
              fill="var(--chart-3)"
              stackId="a"
              radius={[1, 1, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
