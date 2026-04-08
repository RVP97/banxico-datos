"use client";

import { useMemo } from "react";
import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { PaymentsGridRow } from "../types/payments";

function num0(value: unknown): string {
  if (typeof value !== "number") return "—";
  return formatNumber(value, 0);
}

const columns: DataGridColumn[] = [
  {
    key: "date",
    label: "Fecha",
    format: (v) => (typeof v === "string" ? formatDisplayDate(v) : "—"),
  },
  { key: "speiEnvNum", label: "SPEI Enviadas", align: "right", format: num0 },
  {
    key: "speiEnvMonto",
    label: "SPEI Monto (MDP)",
    align: "right",
    format: num0,
  },
  { key: "speiP2PNum", label: "SPEI P2P", align: "right", format: num0 },
  { key: "tefNum", label: "TEF", align: "right", format: num0 },
  {
    key: "tarjetasCredito",
    label: "Tarj. Crédito",
    align: "right",
    format: num0,
  },
  {
    key: "tarjetasDebito",
    label: "Tarj. Débito",
    align: "right",
    format: num0,
  },
  { key: "chequesNum", label: "Cheques", align: "right", format: num0 },
  { key: "atmNum", label: "ATM Ops.", align: "right", format: num0 },
];

interface Props {
  data: PaymentsGridRow[];
}

export function PaymentsDataGrid({ data }: Props) {
  const rows = useMemo(
    () => data.map((row) => ({ ...row }) as Record<string, unknown>),
    [data],
  );

  return (
    <DataGrid
      columns={columns}
      data={rows}
      csvFilename="sistemas-pago"
      caption="Sistemas de pago — SPEI (operaciones y MDP), tarjetas en circulación, cheques y cajeros automáticos"
    />
  );
}
