import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	formatDisplayDate,
	formatNumber,
	type Period,
	SERIES,
} from "@/lib/constants";
import { getCentralBankData } from "./actions/central-bank";
import { AggregatesChart } from "./components/aggregates-chart";
import { BaseMonetariaChart } from "./components/base-monetaria-chart";
import { SecuritiesGrid } from "./components/securities-grid";

export const dynamic = "force-dynamic";

function pctChange(value: number, previous: number | null): number | null {
	if (previous == null || previous === 0) return null;
	return ((value - previous) / previous) * 100;
}

async function CentralBankContent({ period }: { period: Period }) {
	const data = await getCentralBankData(period);

	const byId = Object.fromEntries(data.latest.map((l) => [l.seriesId, l]));

	const kpiSpecs = [
		{
			id: SERIES.BASE_MONETARIA,
			title: "Base Monetaria",
			unit: "MDP",
			format: (v: number) => formatNumber(v, 0),
		},
		{
			id: SERIES.BILLETES_MONEDAS,
			title: "Billetes y monedas",
			unit: "MDP",
			format: (v: number) => formatNumber(v, 0),
		},
		{
			id: SERIES.M4,
			title: "M4",
			unit: "billones MXN",
			format: (v: number) => formatNumber(v / 1_000_000, 2),
		},
		{
			id: SERIES.VALORES_GOB_TOTAL,
			title: "Valores Gob. Total",
			unit: "billones MXN",
			format: (v: number) => formatNumber(v / 1_000_000, 2),
		},
	] as const;

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{kpiSpecs.map((spec) => {
					const row = byId[spec.id];
					if (!row) {
						return (
							<SeriesCard
								key={spec.id}
								title={spec.title}
								value="—"
								unit={spec.unit}
							/>
						);
					}
					return (
						<SeriesCard
							key={spec.id}
							title={spec.title}
							value={spec.format(row.value)}
							unit={spec.unit}
							change={pctChange(row.value, row.previousValue)}
							date={formatDisplayDate(row.date)}
						/>
					);
				})}
			</div>
			<BaseMonetariaChart data={data.baseData} period={period} />
			<AggregatesChart data={data.aggregateData} period={period} />
			<Card>
				<CardHeader>
					<CardTitle>Valores gubernamentales en circulación</CardTitle>
				</CardHeader>
				<CardContent>
					<SecuritiesGrid data={data.securitiesData} />
				</CardContent>
			</Card>
		</div>
	);
}

export default async function BancoCentralPage({
	searchParams,
}: {
	searchParams: Promise<{ period?: string }>;
}) {
	const params = await searchParams;
	const period = (params.period as Period) || "5Y";

	return (
		<>
			<PageHeader
				title="Banco Central"
				description="Base monetaria, agregados y valores gubernamentales"
			/>
			<SectionExplainer>
				<p>
					La base monetaria comprende los billetes y monedas en circulación más
					los depósitos bancarios en cuenta corriente en Banxico. Es el agregado
					monetario más estrecho y refleja directamente la emisión primaria de
					dinero.
				</p>
				<p>
					Los valores gubernamentales en circulación (Cetes, Bonos M, Udibonos)
					son instrumentos de deuda del gobierno federal. Su saldo total y
					composición por tipo de instrumento indican la estrategia de
					financiamiento público y las condiciones del mercado de deuda.
				</p>
			</SectionExplainer>
			<div className="p-4 md:p-6">
				<Suspense
					fallback={
						<div className="space-y-6">
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{(["bc-sk-1", "bc-sk-2", "bc-sk-3", "bc-sk-4"] as const).map(
									(id) => (
										<Skeleton key={id} className="h-[120px] rounded-xl" />
									),
								)}
							</div>
							<Skeleton className="h-[480px] rounded-xl" />
							<Skeleton className="h-[480px] rounded-xl" />
							<Skeleton className="h-[400px] rounded-xl" />
						</div>
					}
				>
					<CentralBankContent period={period} />
				</Suspense>
			</div>
		</>
	);
}
