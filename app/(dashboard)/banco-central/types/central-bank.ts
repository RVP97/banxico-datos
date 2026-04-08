export interface MonetaryBasePoint {
	date: string;
	baseMonetaria?: number;
	billetesMonedas?: number;
	depositosBancarios?: number;
}

export interface AggregatePoint {
	date: string;
	m1?: number;
	m2?: number;
	m4?: number;
}

export interface CentralBankData {
	baseData: MonetaryBasePoint[];
	aggregateData: AggregatePoint[];
	securitiesData: {
		date: string;
		total?: number;
		cetes?: number;
		bonos?: number;
	}[];
	latest: {
		seriesId: string;
		shortLabel: string;
		value: number;
		previousValue: number | null;
		date: Date;
	}[];
}
