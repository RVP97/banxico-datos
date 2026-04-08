import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, type Period } from "@/lib/constants";
import { getRemittancesData } from "./actions/remittances";
import { RemesasDataGrid } from "./components/remesas-data-grid";
import { RemittancesChart } from "./components/remittances-chart";

export const dynamic = "force-dynamic";

async function RemittancesContent({ period }: { period: Period }) {
	const data = await getRemittancesData(period);

	const change =
		data.latestValue != null &&
		data.previousValue != null &&
		data.previousValue !== 0
			? ((data.latestValue - data.previousValue) / data.previousValue) * 100
			: null;

	return (
		<div className="space-y-6">
			{data.latestValue != null && (
				<div className="max-w-sm">
					<SeriesCard
						title="Remesas Totales"
						value={formatNumber(data.latestValue, 2)}
						unit="MDD"
						change={change}
					/>
				</div>
			)}
			<RemittancesChart data={data.chartData} period={period} />
			<RemesasDataGrid data={data.gridData} />
		</div>
	);
}

export default async function RemesasPage({
	searchParams,
}: {
	searchParams: Promise<{ period?: string }>;
}) {
	const params = await searchParams;
	const period = (params.period as Period) || "5Y";

	return (
		<>
			<PageHeader
				title="Remesas Familiares"
				description="Ingresos por remesas familiares a México en millones de dólares"
			/>
			<SectionExplainer>
				<p>
					Las remesas son transferencias de dinero que envían los mexicanos en
					el exterior a sus familias en México. Son la segunda fuente de divisas
					más importante del país, después de las exportaciones manufactureras.
				</p>
				<p>
					Las remesas tienen un patrón estacional marcado, con picos en
					mayo-junio y diciembre. Un aumento sostenido puede indicar mayor
					migración o mejores condiciones laborales en el exterior. Se reportan
					en millones de dólares.
				</p>
			</SectionExplainer>
			<div className="p-4 md:p-6">
				<Suspense
					fallback={
						<div className="space-y-6">
							<Skeleton className="h-[120px] max-w-sm rounded-xl" />
							<Skeleton className="h-[480px] rounded-xl" />
							<Skeleton className="h-[500px] rounded-xl" />
						</div>
					}
				>
					<RemittancesContent period={period} />
				</Suspense>
			</div>
		</>
	);
}
