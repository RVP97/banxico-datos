export interface ExchangeRatePoint {
	date: string;
	value: number;
}

export interface FixVsLiqPoint {
	date: string;
	fix?: number;
	liquidacion?: number;
}

export interface CurrencyLatest {
	seriesId: string;
	label: string;
	shortLabel: string;
	value: number;
	previousValue: number | null;
	date: Date;
}

export interface ExchangeRateGridRow {
	date: string;
	usdFix?: number;
	usdLiq?: number;
	eur?: number;
	gbp?: number;
	cad?: number;
	jpy?: number;
	cny?: number;
}

export interface ExchangeRateData {
	usdMxn: ExchangeRatePoint[];
	fixVsLiq: FixVsLiqPoint[];
	currencies: CurrencyLatest[];
	gridData: ExchangeRateGridRow[];
}
