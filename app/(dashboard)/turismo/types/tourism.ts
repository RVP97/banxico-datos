import type { LatestValue } from "@/lib/data";

export interface TourismBalancePoint {
  date: string;
  ingresos?: number;
  egresos?: number;
  saldo?: number;
}

export interface TourismVisitorsPoint {
  date: string;
  turistas?: number;
  excursionistas?: number;
  cruceros?: number;
  egresos?: number;
}

export interface TourismIncomeBreakdownPoint {
  date: string;
  noFronterizos?: number;
  cruceros?: number;
  frontPernocta?: number;
  frontSinPernocta?: number;
}

export interface TourismSpendingPoint {
  date: string;
  turista?: number;
  noFronterizo?: number;
  crucero?: number;
}

export interface TourismGridRow {
  date: string;
  ingresos?: number;
  egresos?: number;
  saldo?: number;
  visitantes?: number;
  turistas?: number;
  gastoMedio?: number;
}

export interface TourismData {
  balanceData: TourismBalancePoint[];
  visitorsData: TourismVisitorsPoint[];
  incomeBreakdown: TourismIncomeBreakdownPoint[];
  spendingData: TourismSpendingPoint[];
  gridData: TourismGridRow[];
  latest: LatestValue[];
}
