"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
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
import type { TourismBalancePoint } from "../types/tourism";

const chartConfig = {
  ingresos: { label: "Ingresos", color: "var(--chart-1)" },
  egresos: { label: "Egresos", color: "var(--chart-2)" },
  saldo: { label: "Saldo", color: "var(--chart-3)" },
};

interface Props {
  data: TourismBalancePoint[];
  period: Period;
}

export function TourismBalanceChart({ data, period }: Props) {
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
        <CardTitle>Ingresos vs Egresos por Turismo</CardTitle>
        <PeriodSelector value={period} onChange={handlePeriodChange} />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
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
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(1)}B`}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="ingresos"
              fill="var(--chart-1)"
              radius={[1, 1, 0, 0]}
              opacity={0.8}
            />
            <Bar
              dataKey="egresos"
              fill="var(--chart-2)"
              radius={[1, 1, 0, 0]}
              opacity={0.8}
            />
            <Line
              dataKey="saldo"
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
