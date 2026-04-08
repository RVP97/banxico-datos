export interface UDIPoint {
  date: string;
  value: number;
}

export interface UDIData {
  chartData: UDIPoint[];
  latestValue: number | null;
  latestDate: Date | null;
  previousValue: number | null;
}
