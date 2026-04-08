export interface FiscalPoint {
	date: string;
	ingresos?: number;
	gasto?: number;
	balancePresupuestario?: number;
	balancePrimario?: number;
}

export interface FiscalData {
	chartData: FiscalPoint[];
	latest: {
		seriesId: string;
		shortLabel: string;
		value: number;
		previousValue: number | null;
		date: Date;
	}[];
}
