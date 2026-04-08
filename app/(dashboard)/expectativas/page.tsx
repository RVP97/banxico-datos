import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDisplayDate, formatNumber, type Period } from "@/lib/constants";
import { getExpectationsData } from "./actions/expectations";
import { ExpectationsDataGrid } from "./components/expectations-data-grid";
import { GDPExpectationsChart } from "./components/gdp-expectations-chart";
import { InflationExpectationsChart } from "./components/inflation-expectations-chart";
import { UnemploymentExpectationsChart } from "./components/unemployment-expectations-chart";

export const dynamic = "force-dynamic";

async function ExpectationsContent({ period }: { period: Period }) {
	const data = await getExpectationsData(period);

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
							value={formatNumber(item.value, 2)}
							unit="%"
							change={change}
							date={formatDisplayDate(item.date)}
						/>
					);
				})}
			</div>
			<InflationExpectationsChart data={data.chartData} period={period} />
			<div className="grid gap-6 xl:grid-cols-2">
				<GDPExpectationsChart data={data.chartData} />
				<UnemploymentExpectationsChart data={data.chartData} />
			</div>
			<div className="space-y-2">
				<h2 className="text-sm font-medium text-muted-foreground">
					Historial de expectativas
				</h2>
				<ExpectationsDataGrid data={data.chartData} />
			</div>
		</div>
	);
}

export default async function ExpectativasPage({
	searchParams,
}: {
	searchParams: Promise<{ period?: string }>;
}) {
	const params = await searchParams;
	const period = (params.period as Period) || "5Y";

	return (
		<>
			<PageHeader
				title="Expectativas"
				description="Encuesta de especialistas del sector privado"
			/>
			<SectionExplainer>
				<p>
					Las expectativas provienen de la Encuesta sobre las Expectativas de
					los Especialistas en Economía del Sector Privado, realizada
					mensualmente por Banxico. Recoge pronósticos de PIB, inflación y
					desempleo para el año en curso y el siguiente.
				</p>
				<p>
					La mediana es más robusta que el promedio ante valores extremos. La
					dispersión entre analistas indica incertidumbre: cuando las
					expectativas convergen, hay mayor consenso sobre la dirección
					económica. Desviaciones persistentes respecto al objetivo de Banxico
					pueden anticipar cambios de política monetaria.
				</p>
			</SectionExplainer>
			<div className="p-4 md:p-6">
				<Suspense
					fallback={
						<div className="space-y-6">
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{(
									["exp-sk-a", "exp-sk-b", "exp-sk-c", "exp-sk-d"] as const
								).map((id) => (
									<Skeleton key={id} className="h-[120px] rounded-xl" />
								))}
							</div>
							<Skeleton className="h-[320px] rounded-xl" />
							<div className="grid gap-6 xl:grid-cols-2">
								<Skeleton className="h-[320px] rounded-xl" />
								<Skeleton className="h-[320px] rounded-xl" />
							</div>
							<Skeleton className="h-[320px] rounded-xl" />
						</div>
					}
				>
					<ExpectationsContent period={period} />
				</Suspense>
			</div>
		</>
	);
}
