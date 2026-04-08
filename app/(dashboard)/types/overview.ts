import type { SeriesId } from "@/lib/constants";

export interface KPIData {
	seriesId: string;
	label: string;
	shortLabel: string;
	unit: string;
	value: number;
	previousValue: number | null;
	date: Date;
}

export interface KPIGroupData {
	title: string;
	kpis: KPIData[];
}

export interface SparklinePoint {
	date: string;
	value: number;
}

export interface OverviewData {
	kpiGroups: KPIGroupData[];
	sparklines: Partial<Record<SeriesId, SparklinePoint[]>>;
	sparklineOrder: SeriesId[];
}
