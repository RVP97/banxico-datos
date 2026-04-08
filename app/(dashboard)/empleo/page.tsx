import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDisplayDate, formatNumber, type Period } from "@/lib/constants";
import { getLaborData } from "./actions/labor";
import { LaborChart } from "./components/labor-chart";
import { LaborDataGrid } from "./components/labor-data-grid";

export const dynamic = "force-dynamic";

async function EmpleoContent({ period }: { period: Period }) {
	const data = await getLaborData(period);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
							value={`${formatNumber(item.value, 2)}`}
							unit="%"
							change={change}
							date={formatDisplayDate(item.date)}
						/>
					);
				})}
			</div>
			<LaborChart data={data.chartData} period={period} />
			<LaborDataGrid data={data.chartData} />
		</div>
	);
}

export default async function EmpleoPage({
	searchParams,
}: {
	searchParams: Promise<{ period?: string }>;
}) {
	const params = await searchParams;
	const period = (params.period as Period) || "5Y";

	return (
		<>
			<PageHeader
				title="Mercado Laboral"
				description="Desocupación, subocupación y expectativas"
			/>
			<SectionExplainer>
				<p>
					La tasa de desocupación mide el porcentaje de la PEA (Población
					Económicamente Activa) que busca empleo sin encontrarlo. La tasa de
					subocupación captura a personas que trabajan menos horas de las que
					desean o necesitan.
				</p>
				<p>
					La subocupación suele ser un indicador más sensible del mercado
					laboral mexicano que la desocupación, ya que captura el empleo
					informal e insuficiente. Ambas tasas se reportan con ajuste estacional
					para comparaciones intertemporales válidas.
				</p>
			</SectionExplainer>
			<div className="p-4 md:p-6">
				<Suspense
					fallback={
						<div className="space-y-6">
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{(["k1", "k2", "k3"] as const).map((id) => (
									<Skeleton key={id} className="h-[120px] rounded-xl" />
								))}
							</div>
							<Skeleton className="h-[480px] rounded-xl" />
							<Skeleton className="h-[500px] rounded-xl" />
						</div>
					}
				>
					<EmpleoContent period={period} />
				</Suspense>
			</div>
		</>
	);
}
