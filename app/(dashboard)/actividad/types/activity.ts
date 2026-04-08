export interface ActivityPoint {
	date: string;
	total?: number;
	primarias?: number;
	secundarias?: number;
	terciarias?: number;
	prodIndustrial?: number;
	prodManufactura?: number;
	prodMineria?: number;
}

export interface ActivityData {
	chartData: ActivityPoint[];
	gridData: ActivityPoint[];
	latest: {
		seriesId: string;
		shortLabel: string;
		value: number;
		previousValue: number | null;
	}[];
}
