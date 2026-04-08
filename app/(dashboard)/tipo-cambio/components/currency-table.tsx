"use client";

import { ArrowDown, ArrowUp, Download, Minus } from "lucide-react";
import { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { CurrencyLatest } from "../types/exchange-rates";

interface CurrencyTableProps {
	currencies: CurrencyLatest[];
}

export function CurrencyTable({ currencies }: CurrencyTableProps) {
	const handleDownload = useCallback(() => {
		const header = "Divisa,Valor,Cambio %,Fecha";
		const rows = currencies.map((c) => {
			const change =
				c.previousValue != null && c.previousValue !== 0
					? (((c.value - c.previousValue) / c.previousValue) * 100).toFixed(2)
					: "";
			return `${c.shortLabel},${formatNumber(c.value)},${change},${formatDisplayDate(c.date)}`;
		});
		const bom = "\uFEFF";
		const csv = bom + [header, ...rows].join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "divisas-mxn.csv";
		a.click();
		URL.revokeObjectURL(url);
	}, [currencies]);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Divisas vs MXN</CardTitle>
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
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Divisa</TableHead>
							<TableHead className="text-right">Valor</TableHead>
							<TableHead className="text-right">Cambio</TableHead>
							<TableHead className="text-right">Fecha</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{currencies.map((c) => {
							const change =
								c.previousValue != null && c.previousValue !== 0
									? ((c.value - c.previousValue) / c.previousValue) * 100
									: null;

							return (
								<TableRow key={c.seriesId}>
									<TableCell className="font-medium">{c.shortLabel}</TableCell>
									<TableCell className="text-right font-mono">
										{formatNumber(c.value)}
									</TableCell>
									<TableCell className="text-right">
										{change != null ? (
											<Badge
												variant={
													change > 0
														? "default"
														: change < 0
															? "destructive"
															: "secondary"
												}
												className="gap-1 font-mono"
											>
												{change > 0 ? (
													<ArrowUp className="h-3 w-3" />
												) : change < 0 ? (
													<ArrowDown className="h-3 w-3" />
												) : (
													<Minus className="h-3 w-3" />
												)}
												{Math.abs(change).toFixed(2)}%
											</Badge>
										) : (
											<span className="text-muted-foreground">—</span>
										)}
									</TableCell>
									<TableCell className="text-right text-muted-foreground">
										{formatDisplayDate(c.date)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
