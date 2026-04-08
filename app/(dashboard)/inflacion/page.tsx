import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, type Period } from "@/lib/constants";
import { getInflationData } from "./actions/inflation";
import { CPIChart } from "./components/cpi-chart";
import { InflationDataGrid } from "./components/inflation-data-grid";
import { InflationRateChart } from "./components/inflation-rate-chart";
import { InflationTable } from "./components/inflation-table";

export const dynamic = "force-dynamic";

async function InflationContent({ period }: { period: Period }) {
	const data = await getInflationData(period);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{data.kpis.map((kpi) => {
					const change =
						kpi.previousValue != null && kpi.previousValue !== 0
							? ((kpi.value - kpi.previousValue) /
									Math.abs(kpi.previousValue)) *
								100
							: null;

					return (
						<SeriesCard
							key={kpi.label}
							title={kpi.label}
							value={
								kpi.unit === "%"
									? `${formatNumber(kpi.value, 2)}%`
									: formatNumber(kpi.value, 3)
							}
							unit={kpi.unit === "%" ? "" : kpi.unit}
							change={change}
						/>
					);
				})}
			</div>
			<InflationRateChart data={data.chartData} />
			<CPIChart data={data.chartData} period={period} />
			<InflationTable data={data.tableData} />
			<InflationDataGrid data={data.gridData} />
		</div>
	);
}

export default async function InflacionPage({
	searchParams,
}: {
	searchParams: Promise<{ period?: string }>;
}) {
	const params = await searchParams;
	const period = (params.period as Period) || "5Y";

	return (
		<>
			<PageHeader
				title="Inflación"
				description="Índice Nacional de Precios al Consumidor (INPC) y tasa de inflación"
			/>
			<SectionExplainer>
				<p>
					El INPC mide la variación de precios de una canasta de bienes y
					servicios representativa del consumo en México. La inflación general
					incluye todos los componentes; la subyacente excluye bienes
					agropecuarios y energéticos por su alta volatilidad.
				</p>
				<p>
					El objetivo de Banxico es mantener la inflación en 3% ±1 punto
					porcentual. Cuando la inflación subyacente supera a la general, indica
					presiones de precios más persistentes. La brecha entre inflación
					observada y el objetivo de 3% orienta las decisiones de política
					monetaria.
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
							<Skeleton className="h-[380px] rounded-xl" />
							<Skeleton className="h-[480px] rounded-xl" />
							<Skeleton className="h-[450px] rounded-xl" />
							<Skeleton className="h-[320px] rounded-xl" />
						</div>
					}
				>
					<InflationContent period={period} />
				</Suspense>
			</div>
		</>
	);
}
