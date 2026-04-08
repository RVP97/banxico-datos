"use server";

import {
  getStartDateForPeriod,
  type Period,
  SERIES,
  type SeriesId,
  toDateStr,
} from "@/lib/constants";
import { getMultipleLatest, getSeriesData } from "@/lib/data";
import type {
  TourismBalancePoint,
  TourismData,
  TourismGridRow,
  TourismIncomeBreakdownPoint,
  TourismSpendingPoint,
  TourismVisitorsPoint,
} from "../types/tourism";

const KPI_SERIES: SeriesId[] = [
  SERIES.TURISMO_INGRESOS,
  SERIES.TURISMO_EGRESOS,
  SERIES.TURISMO_SALDO,
  SERIES.TURISMO_VISITANTES_INGRESOS,
  SERIES.TURISMO_GASTO_MEDIO_TURISTA,
];

export async function getTourismData(
  period: Period = "5Y",
): Promise<TourismData> {
  const startDate = getStartDateForPeriod(period) ?? undefined;
  const endDate = new Date();

  const [
    ingresosRaw,
    egresosRaw,
    saldoRaw,
    visitantesRaw,
    turistasRaw,
    excursionistasRaw,
    crucerosVisRaw,
    visitantesEgresosRaw,
    noFrontRaw,
    ingCrucerosRaw,
    frontPerRaw,
    frontSinRaw,
    gastoTuristaRaw,
    gastoNoFrontRaw,
    gastoCruceroRaw,
    latest,
  ] = await Promise.all([
    getSeriesData(SERIES.TURISMO_INGRESOS, startDate, endDate),
    getSeriesData(SERIES.TURISMO_EGRESOS, startDate, endDate),
    getSeriesData(SERIES.TURISMO_SALDO, startDate, endDate),
    getSeriesData(SERIES.TURISMO_VISITANTES_INGRESOS, startDate, endDate),
    getSeriesData(SERIES.TURISMO_TURISTAS_INGRESOS, startDate, endDate),
    getSeriesData(SERIES.TURISMO_EXCURSIONISTAS_INGRESOS, startDate, endDate),
    getSeriesData(SERIES.TURISMO_CRUCEROS_VISITANTES, startDate, endDate),
    getSeriesData(SERIES.TURISMO_VISITANTES_EGRESOS, startDate, endDate),
    getSeriesData(SERIES.TURISMO_INGRESOS_NO_FRONT, startDate, endDate),
    getSeriesData(SERIES.TURISMO_INGRESOS_CRUCEROS, startDate, endDate),
    getSeriesData(SERIES.TURISMO_INGRESOS_FRONT_PERNOCTA, startDate, endDate),
    getSeriesData(
      SERIES.TURISMO_INGRESOS_FRONT_SIN_PERNOCTA,
      startDate,
      endDate,
    ),
    getSeriesData(SERIES.TURISMO_GASTO_MEDIO_TURISTA, startDate, endDate),
    getSeriesData(SERIES.TURISMO_GASTO_MEDIO_NO_FRONT, startDate, endDate),
    getSeriesData(SERIES.TURISMO_GASTO_MEDIO_CRUCERO, startDate, endDate),
    getMultipleLatest(KPI_SERIES),
  ]);

  const balanceMap = new Map<string, TourismBalancePoint>();
  for (const d of ingresosRaw) {
    const k = toDateStr(d.date);
    const e = balanceMap.get(k) ?? { date: k };
    e.ingresos = d.value;
    balanceMap.set(k, e);
  }
  for (const d of egresosRaw) {
    const k = toDateStr(d.date);
    const e = balanceMap.get(k) ?? { date: k };
    e.egresos = d.value;
    balanceMap.set(k, e);
  }
  for (const d of saldoRaw) {
    const k = toDateStr(d.date);
    const e = balanceMap.get(k) ?? { date: k };
    e.saldo = d.value;
    balanceMap.set(k, e);
  }
  const balanceData = Array.from(balanceMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  const visitorMap = new Map<string, TourismVisitorsPoint>();
  for (const d of turistasRaw) {
    const k = toDateStr(d.date);
    const e = visitorMap.get(k) ?? { date: k };
    e.turistas = d.value;
    visitorMap.set(k, e);
  }
  for (const d of excursionistasRaw) {
    const k = toDateStr(d.date);
    const e = visitorMap.get(k) ?? { date: k };
    e.excursionistas = d.value;
    visitorMap.set(k, e);
  }
  for (const d of crucerosVisRaw) {
    const k = toDateStr(d.date);
    const e = visitorMap.get(k) ?? { date: k };
    e.cruceros = d.value;
    visitorMap.set(k, e);
  }
  for (const d of visitantesEgresosRaw) {
    const k = toDateStr(d.date);
    const e = visitorMap.get(k) ?? { date: k };
    e.egresos = d.value;
    visitorMap.set(k, e);
  }
  const visitorsData = Array.from(visitorMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  const incomeMap = new Map<string, TourismIncomeBreakdownPoint>();
  for (const d of noFrontRaw) {
    const k = toDateStr(d.date);
    const e = incomeMap.get(k) ?? { date: k };
    e.noFronterizos = d.value;
    incomeMap.set(k, e);
  }
  for (const d of ingCrucerosRaw) {
    const k = toDateStr(d.date);
    const e = incomeMap.get(k) ?? { date: k };
    e.cruceros = d.value;
    incomeMap.set(k, e);
  }
  for (const d of frontPerRaw) {
    const k = toDateStr(d.date);
    const e = incomeMap.get(k) ?? { date: k };
    e.frontPernocta = d.value;
    incomeMap.set(k, e);
  }
  for (const d of frontSinRaw) {
    const k = toDateStr(d.date);
    const e = incomeMap.get(k) ?? { date: k };
    e.frontSinPernocta = d.value;
    incomeMap.set(k, e);
  }
  const incomeBreakdown = Array.from(incomeMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  const spendMap = new Map<string, TourismSpendingPoint>();
  for (const d of gastoTuristaRaw) {
    const k = toDateStr(d.date);
    const e = spendMap.get(k) ?? { date: k };
    e.turista = d.value;
    spendMap.set(k, e);
  }
  for (const d of gastoNoFrontRaw) {
    const k = toDateStr(d.date);
    const e = spendMap.get(k) ?? { date: k };
    e.noFronterizo = d.value;
    spendMap.set(k, e);
  }
  for (const d of gastoCruceroRaw) {
    const k = toDateStr(d.date);
    const e = spendMap.get(k) ?? { date: k };
    e.crucero = d.value;
    spendMap.set(k, e);
  }
  const spendingData = Array.from(spendMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  const gridMap = new Map<string, TourismGridRow>();
  for (const d of ingresosRaw) {
    const k = toDateStr(d.date);
    const e = gridMap.get(k) ?? { date: k };
    e.ingresos = d.value;
    gridMap.set(k, e);
  }
  for (const d of egresosRaw) {
    const k = toDateStr(d.date);
    const e = gridMap.get(k) ?? { date: k };
    e.egresos = d.value;
    gridMap.set(k, e);
  }
  for (const d of saldoRaw) {
    const k = toDateStr(d.date);
    const e = gridMap.get(k) ?? { date: k };
    e.saldo = d.value;
    gridMap.set(k, e);
  }
  for (const d of visitantesRaw) {
    const k = toDateStr(d.date);
    const e = gridMap.get(k) ?? { date: k };
    e.visitantes = d.value;
    gridMap.set(k, e);
  }
  for (const d of turistasRaw) {
    const k = toDateStr(d.date);
    const e = gridMap.get(k) ?? { date: k };
    e.turistas = d.value;
    gridMap.set(k, e);
  }
  for (const d of gastoTuristaRaw) {
    const k = toDateStr(d.date);
    const e = gridMap.get(k) ?? { date: k };
    e.gastoMedio = d.value;
    gridMap.set(k, e);
  }
  const gridData = Array.from(gridMap.values()).sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return {
    balanceData,
    visitorsData,
    incomeBreakdown,
    spendingData,
    gridData,
    latest,
  };
}
