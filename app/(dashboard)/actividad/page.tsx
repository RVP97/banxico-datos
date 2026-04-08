import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, type Period } from "@/lib/constants";
import { getActivityData } from "./actions/activity";
import { ActivityChart } from "./components/activity-chart";
import { ActivityDataGrid } from "./components/activity-data-grid";

export const dynamic = "force-dynamic";

async function ActivityContent({ period }: { period: Period }) {
	const data = await getActivityData(period);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{data.latest.map((item) => {
					const change =
						item.previousValue != null && item.previousValue !== 0
							? ((item.value - item.previousValue) / item.previousValue) * 100
							: null;

					return (
						<SeriesCard
							key={item.seriesId}
							title={item.shortLabel}
							value={formatNumber(item.value, 1)}
							unit="Índice (2018=100)"
							change={change}
						/>
					);
				})}
			</div>
			<ActivityChart data={data.chartData} period={period} />
			<ActivityDataGrid data={data.gridData} />
		</div>
	);
}

export default async function ActividadPage({
	searchParams,
}: {
	searchParams: Promise<{ period?: string }>;
}) {
	const params = await searchParams;
	const period = (params.period as Period) || "5Y";

	return (
		<>
			<PageHeader
				title="Actividad Económica"
				description="Indicador Global de la Actividad Económica (IGAE), base 2018=100"
			/>
			<SectionExplainer>
				<p>
					El IGAE (Indicador Global de la Actividad Económica) es un proxy
					mensual del PIB que permite monitorear la economía con mayor
					frecuencia. Se descompone en actividades primarias (agricultura),
					secundarias (industria) y terciarias (servicios).
				</p>
				<p>
					Valores positivos de variación anual indican expansión económica. El
					sector terciario (servicios) representa aproximadamente 60% de la
					economía mexicana. La producción industrial y manufactura son
					indicadores adelantados de la actividad general.
				</p>
			</SectionExplainer>
			<div className="p-4 md:p-6">
				<Suspense
					fallback={
						<div className="space-y-6">
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{(
									[
										"igae-sk-total",
										"igae-sk-primarias",
										"igae-sk-secundarias",
										"igae-sk-terciarias",
									] as const
								).map((id) => (
									<Skeleton key={id} className="h-[120px] rounded-xl" />
								))}
							</div>
							<Skeleton className="h-[480px] rounded-xl" />
							<Skeleton className="h-[500px] rounded-xl" />
						</div>
					}
				>
					<ActivityContent period={period} />
				</Suspense>
			</div>
		</>
	);
}
