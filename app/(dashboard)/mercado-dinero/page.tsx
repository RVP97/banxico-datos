import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, type Period } from "@/lib/constants";
import { YieldCurveCard } from "../tasas/components/yield-curve-card";
import { getMoneyMarketData } from "./actions/money-market";
import { MoneyMarketChart } from "./components/money-market-chart";
import { MoneyMarketDataGrid } from "./components/money-market-data-grid";
import { SpreadChart } from "./components/spread-chart";

export const dynamic = "force-dynamic";

async function MercadoDineroContent({ period }: { period: Period }) {
	const data = await getMoneyMarketData(period);

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
			<MoneyMarketChart data={data.chartData} period={period} />
			<SpreadChart data={data.spreadData} period={period} />
			<MoneyMarketDataGrid data={data.chartData} />
		</div>
	);
}

export default async function MercadoDineroPage({
	searchParams,
}: {
	searchParams: Promise<{ period?: string }>;
}) {
	const params = await searchParams;
	const period = (params.period as Period) || "5Y";

	return (
		<>
			<PageHeader
				title="Mercado de Dinero"
				description="Tasas interbancarias, fondeo y curva de rendimiento"
			/>
			<SectionExplainer>
				<p>
					La TIIE de Fondeo refleja el costo del dinero a un día en el mercado
					interbancario. Las tasas compuestas a 28 y 91 días permiten comparar
					el fondeo de corto plazo con instrumentos de mayor plazo.
				</p>
				<p>
					El spread entre la tasa de fondeo y la tasa objetivo indica las
					condiciones de liquidez del sistema. Un spread positivo sugiere
					presión en la demanda de fondos; un spread negativo indica exceso de
					liquidez.
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
											"mm-sk-a",
											"mm-sk-b",
											"mm-sk-c",
											"mm-sk-d",
											"mm-sk-e",
											"mm-sk-f",
											"mm-sk-g",
											"mm-sk-h",
										] as const
									).map((id) => (
										<Skeleton key={id} className="h-[120px] rounded-xl" />
									))}
								</div>
								<Skeleton className="h-[260px] w-full shrink-0 rounded-xl xl:w-[320px]" />
							</div>
							<Skeleton className="h-[400px] rounded-xl" />
							<Skeleton className="h-[320px] rounded-xl" />
							<Skeleton className="h-[500px] rounded-xl" />
						</div>
					}
				>
					<MercadoDineroContent period={period} />
				</Suspense>
			</div>
		</>
	);
}
