export const SERIES = {
  // Exchange rates
  USD_MXN: "SF43718",
  USD_MXN_LIQ: "SF60653",
  EUR: "SF46410",
  JPY: "SF46406",
  GBP: "SF46407",
  CAD: "SF60632",
  CNY: "SF46411",
  // Monetary policy
  TASA_OBJETIVO: "SF61745",
  TIIE_28: "SF60648",
  TIIE_91: "SF60649",

  // Money market / overnight funding
  TIIE_FONDEO_COMP_28: "SF331451",
  TIIE_FONDEO_COMP_91: "SF331452",

  // Government bond auction rates
  CETES_28: "SF60633",
  CETES_91: "SF43939",
  CETES_182: "SF43942",
  CETES_364: "SF349785",
  CETES_SUBASTA: "SF43936",

  // Reserves & UDI
  RESERVAS: "SF43707",
  UDI: "SP68257",

  // Inflation
  INPC: "SP1",
  INPC_SUBYACENTE: "SP74625",
  INPC_NO_SUBYACENTE: "SP74626",
  INFLACION_NO_SUBYACENTE_ANUAL: "SP74665",
  INFLACION_SUBYACENTE_ANUAL: "SP74662",

  // Monetary base (daily, MDP)
  BASE_MONETARIA: "SF43695",
  BILLETES_MONEDAS: "SF43702",
  DEPOSITOS_BANCARIOS: "SF43696",

  // Monetary aggregates
  M1: "SF311408",
  M2: "SF311418",
  M4: "SF311451",

  // Government securities outstanding (monthly, miles MXN)
  VALORES_GOB_TOTAL: "SF117758",
  VALORES_CETES: "SF117760",
  VALORES_BONOS: "SF117778",

  // Trade balance (monthly, thousands of USD)
  EXPORTACIONES: "SE36664",
  IMPORTACIONES: "SE36672",
  BALANZA_COMERCIAL: "SE36682",
  EXPORTACIONES_PETROLERAS: "SE36665",
  EXPORTACIONES_NO_PETROLERAS: "SE36666",

  // Remittances (monthly, millions of USD)
  REMESAS: "SE27803",

  // Balance of payments (quarterly, MDD)
  IED_TOTAL: "SE30330",
  IED_NUEVAS: "SE30331",
  IED_REINVERSION: "SE30332",
  IED_CUENTAS: "SE30333",
  DEUDA_EXTERNA: "SE44968",

  // Tourism (monthly, miles USD)
  TURISMO_INGRESOS: "SE5855",
  TURISMO_SALDO: "SE5828",

  // Economic activity
  IGAE: "SR17692",
  IGAE_PRIMARIAS: "SR17693",
  IGAE_SECUNDARIAS: "SR17694",
  IGAE_TERCIARIAS: "SR17695",

  // Industrial production (monthly, index 2018=100)
  PROD_INDUSTRIAL: "SR17700",
  PROD_MINERIA: "SR17701",
  PROD_MANUFACTURA: "SR17702",

  // Labor market (monthly, %)
  DESOCUPACION: "SL11453",
  SUBOCUPACION: "SL11426",

  // Public finances — Gobierno Federal (monthly, MDP, flujos acumulados)
  INGRESOS_PUBLICOS: "SG9",
  GASTO_PUBLICO: "SG46",
  BALANCE_PRESUPUESTARIO: "SG61",
  BALANCE_PRIMARIO: "SG60",

  // Expectations survey (monthly, %)
  EXP_PIB_ACTUAL: "SR14440",
  EXP_PIB_ACTUAL_MED: "SR14441",
  EXP_PIB_SIGUIENTE: "SR14447",
  EXP_PIB_SIGUIENTE_MED: "SR15905",
  EXP_INFLACION: "SR16576",
  EXP_DESEMPLEO: "SR14902",
} as const;

export type SeriesId = (typeof SERIES)[keyof typeof SERIES];

export const SERIES_META: Record<
  SeriesId,
  { label: string; shortLabel: string; unit: string; frequency: string }
> = {
  // Exchange rates
  SF43718: {
    label: "Tipo de Cambio USD/MXN (FIX)",
    shortLabel: "USD/MXN",
    unit: "MXN",
    frequency: "daily",
  },
  SF60653: {
    label: "Tipo de Cambio USD/MXN (Liquidación)",
    shortLabel: "USD/MXN Liq",
    unit: "MXN",
    frequency: "daily",
  },
  SF46410: {
    label: "Tipo de Cambio EUR/MXN",
    shortLabel: "EUR/MXN",
    unit: "MXN",
    frequency: "daily",
  },
  SF46406: {
    label: "Tipo de Cambio JPY/MXN",
    shortLabel: "JPY/MXN",
    unit: "MXN",
    frequency: "daily",
  },
  SF46407: {
    label: "Tipo de Cambio GBP/MXN",
    shortLabel: "GBP/MXN",
    unit: "MXN",
    frequency: "daily",
  },
  SF60632: {
    label: "Tipo de Cambio CAD/MXN",
    shortLabel: "CAD/MXN",
    unit: "MXN",
    frequency: "daily",
  },
  SF46411: {
    label: "Tipo de Cambio CNY/MXN",
    shortLabel: "CNY/MXN",
    unit: "MXN",
    frequency: "daily",
  },
  // Monetary policy
  SF61745: {
    label: "Tasa Objetivo",
    shortLabel: "Tasa Objetivo",
    unit: "%",
    frequency: "daily",
  },
  SF60648: {
    label: "TIIE a 28 días",
    shortLabel: "TIIE 28d",
    unit: "%",
    frequency: "daily",
  },
  SF60649: {
    label: "TIIE a 91 días",
    shortLabel: "TIIE 91d",
    unit: "%",
    frequency: "daily",
  },

  // Money market / overnight funding
  SF331451: {
    label: "TIIE Fondeo Compuesta 28d",
    shortLabel: "Fondeo Comp 28d",
    unit: "%",
    frequency: "daily",
  },
  SF331452: {
    label: "TIIE Fondeo Compuesta 91d",
    shortLabel: "Fondeo Comp 91d",
    unit: "%",
    frequency: "daily",
  },

  // Government bond auction rates
  SF60633: {
    label: "Cetes a 28 días",
    shortLabel: "Cetes 28d",
    unit: "%",
    frequency: "daily",
  },
  SF43939: {
    label: "Cetes a 91 días (subasta)",
    shortLabel: "Cetes 91d",
    unit: "%",
    frequency: "daily",
  },
  SF43942: {
    label: "Cetes a 182 días (subasta)",
    shortLabel: "Cetes 182d",
    unit: "%",
    frequency: "daily",
  },
  SF349785: {
    label: "Cetes a 364 días (subasta)",
    shortLabel: "Cetes 364d",
    unit: "%",
    frequency: "daily",
  },
  SF43936: {
    label: "Tasa Cetes Subasta Semanal",
    shortLabel: "Cetes Subasta",
    unit: "%",
    frequency: "weekly",
  },

  // Reserves & UDI
  SF43707: {
    label: "Reservas Internacionales",
    shortLabel: "Reservas",
    unit: "MDD",
    frequency: "weekly",
  },
  SP68257: {
    label: "Valor de UDIS",
    shortLabel: "UDI",
    unit: "MXN",
    frequency: "daily",
  },

  // Inflation
  SP1: {
    label: "INPC (Índice Nacional de Precios al Consumidor)",
    shortLabel: "INPC",
    unit: "Índice",
    frequency: "monthly",
  },
  SP74625: {
    label: "INPC Subyacente",
    shortLabel: "INPC Core",
    unit: "Índice",
    frequency: "monthly",
  },
  SP74626: {
    label: "INPC No Subyacente",
    shortLabel: "INPC No Core",
    unit: "Índice",
    frequency: "monthly",
  },
  SP74665: {
    label: "Inflación No Subyacente Anual",
    shortLabel: "Inflación No Sub",
    unit: "%",
    frequency: "monthly",
  },
  SP74662: {
    label: "Inflación Subyacente Anual",
    shortLabel: "Inflación Core",
    unit: "%",
    frequency: "monthly",
  },

  // Monetary base (daily)
  SF43695: {
    label: "Base Monetaria",
    shortLabel: "Base Monetaria",
    unit: "MDP",
    frequency: "daily",
  },
  SF43702: {
    label: "Billetes y Monedas en Circulación",
    shortLabel: "Billetes/Monedas",
    unit: "MDP",
    frequency: "daily",
  },
  SF43696: {
    label: "Depósitos Bancarios en Cuenta Corriente",
    shortLabel: "Depósitos CC",
    unit: "MDP",
    frequency: "daily",
  },

  // Monetary aggregates
  SF311408: {
    label: "Agregado Monetario M1",
    shortLabel: "M1",
    unit: "Miles de MXN",
    frequency: "monthly",
  },
  SF311418: {
    label: "Agregado Monetario M2",
    shortLabel: "M2",
    unit: "Miles de MXN",
    frequency: "monthly",
  },
  SF311451: {
    label: "Agregado Monetario M4",
    shortLabel: "M4",
    unit: "Miles de MXN",
    frequency: "monthly",
  },

  // Government securities outstanding
  SF117758: {
    label: "Total Valores Gubernamentales",
    shortLabel: "Valores Gob.",
    unit: "Miles de MXN",
    frequency: "monthly",
  },
  SF117760: {
    label: "Cetes en Circulación",
    shortLabel: "Cetes Circ.",
    unit: "Miles de MXN",
    frequency: "monthly",
  },
  SF117778: {
    label: "Bonos Tasa Fija en Circulación",
    shortLabel: "Bonos Circ.",
    unit: "Miles de MXN",
    frequency: "monthly",
  },

  // Trade balance
  SE36664: {
    label: "Exportaciones Totales",
    shortLabel: "Exportaciones",
    unit: "Miles de USD",
    frequency: "monthly",
  },
  SE36672: {
    label: "Importaciones Totales",
    shortLabel: "Importaciones",
    unit: "Miles de USD",
    frequency: "monthly",
  },
  SE36682: {
    label: "Balanza Comercial Total",
    shortLabel: "Balanza Comercial",
    unit: "Miles de USD",
    frequency: "monthly",
  },
  SE36665: {
    label: "Exportaciones Petroleras",
    shortLabel: "Exp. Petroleras",
    unit: "Miles de USD",
    frequency: "monthly",
  },
  SE36666: {
    label: "Exportaciones No Petroleras",
    shortLabel: "Exp. No Petroleras",
    unit: "Miles de USD",
    frequency: "monthly",
  },

  // Remittances
  SE27803: {
    label: "Remesas Familiares Totales",
    shortLabel: "Remesas",
    unit: "MDD",
    frequency: "monthly",
  },

  // Balance of payments
  SE30330: {
    label: "IED Flujos a México Total",
    shortLabel: "IED Total",
    unit: "MDD",
    frequency: "quarterly",
  },
  SE30331: {
    label: "IED Nuevas Inversiones",
    shortLabel: "IED Nuevas",
    unit: "MDD",
    frequency: "quarterly",
  },
  SE30332: {
    label: "IED Reinversión de Utilidades",
    shortLabel: "IED Reinversión",
    unit: "MDD",
    frequency: "quarterly",
  },
  SE30333: {
    label: "IED Cuentas entre Compañías",
    shortLabel: "IED Cuentas",
    unit: "MDD",
    frequency: "quarterly",
  },
  SE44968: {
    label: "Posición de Deuda Externa Bruta Total",
    shortLabel: "Deuda Externa",
    unit: "MDD",
    frequency: "quarterly",
  },

  // Tourism
  SE5855: {
    label: "Ingresos Turismo Internacional",
    shortLabel: "Turismo Ingresos",
    unit: "Miles de USD",
    frequency: "monthly",
  },
  SE5828: {
    label: "Saldo Viajeros Internacionales",
    shortLabel: "Saldo Turismo",
    unit: "Miles de USD",
    frequency: "monthly",
  },

  // Economic activity
  SR17692: {
    label: "IGAE Total",
    shortLabel: "IGAE",
    unit: "Índice (2018=100)",
    frequency: "monthly",
  },
  SR17693: {
    label: "IGAE Actividades Primarias",
    shortLabel: "IGAE Primarias",
    unit: "Índice (2018=100)",
    frequency: "monthly",
  },
  SR17694: {
    label: "IGAE Actividades Secundarias",
    shortLabel: "IGAE Secundarias",
    unit: "Índice (2018=100)",
    frequency: "monthly",
  },
  SR17695: {
    label: "IGAE Actividades Terciarias",
    shortLabel: "IGAE Terciarias",
    unit: "Índice (2018=100)",
    frequency: "monthly",
  },

  // Industrial production
  SR17700: {
    label: "Producción Industrial Total",
    shortLabel: "Prod. Industrial",
    unit: "Índice (2018=100)",
    frequency: "monthly",
  },
  SR17701: {
    label: "Producción Industrial Minería",
    shortLabel: "Prod. Minería",
    unit: "Índice (2018=100)",
    frequency: "monthly",
  },
  SR17702: {
    label: "Producción Industrial Manufactura",
    shortLabel: "Prod. Manufactura",
    unit: "Índice (2018=100)",
    frequency: "monthly",
  },

  // Labor market
  SL11453: {
    label: "Tasa de Desocupación Nacional",
    shortLabel: "Desocupación",
    unit: "%",
    frequency: "monthly",
  },
  SL11426: {
    label: "Tasa de Subocupación",
    shortLabel: "Subocupación",
    unit: "%",
    frequency: "monthly",
  },

  // Public finances (Gobierno Federal, MDP, flujos acumulados)
  SG9: {
    label: "Ingresos Presupuestarios (Gobierno Federal)",
    shortLabel: "Ingresos Gob.",
    unit: "MDP",
    frequency: "monthly",
  },
  SG46: {
    label: "Gasto Total (Gobierno Federal)",
    shortLabel: "Gasto Gob.",
    unit: "MDP",
    frequency: "monthly",
  },
  SG61: {
    label: "Balance Presupuestario (Gobierno Federal)",
    shortLabel: "Balance Pres.",
    unit: "MDP",
    frequency: "monthly",
  },
  SG60: {
    label: "Balance Primario (Gobierno Federal)",
    shortLabel: "Balance Prim.",
    unit: "MDP",
    frequency: "monthly",
  },

  // Expectations survey
  SR14440: {
    label: "PIB Real Esperado (año en curso, media)",
    shortLabel: "Exp. PIB Actual",
    unit: "%",
    frequency: "monthly",
  },
  SR14441: {
    label: "PIB Real Esperado (año en curso, mediana)",
    shortLabel: "Exp. PIB Med.",
    unit: "%",
    frequency: "monthly",
  },
  SR14447: {
    label: "PIB Real Esperado (siguiente año, media)",
    shortLabel: "Exp. PIB Sig.",
    unit: "%",
    frequency: "monthly",
  },
  SR15905: {
    label: "PIB Real Esperado (siguiente año, mediana)",
    shortLabel: "Exp. PIB Sig. Med.",
    unit: "%",
    frequency: "monthly",
  },
  SR16576: {
    label: "Inflación General Esperada (cierre año en curso)",
    shortLabel: "Exp. Inflación",
    unit: "%",
    frequency: "monthly",
  },
  SR14902: {
    label: "Tasa Desocupación Esperada (año en curso, media)",
    shortLabel: "Exp. Desempleo",
    unit: "%",
    frequency: "monthly",
  },
};

export const ALL_SERIES_IDS = Object.values(SERIES);

export function formatDateForAPI(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

export function parseBanxicoDate(dateStr: string): Date {
  const [dd, mm, yyyy] = dateStr.split("/");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

export function subMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
}

export function subYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() - years);
  return d;
}

export type Period = "1M" | "3M" | "6M" | "1Y" | "2Y" | "5Y" | "10Y" | "MAX";

export function getStartDateForPeriod(period: Period): Date | null {
  const now = new Date();
  switch (period) {
    case "1M":
      return subMonths(now, 1);
    case "3M":
      return subMonths(now, 3);
    case "6M":
      return subMonths(now, 6);
    case "1Y":
      return subYears(now, 1);
    case "2Y":
      return subYears(now, 2);
    case "5Y":
      return subYears(now, 5);
    case "10Y":
      return subYears(now, 10);
    case "MAX":
      return null;
  }
}

export function formatDisplayDate(
  date: Date | string | null | undefined,
): string {
  if (date == null) return "—";
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else {
    const str = /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T12:00:00` : date;
    d = new Date(str);
  }
  if (Number.isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function toDateStr(date: Date | string): string {
  if (date instanceof Date) return date.toISOString().split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const parsed = new Date(date);
  if (!Number.isNaN(parsed.getTime()))
    return parsed.toISOString().split("T")[0];
  return date;
}

export function formatChartTick(v: string): string {
  const str = /^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v}T12:00:00` : v;
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-MX", { month: "short", year: "2-digit" });
}

export function formatNumber(value: number, decimals = 4): string {
  return value.toLocaleString("es-MX", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
