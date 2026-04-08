import type { LatestValue } from "@/lib/data";

export interface SpeiDailyPoint {
  date: string;
  enviadasNum?: number;
  enviadasMonto?: number;
  recibidasNum?: number;
  recibidasMonto?: number;
}

export interface SpeiP2PPoint {
  date: string;
  totalNum?: number;
  menor8kNum?: number;
  entre8k300kNum?: number;
  mayor300kNum?: number;
  totalMonto?: number;
}

export interface SpeiMonthlyPoint {
  date: string;
  numero?: number;
  monto?: number;
}

export interface CardsPoint {
  date: string;
  creditoMC?: number;
  creditoVisa?: number;
  creditoOtras?: number;
  debitoMC?: number;
  debitoVisa?: number;
  debitoOtras?: number;
}

export interface CardOpsPoint {
  date: string;
  montoTotal?: number;
  montoDebito?: number;
  numTotal?: number;
  numDebito?: number;
}

export interface ChequesPoint {
  date: string;
  mismoNum?: number;
  interNum?: number;
  mismoMonto?: number;
  interMonto?: number;
  mismoUsdNum?: number;
  interUsdNum?: number;
}

export interface TransfersPoint {
  date: string;
  tefNum?: number;
  tefMonto?: number;
  internetMismoNum?: number;
  internetInterNum?: number;
}

export interface OtherPaymentsPoint {
  date: string;
  swiftNum?: number;
  domicNum?: number;
  directoMxNum?: number;
  codiPago?: number;
  codiCobro?: number;
}

export interface PaymentsGridRow {
  date: string;
  speiEnvNum?: number;
  speiEnvMonto?: number;
  speiP2PNum?: number;
  tefNum?: number;
  tarjetasCredito?: number;
  tarjetasDebito?: number;
  chequesNum?: number;
  atmNum?: number;
}

export interface PaymentsData {
  speiDaily: SpeiDailyPoint[];
  speiP2P: SpeiP2PPoint[];
  speiMonthly: SpeiMonthlyPoint[];
  cards: CardsPoint[];
  cardOps: CardOpsPoint[];
  cheques: ChequesPoint[];
  transfers: TransfersPoint[];
  other: OtherPaymentsPoint[];
  gridData: PaymentsGridRow[];
  latest: LatestValue[];
}
