import { Skeleton } from "@/components/ui/skeleton";
import {
	formatDisplayDate,
	formatNumber,
	SERIES,
	type SeriesId,
} from "@/lib/constants";
import { getMultipleLatest, type LatestValue } from "@/lib/data";
import { TickerMarquee } from "./ticker-marquee";

const TICKER_SERIES: SeriesId[] = [
	SERIES.USD_MXN,
	SERIES.EUR,
	SERIES.TASA_OBJETIVO,
	SERIES.TIIE_FONDEO_COMP_28,
	SERIES.INFLACION_NO_SUBYACENTE_ANUAL,
	SERIES.IGAE,
	SERIES.RESERVAS,
	SERIES.UDI,
	SERIES.CETES_28,
	SERIES.M2,
];

function decimalsForUnit(unit: string): number {
	if (unit === "%") return 2;
	if (unit === "MXN") return 4;
	if (unit === "MDD") return 2;
	if (unit.includes("Miles")) return 2;
	if (unit.includes("Índice")) return 2;
	return 2;
}

function pctChange(value: number, previousValue: number | null): number | null {
	if (previousValue === null) return null;
	if (previousValue === 0) return null;
	return ((value - previousValue) / Math.abs(previousValue)) * 100;
}

export interface TickerItem {
	seriesId: string;
	shortLabel: string;
	label: string;
	formattedValue: string;
	formattedDate: string;
	pctChange: number | null;
	formattedPct: string;
}

function toTickerItem(row: LatestValue): TickerItem {
	const d = decimalsForUnit(row.unit);
	const pct = pctChange(row.value, row.previousValue);
	const formattedPct =
		pct === null ? "—" : `${pct >= 0 ? "+" : ""}${formatNumber(pct, 2)}%`;

	return {
		seriesId: row.seriesId,
		shortLabel: row.shortLabel,
		label: row.label,
		formattedValue: formatNumber(row.value, d),
		formattedDate: formatDisplayDate(row.date),
		pctChange: pct,
		formattedPct,
	};
}

export function MarketTickerSkeleton() {
	return (
		<div className="flex h-8 items-center gap-6 overflow-hidden border-b border-primary/20 bg-card px-4">
			{TICKER_SERIES.map((id) => (
				<div key={id} className="flex shrink-0 items-center gap-2">
					<Skeleton className="h-3 w-14" />
					<Skeleton className="h-3 w-16" />
					<Skeleton className="h-3 w-10" />
				</div>
			))}
		</div>
	);
}

export async function MarketTicker() {
	const rows = await getMultipleLatest(TICKER_SERIES);
	const items = rows.map(toTickerItem);

	return <TickerMarquee items={items} />;
}
