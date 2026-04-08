"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

type SeriesTone = "positive" | "negative" | "neutral";

function seriesTone(change: number | null | undefined): SeriesTone {
	if (change != null && change > 0) return "positive";
	if (change != null && change < 0) return "negative";
	return "neutral";
}

function SeriesCardSparkline({
	data,
	tone,
}: {
	data: number[];
	tone: SeriesTone;
}) {
	const chartData = data.map((v, i) => ({ i, v }));
	const stroke =
		tone === "positive"
			? "var(--chart-3)"
			: tone === "negative"
				? "var(--destructive)"
				: "var(--muted-foreground)";

	return (
		<div className="h-10 w-full">
			<ResponsiveContainer width="100%" height={40}>
				<AreaChart
					data={chartData}
					margin={{ top: 2, right: 0, bottom: 2, left: 0 }}
				>
					<Area
						type="monotone"
						dataKey="v"
						stroke={stroke}
						fill={stroke}
						fillOpacity={0.08}
						strokeWidth={1.5}
						dot={false}
						activeDot={false}
						isAnimationActive={false}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}

interface SeriesCardProps {
	title: string;
	value: string;
	unit: string;
	change?: number | null;
	date?: string;
	secondaryValue?: string;
	sparklineData?: number[];
	lastUpdated?: string;
}

export function SeriesCard({
	title,
	value,
	unit,
	change,
	date,
	secondaryValue,
	sparklineData,
	lastUpdated,
}: SeriesCardProps) {
	const tone = seriesTone(change);
	const isPositive = tone === "positive";
	const isNegative = tone === "negative";
	const isNeutral = tone === "neutral";

	const showSparkline = sparklineData != null && sparklineData.length > 1;

	return (
		<div className="border border-border p-3">
			<div className="flex items-start justify-between gap-2">
				<span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
					{title}
				</span>
				{!isNeutral && (
					<span
						className={cn(
							"inline-flex items-center gap-0.5 font-mono text-[11px] tabular-nums",
							isPositive && "text-emerald-500 dark:text-emerald-400",
							isNegative && "text-red-500 dark:text-red-400",
						)}
					>
						{isPositive ? (
							<ArrowUp className="size-2.5" />
						) : (
							<ArrowDown className="size-2.5" />
						)}
						{change != null ? Math.abs(change).toFixed(2) : "0.00"}%
					</span>
				)}
				{isNeutral && change !== undefined && (
					<span className="inline-flex items-center gap-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">
						<Minus className="size-2.5" />
						0.00%
					</span>
				)}
			</div>
			<div className="mt-1 flex items-baseline gap-1">
				<span className="font-mono text-xl font-bold tabular-nums">
					{value}
				</span>
				<span className="font-mono text-[10px] uppercase text-muted-foreground">
					{unit}
				</span>
			</div>
			{secondaryValue != null && secondaryValue !== "" && (
				<p className="mt-0.5 font-mono text-[10px] text-muted-foreground tabular-nums">
					{secondaryValue}
				</p>
			)}
			{date && (
				<p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
					{date}
				</p>
			)}
			{showSparkline && (
				<div className="mt-1.5">
					<SeriesCardSparkline data={sparklineData} tone={tone} />
				</div>
			)}
			{lastUpdated != null && lastUpdated !== "" && (
				<p className="mt-1 font-mono text-[10px] text-muted-foreground">
					{lastUpdated}
				</p>
			)}
		</div>
	);
}
