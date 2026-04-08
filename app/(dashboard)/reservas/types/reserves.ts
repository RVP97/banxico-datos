export interface ReservesPoint {
	date: string;
	value: number;
}

export interface ReservesData {
	chartData: ReservesPoint[];
	gridData: ReservesPoint[];
	latestValue: number | null;
	latestDate: Date | null;
	previousValue: number | null;
}
