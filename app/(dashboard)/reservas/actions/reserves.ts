"use server";

import {
	getStartDateForPeriod,
	type Period,
	SERIES,
	toDateStr,
} from "@/lib/constants";
import { getLatestValue, getSeriesData } from "@/lib/data";
import type { ReservesData } from "../types/reserves";

export async function getReservesData(
	period: Period = "5Y",
): Promise<ReservesData> {
	const startDate = getStartDateForPeriod(period) ?? undefined;
	const endDate = new Date();

	const [data, latest] = await Promise.all([
		getSeriesData(SERIES.RESERVAS, startDate, endDate),
		getLatestValue(SERIES.RESERVAS),
	]);

	const chartData = data.map((d) => ({
		date: toDateStr(d.date),
		value: d.value,
	}));

	const gridData = [...chartData].sort((a, b) => b.date.localeCompare(a.date));

	return {
		chartData,
		gridData,
		latestValue: latest?.value ?? null,
		latestDate: latest?.date ?? null,
		previousValue: latest?.previousValue ?? null,
	};
}
