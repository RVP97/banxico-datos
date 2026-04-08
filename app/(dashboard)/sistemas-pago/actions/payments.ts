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
  CardOpsPoint,
  CardsPoint,
  ChequesPoint,
  OtherPaymentsPoint,
  PaymentsData,
  PaymentsGridRow,
  SpeiDailyPoint,
  SpeiMonthlyPoint,
  SpeiP2PPoint,
  TransfersPoint,
} from "../types/payments";

const KPI_SERIES: SeriesId[] = [
  SERIES.SPEI_ENVIADAS_NUM,
  SERIES.SPEI_P2P_TOTAL_NUM,
  SERIES.TARJETAS_OPS_NUM_TOTAL,
  SERIES.SPEI_MENSUAL_NUM,
  SERIES.TEF_DIARIO_NUM,
];

function merge<T extends { date: string }>(
  map: Map<string, T>,
  data: { date: Date | string; value: number }[],
  field: keyof T,
) {
  for (const d of data) {
    const k = toDateStr(d.date);
    const entry = map.get(k) ?? ({ date: k } as T);
    (entry as Record<string, unknown>)[field as string] = d.value;
    map.set(k, entry);
  }
}

function sorted<T extends { date: string }>(map: Map<string, T>): T[] {
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getPaymentsData(
  period: Period = "5Y",
): Promise<PaymentsData> {
  const startDate = getStartDateForPeriod(period) ?? undefined;
  const endDate = new Date();

  const fetch = (id: string) => getSeriesData(id, startDate, endDate);

  const [
    speiEnvNum,
    speiEnvMonto,
    speiRecNum,
    speiRecMonto,
    p2pTotalNum,
    p2pMenor8k,
    p2pEntre8k300k,
    p2pMayor300k,
    p2pTotalMonto,
    speiMesNum,
    speiMesMonto,
    tefNum,
    tefMonto,
    creditoMC,
    creditoVisa,
    creditoOtras,
    debitoMC,
    debitoVisa,
    debitoOtras,
    cardOpsMontoTotal,
    cardOpsMontoDebito,
    cardOpsNumTotal,
    cardOpsNumDebito,
    atmTotal,
    chqMismoNum,
    chqInterNum,
    chqMismoMonto,
    chqInterMonto,
    chqMismoUsdNum,
    chqInterUsdNum,
    inetMismoNum,
    inetInterNum,
    swiftNum,
    domicNum,
    directoMxNum,
    codiPago,
    codiCobro,
    latest,
  ] = await Promise.all([
    fetch(SERIES.SPEI_ENVIADAS_NUM),
    fetch(SERIES.SPEI_ENVIADAS_MONTO),
    fetch(SERIES.SPEI_RECIBIDAS_NUM),
    fetch(SERIES.SPEI_RECIBIDAS_MONTO),
    fetch(SERIES.SPEI_P2P_TOTAL_NUM),
    fetch(SERIES.SPEI_P2P_MENOR_8K_NUM),
    fetch(SERIES.SPEI_P2P_8K_300K_NUM),
    fetch(SERIES.SPEI_P2P_MAYOR_300K_NUM),
    fetch(SERIES.SPEI_P2P_TOTAL_MONTO),
    fetch(SERIES.SPEI_MENSUAL_NUM),
    fetch(SERIES.SPEI_MENSUAL_MONTO),
    fetch(SERIES.TEF_DIARIO_NUM),
    fetch(SERIES.TEF_DIARIO_MONTO),
    fetch(SERIES.TARJETAS_CREDITO_MC),
    fetch(SERIES.TARJETAS_CREDITO_VISA),
    fetch(SERIES.TARJETAS_CREDITO_OTRAS),
    fetch(SERIES.TARJETAS_DEBITO_MC),
    fetch(SERIES.TARJETAS_DEBITO_VISA),
    fetch(SERIES.TARJETAS_DEBITO_OTRAS),
    fetch(SERIES.TARJETAS_OPS_MONTO_TOTAL),
    fetch(SERIES.TARJETAS_OPS_MONTO_DEBITO),
    fetch(SERIES.TARJETAS_OPS_NUM_TOTAL),
    fetch(SERIES.TARJETAS_OPS_NUM_DEBITO),
    fetch(SERIES.ATM_OPS_TOTAL_NUM),
    fetch(SERIES.CHEQUES_MISMO_MN_NUM),
    fetch(SERIES.CHEQUES_INTER_MN_NUM),
    fetch(SERIES.CHEQUES_MISMO_MN_MONTO),
    fetch(SERIES.CHEQUES_INTER_MN_MONTO),
    fetch(SERIES.CHEQUES_MISMO_USD_NUM),
    fetch(SERIES.CHEQUES_INTER_USD_NUM),
    fetch(SERIES.TRANSFERENCIAS_INTERNET_MISMO_NUM),
    fetch(SERIES.TRANSFERENCIAS_INTERNET_INTER_NUM),
    fetch(SERIES.SWIFT_ENVIADAS_NUM),
    fetch(SERIES.DOMICILIACIONES_MISMO_NUM),
    fetch(SERIES.DIRECTO_MX_NUM),
    fetch(SERIES.CODI_CUENTAS_PAGO),
    fetch(SERIES.CODI_CUENTAS_COBRO),
    getMultipleLatest(KPI_SERIES),
  ]);

  // SPEI daily
  const speiMap = new Map<string, SpeiDailyPoint>();
  merge(speiMap, speiEnvNum, "enviadasNum");
  merge(speiMap, speiEnvMonto, "enviadasMonto");
  merge(speiMap, speiRecNum, "recibidasNum");
  merge(speiMap, speiRecMonto, "recibidasMonto");

  // SPEI P2P
  const p2pMap = new Map<string, SpeiP2PPoint>();
  merge(p2pMap, p2pTotalNum, "totalNum");
  merge(p2pMap, p2pMenor8k, "menor8kNum");
  merge(p2pMap, p2pEntre8k300k, "entre8k300kNum");
  merge(p2pMap, p2pMayor300k, "mayor300kNum");
  merge(p2pMap, p2pTotalMonto, "totalMonto");

  // SPEI monthly
  const speiMonthMap = new Map<string, SpeiMonthlyPoint>();
  merge(speiMonthMap, speiMesNum, "numero");
  merge(speiMonthMap, speiMesMonto, "monto");

  // Cards
  const cardsMap = new Map<string, CardsPoint>();
  merge(cardsMap, creditoMC, "creditoMC");
  merge(cardsMap, creditoVisa, "creditoVisa");
  merge(cardsMap, creditoOtras, "creditoOtras");
  merge(cardsMap, debitoMC, "debitoMC");
  merge(cardsMap, debitoVisa, "debitoVisa");
  merge(cardsMap, debitoOtras, "debitoOtras");

  // Card operations
  const cardOpsMap = new Map<string, CardOpsPoint>();
  merge(cardOpsMap, cardOpsMontoTotal, "montoTotal");
  merge(cardOpsMap, cardOpsMontoDebito, "montoDebito");
  merge(cardOpsMap, cardOpsNumTotal, "numTotal");
  merge(cardOpsMap, cardOpsNumDebito, "numDebito");

  // Cheques
  const chqMap = new Map<string, ChequesPoint>();
  merge(chqMap, chqMismoNum, "mismoNum");
  merge(chqMap, chqInterNum, "interNum");
  merge(chqMap, chqMismoMonto, "mismoMonto");
  merge(chqMap, chqInterMonto, "interMonto");
  merge(chqMap, chqMismoUsdNum, "mismoUsdNum");
  merge(chqMap, chqInterUsdNum, "interUsdNum");

  // Transfers (TEF + Internet)
  const transMap = new Map<string, TransfersPoint>();
  merge(transMap, tefNum, "tefNum");
  merge(transMap, tefMonto, "tefMonto");
  merge(transMap, inetMismoNum, "internetMismoNum");
  merge(transMap, inetInterNum, "internetInterNum");

  // Other
  const otherMap = new Map<string, OtherPaymentsPoint>();
  merge(otherMap, swiftNum, "swiftNum");
  merge(otherMap, domicNum, "domicNum");
  merge(otherMap, directoMxNum, "directoMxNum");
  merge(otherMap, codiPago, "codiPago");
  merge(otherMap, codiCobro, "codiCobro");

  // Grid: aggregate view
  const gridMap = new Map<string, PaymentsGridRow>();
  merge(gridMap, speiEnvNum, "speiEnvNum");
  merge(gridMap, speiEnvMonto, "speiEnvMonto");
  merge(gridMap, p2pTotalNum, "speiP2PNum");
  merge(gridMap, tefNum, "tefNum");
  for (const d of creditoMC) {
    const k = toDateStr(d.date);
    const e = gridMap.get(k) ?? ({ date: k } as PaymentsGridRow);
    const visa = creditoVisa.find((v) => toDateStr(v.date) === k)?.value ?? 0;
    const otras = creditoOtras.find((v) => toDateStr(v.date) === k)?.value ?? 0;
    e.tarjetasCredito = d.value + visa + otras;
    gridMap.set(k, e);
  }
  for (const d of debitoMC) {
    const k = toDateStr(d.date);
    const e = gridMap.get(k) ?? ({ date: k } as PaymentsGridRow);
    const visa = debitoVisa.find((v) => toDateStr(v.date) === k)?.value ?? 0;
    const otras = debitoOtras.find((v) => toDateStr(v.date) === k)?.value ?? 0;
    e.tarjetasDebito = d.value + visa + otras;
    gridMap.set(k, e);
  }
  merge(gridMap, chqMismoNum, "chequesNum");
  merge(gridMap, atmTotal, "atmNum");

  const gridData = Array.from(gridMap.values()).sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return {
    speiDaily: sorted(speiMap),
    speiP2P: sorted(p2pMap),
    speiMonthly: sorted(speiMonthMap),
    cards: sorted(cardsMap),
    cardOps: sorted(cardOpsMap),
    cheques: sorted(chqMap),
    transfers: sorted(transMap),
    other: sorted(otherMap),
    gridData,
    latest,
  };
}
