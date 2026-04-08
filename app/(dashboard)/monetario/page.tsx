import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, type Period } from "@/lib/constants";
import { getMonetaryData } from "./actions/monetary";
import { MonetaryChart } from "./components/monetary-chart";
import { MonetaryDataGrid } from "./components/monetary-data-grid";

export const dynamic = "force-dynamic";

async function MonetaryContent({ period }: { period: Period }) {
	const data = await getMonetaryData(period);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{data.latest.map((item) => {
					const change =
						item.previousValue != null && item.previousValue !== 0
							? ((item.value - item.previousValue) / item.previousValue) * 100
							: null;

					return (
						<SeriesCard
							key={item.seriesId}
							title={item.shortLabel}
							value={formatNumber(item.value, 0)}
							unit="Miles de MXN"
							change={change}
						/>
					);
				})}
			</div>
			<MonetaryChart data={data.chartData} period={period} />
			<MonetaryDataGrid data={data.gridData} />
		</div>
	);
}

export default async function MonetarioPage({
	searchParams,
}: {
	searchParams: Promise<{ period?: string }>;
}) {
	const params = await searchParams;
	const period = (params.period as Period) || "5Y";

	return (
		<>
			<PageHeader
				title="Agregados Monetarios"
				description="Agregados monetarios M1, M2 y M4 — miles de pesos"
			/>
			<SectionExplainer>
				<p>
					M1 incluye billetes, monedas y depósitos a la vista — es el dinero más
					líquido de la economía. M2 agrega instrumentos de ahorro a corto
					plazo. M4 es el agregado más amplio e incluye todos los instrumentos
					financieros en poder de residentes y no residentes.
				</p>
				<p>
					El crecimiento de los agregados monetarios por encima del crecimiento
					del PIB nominal puede generar presiones inflacionarias. Una
					contracción de M1 relativa a M2 sugiere que los agentes económicos
					prefieren ahorrar sobre gastar, indicando cautela económica.
				</p>
			</SectionExplainer>
			<div className="p-4 md:p-6">
				<Suspense
					fallback={
						<div className="space-y-6">
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								<Skeleton className="h-[120px] rounded-xl" />
								<Skeleton className="h-[120px] rounded-xl" />
								<Skeleton className="h-[120px] rounded-xl" />
							</div>
							<Skeleton className="h-[480px] rounded-xl" />
							<Skeleton className="h-[500px] rounded-xl" />
						</div>
					}
				>
					<MonetaryContent period={period} />
				</Suspense>
			</div>
		</>
	);
}
