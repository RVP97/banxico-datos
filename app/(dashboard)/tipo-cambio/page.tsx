import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { Skeleton } from "@/components/ui/skeleton";
import type { Period } from "@/lib/constants";
import { getExchangeRateData } from "./actions/exchange-rates";
import { CurrencyDataGrid } from "./components/currency-data-grid";
import { CurrencyTable } from "./components/currency-table";
import { ExchangeRateChart } from "./components/exchange-rate-chart";
import { FixVsLiqChart } from "./components/fix-vs-liq-chart";

export const dynamic = "force-dynamic";

async function ExchangeRateContent({ period }: { period: Period }) {
	const data = await getExchangeRateData(period);

	return (
		<div className="space-y-6">
			<ExchangeRateChart data={data.usdMxn} period={period} />
			<FixVsLiqChart data={data.fixVsLiq} period={period} />
			<CurrencyTable currencies={data.currencies} />
			<CurrencyDataGrid gridData={data.gridData} />
		</div>
	);
}

export default async function TipoCambioPage({
	searchParams,
}: {
	searchParams: Promise<{ period?: string }>;
}) {
	const params = await searchParams;
	const period = (params.period as Period) || "1Y";

	return (
		<>
			<PageHeader
				title="Tipo de Cambio"
				description="Tipos de cambio de divisas vs peso mexicano"
			/>
			<SectionExplainer>
				<p>
					El tipo de cambio FIX es determinado por Banxico con base en
					cotizaciones del mercado cambiario al mayoreo y se publica un día
					hábil después. El tipo de cambio de liquidación refleja operaciones de
					compra-venta de dólares del mismo día.
				</p>
				<p>
					Una depreciación del peso (valor más alto) encarece importaciones y
					deuda en divisas, pero beneficia exportaciones y remesas. El tipo de
					cambio real ajusta por diferenciales de inflación entre países, siendo
					mejor indicador de competitividad.
				</p>
			</SectionExplainer>
			<div className="p-4 md:p-6">
				<Suspense
					fallback={
						<div className="space-y-6">
							<Skeleton className="h-[480px] rounded-xl" />
							<Skeleton className="h-[480px] rounded-xl" />
							<Skeleton className="h-[300px] rounded-xl" />
							<Skeleton className="h-[400px] rounded-xl" />
						</div>
					}
				>
					<ExchangeRateContent period={period} />
				</Suspense>
			</div>
		</>
	);
}
