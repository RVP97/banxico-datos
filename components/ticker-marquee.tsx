"use client";

import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TickerItem } from "./market-ticker";

function TickerItemDisplay({ item }: { item: TickerItem }) {
  const pct = item.pctChange;

  let Icon = Minus;
  if (pct !== null) {
    if (pct > 0) Icon = ArrowUp;
    else if (pct < 0) Icon = ArrowDown;
  }

  const tone =
    pct === null || pct === 0
      ? "text-muted-foreground"
      : pct > 0
        ? "text-emerald-500 dark:text-emerald-400"
        : "text-red-500 dark:text-red-400";

  return (
    <div
      className="flex shrink-0 items-center gap-1.5 text-[11px]"
      title={`${item.label} · ${item.formattedDate}`}
    >
      <span className="text-primary/30" aria-hidden>
        ·
      </span>
      <span className="whitespace-nowrap uppercase tracking-wide text-primary">
        {item.shortLabel}
      </span>
      <span className="font-bold tabular-nums text-foreground">
        {item.formattedValue}
      </span>
      <span
        className={cn(
          "inline-flex items-center gap-0.5 font-mono text-[11px] tabular-nums",
          tone,
        )}
      >
        <Icon className="size-2.5 shrink-0" aria-hidden />
        <span>{item.formattedPct}</span>
      </span>
    </div>
  );
}

interface TickerMarqueeProps {
  items: TickerItem[];
}

export function TickerMarquee({ items }: TickerMarqueeProps) {
  return (
    <section
      className="group/ticker relative h-8 overflow-hidden border-b border-primary/20 bg-card font-mono"
      aria-label="Indicadores recientes"
    >
      <div className="absolute inset-y-0 flex animate-[ticker-scroll_30s_linear_infinite] items-center gap-5 hover:[animation-play-state:paused]">
        {items.map((item) => (
          <TickerItemDisplay key={item.seriesId} item={item} />
        ))}
        {items.map((item) => (
          <TickerItemDisplay key={`dup-${item.seriesId}`} item={item} />
        ))}
      </div>
    </section>
  );
}
