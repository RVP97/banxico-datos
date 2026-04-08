"use client";

import { useMemo } from "react";
import { DataGrid, type DataGridColumn } from "@/components/data-grid";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { TourismGridRow } from "../types/tourism";

function num0(value: unknown): string {
  if (typeof value !== "number") return "—";
  return formatNumber(value, 0);
}

function num2(value: unknown): string {
  if (typeof value !== "number") return "—";
  return formatNumber(value, 2);
}

const columns: DataGridColumn[] = [
  {
    key: "date",
    label: "Fecha",
    format: (v) => (typeof v === "string" ? formatDisplayDate(v) : "—"),
  },
  { key: "ingresos", label: "Ingresos", align: "right", format: num0 },
  { key: "egresos", label: "Egresos", align: "right", format: num0 },
  {
    key: "saldo",
    label: "Saldo",
    align: "right",
    format: num0,
    isChange: true,
  },
  { key: "visitantes", label: "Visitantes", align: "right", format: num2 },
  { key: "turistas", label: "Turistas", align: "right", format: num2 },
  {
    key: "gastoMedio",
    label: "Gasto Medio (USD)",
    align: "right",
    format: num2,
  },
];

interface Props {
  data: TourismGridRow[];
}

export function TourismDataGrid({ data }: Props) {
  const rows = useMemo(
    () => data.map((row) => ({ ...row }) as Record<string, unknown>),
    [data],
  );

  return (
    <DataGrid
      columns={columns}
      data={rows}
      csvFilename="turismo"
      caption="Turismo internacional — ingresos y egresos en miles de USD, visitantes en miles"
    />
  );
}
