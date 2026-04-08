export interface MoneyMarketPoint {
	date: string;
	tasaObjetivo?: number;
	tiieFondeo?: number;
	tiie28?: number;
	tiie91?: number;
	cetes28?: number;
	cetes91?: number;
	cetes182?: number;
	cetes364?: number;
}

export interface MoneyMarketData {
	chartData: MoneyMarketPoint[];
	spreadData: { date: string; spread: number }[];
	yieldCurve: { maturity: string; days: number; rate: number }[];
	latest: {
		seriesId: string;
		shortLabel: string;
		value: number;
		previousValue: number | null;
		date: Date;
	}[];
}
