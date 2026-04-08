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
import type { TransfersPoint } from "../types/payments";

const chartConfig = {
  tefNum: { label: "TEF CECOBAN", color: "var(--chart-1)" },
  internetMismoNum: { label: "Internet Mismo Bco", color: "var(--chart-2)" },
  internetInterNum: { label: "Internet Interbanc.", color: "var(--chart-3)" },
};

interface Props {
  data: TransfersPoint[];
}

export function TransfersChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transferencias Electrónicas</CardTitle>
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
              dataKey="tefNum"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
              type="monotone"
            />
            <Line
              dataKey="internetMismoNum"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
              type="monotone"
            />
            <Line
              dataKey="internetInterNum"
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
