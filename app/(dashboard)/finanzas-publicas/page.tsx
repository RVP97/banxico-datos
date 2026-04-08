import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDisplayDate, formatNumber, type Period } from "@/lib/constants";
import { getFiscalData } from "./actions/fiscal";
import { FiscalChart, FiscalDataGrid } from "./components/fiscal-chart";

export const dynamic = "force-dynamic";

async function FiscalContent({ period }: { period: Period }) {
	const data = await getFiscalData(period);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{data.latest.map((item) => {
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
							value={formatNumber(item.value / 1_000_000, 2)}
							unit="mil millones MXN"
							change={change}
							date={formatDisplayDate(item.date)}
						/>
					);
				})}
			</div>
			<FiscalChart data={data.chartData} period={period} />
			<FiscalDataGrid data={data.chartData} />
		</div>
	);
}

export default async function FinanzasPublicasPage({
	searchParams,
}: {
	searchParams: Promise<{ period?: string }>;
}) {
	const params = await searchParams;
	const period = (params.period as Period) || "5Y";

	return (
		<>
			<PageHeader
				title="Finanzas Públicas"
				description="Ingresos, gasto y balance del sector público"
			/>
			<SectionExplainer>
				<p>
					Los ingresos públicos provienen de impuestos, derechos y
					aprovechamientos del Gobierno Federal. El gasto público incluye gasto
					corriente (operación) y gasto de capital (inversión). Los datos son
					flujos acumulados mensuales en millones de pesos (MDP).
				</p>
				<p>
					El balance presupuestario es la diferencia entre ingresos y gastos
					totales. El balance primario excluye el costo financiero de la deuda
					(pago de intereses), y es un mejor indicador del esfuerzo fiscal. Un
					balance primario superavitario indica que el gobierno genera recursos
					suficientes para pagar intereses.
				</p>
			</SectionExplainer>
			<div className="p-4 md:p-6">
				<Suspense
					fallback={
						<div className="space-y-6">
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{(["fp-sk-a", "fp-sk-b", "fp-sk-c", "fp-sk-d"] as const).map(
									(id) => (
										<Skeleton key={id} className="h-[120px] rounded-xl" />
									),
								)}
							</div>
							<Skeleton className="h-[480px] rounded-xl" />
							<Skeleton className="h-[320px] rounded-xl" />
						</div>
					}
				>
					<FiscalContent period={period} />
				</Suspense>
			</div>
		</>
	);
}
