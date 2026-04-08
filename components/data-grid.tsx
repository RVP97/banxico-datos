"use client";

import { ArrowUpDown, Download } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataGridColumn {
	key: string;
	label: string;
	align?: "left" | "right";
	format?: (value: unknown) => string;
	isChange?: boolean;
}

export interface DataGridProps {
	columns: DataGridColumn[];
	data: Record<string, unknown>[];
	caption?: string;
	csvFilename?: string;
}

type SortDirection = "asc" | "desc";

function compareForSort(a: unknown, b: unknown): number {
	if (a === b) return 0;
	if (a == null && b == null) return 0;
	if (a == null) return 1;
	if (b == null) return -1;

	if (typeof a === "number" && typeof b === "number") {
		return a - b;
	}

	const na = typeof a === "number" ? a : Number(a);
	const nb = typeof b === "number" ? b : Number(b);
	if (!Number.isNaN(na) && !Number.isNaN(nb)) {
		return na - nb;
	}

	return String(a).localeCompare(String(b), undefined, { numeric: true });
}

function getChangeTone(value: unknown): "positive" | "negative" | "neutral" {
	if (typeof value === "number") {
		if (value > 0) return "positive";
		if (value < 0) return "negative";
		return "neutral";
	}
	if (typeof value === "string") {
		const t = value.trim();
		if (t.startsWith("(") && t.endsWith(")")) return "negative";
		if (t.startsWith("-")) return "negative";
		if (t.startsWith("+")) return "positive";
		const n = Number.parseFloat(t.replace(/[%$,]/g, ""));
		if (!Number.isNaN(n)) {
			if (n > 0) return "positive";
			if (n < 0) return "negative";
		}
	}
	return "neutral";
}

function formatCellValue(column: DataGridColumn, value: unknown): string {
	if (column.format) return column.format(value);
	if (value == null) return "—";
	return String(value);
}

function stableRowKey(
	row: Record<string, unknown>,
	columns: DataGridColumn[],
): string {
	return columns
		.map((c) => {
			const v = row[c.key];
			if (v != null && typeof v === "object") {
				return `${c.key}:${JSON.stringify(v)}`;
			}
			return `${c.key}:${String(v)}`;
		})
		.join("|");
}

function escapeCsvCell(value: string): string {
	if (value.includes(",") || value.includes('"') || value.includes("\n")) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

export function DataGrid({
	columns,
	data,
	caption,
	csvFilename = "datos",
}: DataGridProps) {
	const [sortKey, setSortKey] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

	const sortedData = useMemo(() => {
		if (!sortKey) return data;
		const next = [...data];
		const dir = sortDirection === "asc" ? 1 : -1;
		next.sort((rowA, rowB) => {
			const cmp = compareForSort(rowA[sortKey], rowB[sortKey]);
			return cmp * dir;
		});
		return next;
	}, [data, sortKey, sortDirection]);

	const handleDownloadCsv = useCallback(() => {
		const header = columns.map((c) => escapeCsvCell(c.label)).join(",");
		const rows = sortedData.map((row) =>
			columns
				.map((col) => escapeCsvCell(formatCellValue(col, row[col.key])))
				.join(","),
		);
		const bom = "\uFEFF";
		const csv = bom + [header, ...rows].join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${csvFilename}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}, [columns, sortedData, csvFilename]);

	function handleHeaderClick(key: string) {
		if (sortKey === key) {
			setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
		} else {
			setSortKey(key);
			setSortDirection("asc");
		}
	}

	return (
		<div className="max-h-[500px] overflow-auto border border-border">
			<div className="sticky top-0 z-20 flex items-center justify-between border-b bg-primary/10 px-2 py-1.5">
				<p className="font-mono text-[10px] uppercase tracking-wider text-primary">
					{caption || "\u00A0"}
				</p>
				<button
					type="button"
					onClick={handleDownloadCsv}
					className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
					title="Descargar CSV"
				>
					<Download className="size-3" aria-hidden />
					<span className="hidden sm:inline">CSV</span>
				</button>
			</div>
			<Table>
				<TableHeader>
					<TableRow className="border-b hover:bg-transparent">
						{columns.map((col) => (
							<TableHead
								key={col.key}
								className={cn(
									"sticky top-[29px] z-10 bg-card px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground shadow-[inset_0_-1px_0_0_var(--border)]",
									col.align === "right" && "text-right",
								)}
							>
								<button
									type="button"
									onClick={() => handleHeaderClick(col.key)}
									className={cn(
										"inline-flex w-full items-center gap-1 outline-none hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring",
										col.align === "right" ? "justify-end" : "justify-start",
									)}
								>
									<span>{col.label}</span>
									<ArrowUpDown
										className={cn(
											"size-2.5 shrink-0 opacity-40",
											sortKey === col.key && "text-primary opacity-100",
										)}
										aria-hidden
									/>
								</button>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{sortedData.map((row) => (
						<TableRow
							key={stableRowKey(row, columns)}
							className="border-b even:bg-muted/20 hover:bg-primary/5"
						>
							{columns.map((col) => {
								const raw = row[col.key];
								const text = formatCellValue(col, raw);
								const tone = col.isChange ? getChangeTone(raw) : "neutral";

								return (
									<TableCell
										key={col.key}
										className={cn(
											"px-2 py-1 font-mono text-[11px] tabular-nums",
											col.align === "right" && "text-right",
											tone === "positive" &&
												"text-emerald-500 dark:text-emerald-400",
											tone === "negative" && "text-red-500 dark:text-red-400",
										)}
									>
										{text}
									</TableCell>
								);
							})}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
