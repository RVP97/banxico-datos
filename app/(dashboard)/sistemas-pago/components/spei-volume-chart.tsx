"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { PeriodSelector } from "@/components/period-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatChartTick, type Period } from "@/lib/constants";
import type { SpeiDailyPoint } from "../types/payments";

const chartConfig = {
  enviadasNum: { label: "Enviadas", color: "var(--chart-1)" },
  recibidasNum: { label: "Recibidas", color: "var(--chart-2)" },
};

interface Props {
  data: SpeiDailyPoint[];
  period: Period;
}

export function SpeiVolumeChart({ data, period }: Props) {
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
        <CardTitle>SPEI — Operaciones Diarias</CardTitle>
        <PeriodSelector value={period} onChange={handlePeriodChange} />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
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
              dataKey="enviadasNum"
              fill="var(--chart-1)"
              stroke="var(--chart-1)"
              fillOpacity={0.3}
              type="monotone"
              dot={false}
            />
            <Area
              dataKey="recibidasNum"
              fill="var(--chart-2)"
              stroke="var(--chart-2)"
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
