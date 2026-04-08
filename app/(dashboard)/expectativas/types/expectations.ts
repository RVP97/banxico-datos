export interface ExpectationPoint {
	date: string;
	inflacion?: number;
	pibActual?: number;
	pibSiguiente?: number;
	desempleo?: number;
}

export interface ExpectationsData {
	chartData: ExpectationPoint[];
	latest: {
		seriesId: string;
		shortLabel: string;
		value: number;
		previousValue: number | null;
		date: Date;
	}[];
}
