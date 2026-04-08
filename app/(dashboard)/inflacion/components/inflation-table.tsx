"use client";

import { Download } from "lucide-react";
import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDisplayDate } from "@/lib/constants";
import type { InflationTableRow } from "../types/inflation";

interface InflationTableProps {
	data: InflationTableRow[];
}

export function InflationTable({ data }: InflationTableProps) {
	const rows = data.slice(0, 24);

	const handleDownload = useCallback(() => {
		const header = "Fecha,INPC,Subyacente,Inflación Interanual %";
		const csvRows = rows.map(
			(row) =>
				`${formatDisplayDate(row.date)},${row.inpc?.toFixed(3) ?? ""},${row.core?.toFixed(3) ?? ""},${row.yoyChange?.toFixed(2) ?? ""}`,
		);
		const bom = "\uFEFF";
		const csv = bom + [header, ...csvRows].join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "inflacion-mensual.csv";
		a.click();
		URL.revokeObjectURL(url);
	}, [rows]);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Datos Mensuales</CardTitle>
				<button
					type="button"
					onClick={handleDownload}
					className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
					title="Descargar CSV"
				>
					<Download className="size-3" aria-hidden />
					<span className="hidden sm:inline">CSV</span>
				</button>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[400px]">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Fecha</TableHead>
								<TableHead className="text-right">INPC</TableHead>
								<TableHead className="text-right">Subyacente</TableHead>
								<TableHead className="text-right">
									Inflación Interanual
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row.date}>
									<TableCell>{formatDisplayDate(row.date)}</TableCell>
									<TableCell className="text-right font-mono">
										{row.inpc?.toFixed(3) ?? "—"}
									</TableCell>
									<TableCell className="text-right font-mono">
										{row.core?.toFixed(3) ?? "—"}
									</TableCell>
									<TableCell className="text-right font-mono">
										{row.yoyChange != null ? (
											<span
												className={
													row.yoyChange > 4
														? "text-red-500"
														: row.yoyChange > 3
															? "text-yellow-500"
															: "text-emerald-500"
												}
											>
												{row.yoyChange.toFixed(2)}%
											</span>
										) : (
											"—"
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
