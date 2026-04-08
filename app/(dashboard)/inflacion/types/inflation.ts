export interface InflationPoint {
	date: string;
	inpc?: number;
	core?: number;
	inpcNoSub?: number;
	inflacionGeneral?: number;
	inflacionSub?: number;
}

export interface InflationTableRow {
	date: string;
	inpc: number | null;
	core: number | null;
	yoyChange: number | null;
}

export interface InflationKPI {
	label: string;
	value: number;
	unit: string;
	previousValue: number | null;
}

export interface InflationData {
	chartData: InflationPoint[];
	gridData: InflationPoint[];
	tableData: InflationTableRow[];
	kpis: InflationKPI[];
}
