import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	formatDisplayDate,
	formatNumber,
	type Period,
	SERIES,
	SERIES_META,
	type SeriesId,
} from "@/lib/constants";
import { getBOPData } from "./actions/bop";
import { BOPDataGrid } from "./components/bop-data-grid";
import { DebtChart } from "./components/debt-chart";
import { IEDChart } from "./components/ied-chart";

export const dynamic = "force-dynamic";

const KPI_SERIES: SeriesId[] = [
	SERIES.IED_TOTAL,
	SERIES.DEUDA_EXTERNA,
	SERIES.RESERVAS,
	SERIES.TURISMO_INGRESOS,
	SERIES.TURISMO_SALDO,
];

async function BalanzaPagosContent({ period }: { period: Period }) {
	const data = await getBOPData(period);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				{KPI_SERIES.map((seriesId) => {
					const item = data.latest.find((l) => l.seriesId === seriesId);
					if (!item) return null;

					const meta = SERIES_META[seriesId];
					const change =
						item.previousValue != null && item.previousValue !== 0
							? ((item.value - item.previousValue) /
									Math.abs(item.previousValue)) *
								100
							: null;

					return (
						<SeriesCard
							key={item.seriesId}
							title={item.shortLabel}
							value={formatNumber(item.value, 2)}
							unit={meta.unit}
							change={change}
							date={formatDisplayDate(item.date)}
						/>
					);
				})}
			</div>
			<IEDChart data={data.iedData} period={period} />
			<DebtChart data={data.debtData} period={period} />
			<Card>
				<CardHeader>
					<CardTitle>IED trimestral (detalle)</CardTitle>
				</CardHeader>
				<CardContent>
					<BOPDataGrid data={data.iedData} />
				</CardContent>
			</Card>
		</div>
	);
}

export default async function BalanzaPagosPage({
	searchParams,
}: {
	searchParams: Promise<{ period?: string }>;
}) {
	const params = await searchParams;
	const period = (params.period as Period) || "5Y";

	return (
		<>
			<PageHeader
				title="Balanza de Pagos"
				description="Inversión extranjera, deuda externa y turismo"
			/>
			<SectionExplainer>
				<p>
					La Inversión Extranjera Directa (IED) se descompone en nuevas
					inversiones, reinversión de utilidades y cuentas entre compañías. Es
					un indicador de confianza de los inversionistas internacionales en la
					economía mexicana. Se reporta trimestralmente en millones de dólares
					(MDD).
				</p>
				<p>
					La deuda externa bruta total mide las obligaciones del país con
					acreedores no residentes. Un nivel sostenible de deuda externa se
					evalúa en relación al PIB y a las reservas internacionales. El turismo
					contribuye significativamente a la captación de divisas.
				</p>
			</SectionExplainer>
			<div className="p-4 md:p-6">
				<Suspense
					fallback={
						<div className="space-y-6">
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
								<Skeleton className="h-[120px] rounded-xl" />
								<Skeleton className="h-[120px] rounded-xl" />
								<Skeleton className="h-[120px] rounded-xl" />
								<Skeleton className="h-[120px] rounded-xl" />
								<Skeleton className="h-[120px] rounded-xl" />
							</div>
							<Skeleton className="h-[480px] rounded-xl" />
							<Skeleton className="h-[480px] rounded-xl" />
							<Skeleton className="h-[320px] rounded-xl" />
						</div>
					}
				>
					<BalanzaPagosContent period={period} />
				</Suspense>
			</div>
		</>
	);
}
