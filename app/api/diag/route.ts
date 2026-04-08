import { NextResponse } from "next/server";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { dataPoints } from "@/db/schema";
import { fetchLatestFromAPI } from "@/lib/banxico";
import { ALL_SERIES_IDS, SERIES_META, type SeriesId } from "@/lib/constants";

interface SeriesReport {
	seriesId: string;
	label: string;
	unit: string;
	frequency: string;
	dbRowCount: number;
	latestDbDate: string | null;
	latestDbValue: number | null;
	liveValue?: number | null;
	liveDate?: string | null;
	status: "ok" | "empty" | "mismatch" | "error";
}

export async function GET(request: Request) {
	const secret = request.headers.get("x-sync-secret");
	if (secret !== process.env.SYNC_SECRET) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const url = new URL(request.url);
	const live = url.searchParams.get("live") === "true";
	const filterSeries = url.searchParams.get("series");

	const seriesIds: string[] = filterSeries
		? filterSeries.split(",")
		: (ALL_SERIES_IDS as unknown as string[]);

	const reports: SeriesReport[] = [];

	for (const id of seriesIds) {
		const meta = (SERIES_META as Record<string, { label: string; shortLabel: string; unit: string; frequency: string }>)[id];

		try {
			const [countResult] = await db
				.select({ cnt: count() })
				.from(dataPoints)
				.where(eq(dataPoints.seriesId, id));

			const [latestRow] = await db
				.select({ date: dataPoints.date, value: dataPoints.value })
				.from(dataPoints)
				.where(eq(dataPoints.seriesId, id))
				.orderBy(desc(dataPoints.date))
				.limit(1);

			const report: SeriesReport = {
				seriesId: id,
				label: meta?.label ?? "Unknown",
				unit: meta?.unit ?? "?",
				frequency: meta?.frequency ?? "?",
				dbRowCount: countResult?.cnt ?? 0,
				latestDbDate: latestRow ? latestRow.date.toISOString().split("T")[0] : null,
				latestDbValue: latestRow ? Number(latestRow.value) : null,
				status: (countResult?.cnt ?? 0) > 0 ? "ok" : "empty",
			};

			if (live) {
				try {
					const parsed = await fetchLatestFromAPI([id]);
					const s = parsed[0];
					if (s && s.data.length > 0) {
						report.liveValue = s.data[0].value;
						report.liveDate = s.data[0].date.toISOString().split("T")[0];
					} else {
						report.liveValue = null;
						report.liveDate = null;
						if (report.status === "ok") report.status = "mismatch";
					}
				} catch {
					report.liveValue = null;
					report.liveDate = null;
					report.status = "error";
				}
			}

			reports.push(report);
		} catch {
			reports.push({
				seriesId: id,
				label: meta?.label ?? "Unknown",
				unit: meta?.unit ?? "?",
				frequency: meta?.frequency ?? "?",
				dbRowCount: 0,
				latestDbDate: null,
				latestDbValue: null,
				status: "error",
			});
		}
	}

	const summary = {
		total: reports.length,
		ok: reports.filter((r) => r.status === "ok").length,
		empty: reports.filter((r) => r.status === "empty").length,
		mismatch: reports.filter((r) => r.status === "mismatch").length,
		error: reports.filter((r) => r.status === "error").length,
	};

	return NextResponse.json({ summary, reports });
}
