import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, type Period } from "@/lib/constants";
import { getTradeData } from "./actions/trade";
import { ExportBreakdownChart } from "./components/export-breakdown-chart";
import { TradeChart } from "./components/trade-chart";
import { TradeDataGrid } from "./components/trade-data-grid";

export const dynamic = "force-dynamic";

async function TradeContent({ period }: { period: Period }) {
	const data = await getTradeData(period);

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
							value={formatNumber(item.value, 0)}
							unit="Miles USD"
							change={change}
						/>
					);
				})}
			</div>
			<TradeChart data={data.chartData} period={period} />
			<ExportBreakdownChart data={data.chartData} period={period} />
			<TradeDataGrid data={data.gridData} />
		</div>
	);
}

export default async function ComercioPage({
	searchParams,
}: {
	searchParams: Promise<{ period?: string }>;
}) {
	const params = await searchParams;
	const period = (params.period as Period) || "5Y";

	return (
		<>
			<PageHeader
				title="Comercio Exterior"
				description="Exportaciones, importaciones, balanza comercial y desglose petrolero"
			/>
			<SectionExplainer>
				<p>
					La balanza comercial es la diferencia entre exportaciones e
					importaciones. Un déficit comercial indica que el país importa más de
					lo que exporta. Las exportaciones se desglosan entre petroleras y no
					petroleras para distinguir la dependencia de los hidrocarburos.
				</p>
				<p>
					Las exportaciones no petroleras, principalmente manufacturas,
					representan más del 90% del total y reflejan la competitividad
					industrial de México. La relación comercial con EE.UU. concentra cerca
					del 80% del comercio total.
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
							<Skeleton className="h-[430px] rounded-xl" />
							<Skeleton className="h-[500px] rounded-xl" />
						</div>
					}
				>
					<TradeContent period={period} />
				</Suspense>
			</div>
		</>
	);
}
