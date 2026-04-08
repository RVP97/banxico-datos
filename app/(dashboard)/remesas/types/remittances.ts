export interface RemittancesPoint {
	date: string;
	value: number;
}

export interface RemittancesData {
	chartData: RemittancesPoint[];
	gridData: RemittancesPoint[];
	latestValue: number | null;
	latestDate: Date | null;
	previousValue: number | null;
}
