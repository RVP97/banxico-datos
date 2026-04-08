import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, type Period } from "@/lib/constants";
import { getInterestRateData } from "./actions/interest-rates";
import { RatesChart } from "./components/rates-chart";
import { RatesDataGrid } from "./components/rates-data-grid";
import { YieldCurveCard } from "./components/yield-curve-card";

export const dynamic = "force-dynamic";

async function RatesContent({ period }: { period: Period }) {
	const data = await getInterestRateData(period);

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 xl:flex-row xl:items-stretch">
				<div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{data.latest.map((rate) => {
						const change =
							rate.previousValue != null && rate.previousValue !== 0
								? ((rate.value - rate.previousValue) / rate.previousValue) * 100
								: null;

						return (
							<SeriesCard
								key={rate.seriesId}
								title={rate.shortLabel}
								value={formatNumber(rate.value, 4)}
								unit="%"
								change={change}
							/>
						);
					})}
				</div>
				<div className="w-full shrink-0 xl:w-[min(100%,320px)]">
					<YieldCurveCard data={data.yieldCurve} />
				</div>
			</div>
			<RatesChart data={data.chartData} period={period} />
			<RatesDataGrid data={data.gridData} />
		</div>
	);
}

export default async function TasasPage({
	searchParams,
}: {
	searchParams: Promise<{ period?: string }>;
}) {
	const params = await searchParams;
	const period = (params.period as Period) || "5Y";

	return (
		<>
			<PageHeader
				title="Tasas de Interés"
				description="Tasa objetivo, TIIE y Cetes — Banco de México"
			/>
			<SectionExplainer>
				<p>
					La tasa objetivo es el instrumento principal de política monetaria de
					Banxico. La TIIE (Tasa de Interés Interbancaria de Equilibrio) refleja
					las condiciones del mercado interbancario y sirve como referencia para
					créditos y derivados.
				</p>
				<p>
					La curva de rendimiento de Cetes muestra las tasas a distintos plazos.
					Una curva normal (pendiente positiva) indica expectativas de
					crecimiento; una curva invertida (tasas cortas mayores que largas)
					sugiere expectativas de desaceleración o recortes futuros de tasa.
				</p>
			</SectionExplainer>
			<div className="p-4 md:p-6">
				<Suspense
					fallback={
						<div className="space-y-6">
							<div className="flex flex-col gap-4 xl:flex-row">
								<div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
									{(
										[
											"rate-sk-a",
											"rate-sk-b",
											"rate-sk-c",
											"rate-sk-d",
											"rate-sk-e",
											"rate-sk-f",
											"rate-sk-g",
											"rate-sk-h",
										] as const
									).map((id) => (
										<Skeleton key={id} className="h-[120px] rounded-xl" />
									))}
								</div>
								<Skeleton className="h-[260px] w-full shrink-0 rounded-xl xl:w-[320px]" />
							</div>
							<Skeleton className="h-[480px] rounded-xl" />
							<Skeleton className="h-[320px] rounded-xl" />
						</div>
					}
				>
					<RatesContent period={period} />
				</Suspense>
			</div>
		</>
	);
}
