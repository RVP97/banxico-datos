export interface RatePoint {
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

export interface YieldCurvePoint {
	maturity: string;
	days: number;
	rate: number;
}

export interface InterestRateData {
	chartData: RatePoint[];
	gridData: RatePoint[];
	yieldCurve: YieldCurvePoint[];
	latest: {
		seriesId: string;
		shortLabel: string;
		value: number;
		previousValue: number | null;
		date: Date;
	}[];
}
