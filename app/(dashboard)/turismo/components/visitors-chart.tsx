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
import type { TourismVisitorsPoint } from "../types/tourism";

const chartConfig = {
  turistas: { label: "Turistas", color: "var(--chart-1)" },
  excursionistas: { label: "Excursionistas", color: "var(--chart-2)" },
  cruceros: { label: "Cruceros", color: "var(--chart-4)" },
  egresos: { label: "Visitantes (Egresos)", color: "var(--chart-5)" },
};

interface Props {
  data: TourismVisitorsPoint[];
}

export function VisitorsChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitantes Internacionales (Miles)</CardTitle>
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
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}M`}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="turistas"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.15}
              strokeWidth={1.5}
              type="monotone"
            />
            <Area
              dataKey="excursionistas"
              stroke="var(--chart-2)"
              fill="var(--chart-2)"
              fillOpacity={0.1}
              strokeWidth={1.5}
              type="monotone"
            />
            <Area
              dataKey="cruceros"
              stroke="var(--chart-4)"
              fill="var(--chart-4)"
              fillOpacity={0.1}
              strokeWidth={1.5}
              type="monotone"
            />
            <Area
              dataKey="egresos"
              stroke="var(--chart-5)"
              fill="var(--chart-5)"
              fillOpacity={0.05}
              strokeWidth={1.5}
              strokeDasharray="4 2"
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
