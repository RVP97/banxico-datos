"use client";

import { Area, AreaChart, XAxis } from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { SERIES_META, type SeriesId } from "@/lib/constants";
import type { SparklinePoint } from "../types/overview";

interface OverviewSparklinesProps {
	sparklines: Partial<Record<SeriesId, SparklinePoint[]>>;
	sparklineOrder: SeriesId[];
}

export function OverviewSparklines({
	sparklines,
	sparklineOrder,
}: OverviewSparklinesProps) {
	const entries = sparklineOrder
		.map((seriesId) => {
			const points = sparklines[seriesId];
			return points?.length ? ([seriesId, points] as const) : null;
		})
		.filter((e): e is readonly [SeriesId, SparklinePoint[]] => e != null);

	return (
		<div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
			{entries.map(([seriesId, points]) => {
				const meta = SERIES_META[seriesId];
				if (!meta) return null;

				const chartConfig = {
					value: {
						label: meta.shortLabel,
						color: "var(--chart-1)",
					},
				};

				return (
					<div key={seriesId} className="border border-border p-3">
						<p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
							{meta.shortLabel} — 3m
						</p>
						<ChartContainer config={chartConfig} className="h-[100px] w-full">
							<AreaChart
								data={points}
								margin={{ top: 5, right: 5, bottom: 0, left: 5 }}
							>
								<defs>
									<linearGradient
										id={`fill-${seriesId}`}
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop
											offset="0%"
											stopColor="var(--chart-1)"
											stopOpacity={0.3}
										/>
										<stop
											offset="100%"
											stopColor="var(--chart-1)"
											stopOpacity={0.05}
										/>
									</linearGradient>
								</defs>
								<XAxis dataKey="date" hide />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Area
									type="monotone"
									dataKey="value"
									stroke="var(--chart-1)"
									fill={`url(#fill-${seriesId})`}
									strokeWidth={1.5}
								/>
							</AreaChart>
						</ChartContainer>
					</div>
				);
			})}
		</div>
	);
}
