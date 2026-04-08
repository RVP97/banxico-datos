export interface MonetaryPoint {
	date: string;
	m1?: number;
	m2?: number;
	m4?: number;
}

export interface MonetaryData {
	chartData: MonetaryPoint[];
	gridData: MonetaryPoint[];
	latest: {
		seriesId: string;
		shortLabel: string;
		value: number;
		previousValue: number | null;
	}[];
}
