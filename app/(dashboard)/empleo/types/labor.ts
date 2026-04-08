export interface LaborPoint {
	date: string;
	desocupacion?: number;
	subocupacion?: number;
	expDesempleo?: number;
}

export interface LaborData {
	chartData: LaborPoint[];
	latest: {
		seriesId: string;
		shortLabel: string;
		value: number;
		previousValue: number | null;
		date: Date;
	}[];
}
