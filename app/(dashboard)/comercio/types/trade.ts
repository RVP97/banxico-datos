export interface TradePoint {
	date: string;
	exportaciones?: number;
	importaciones?: number;
	balanza?: number;
	expPetroleras?: number;
	expNoPetroleras?: number;
}

export interface TradeData {
	chartData: TradePoint[];
	gridData: TradePoint[];
	latest: {
		seriesId: string;
		shortLabel: string;
		value: number;
		previousValue: number | null;
	}[];
}
