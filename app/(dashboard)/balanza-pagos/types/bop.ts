export interface IEDPoint {
	date: string;
	total?: number;
	nuevas?: number;
	reinversion?: number;
	cuentas?: number;
}

export interface BOPData {
	iedData: IEDPoint[];
	debtData: { date: string; deuda?: number }[];
	tourismData: { date: string; ingresos?: number; saldo?: number }[];
	latest: {
		seriesId: string;
		shortLabel: string;
		value: number;
		previousValue: number | null;
		date: Date;
	}[];
}
