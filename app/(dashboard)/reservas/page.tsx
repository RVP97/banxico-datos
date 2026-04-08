import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, type Period } from "@/lib/constants";
import { getReservesData } from "./actions/reserves";
import { ReservesChart } from "./components/reserves-chart";
import { ReservesDataGrid } from "./components/reserves-data-grid";

export const dynamic = "force-dynamic";

async function ReservesContent({ period }: { period: Period }) {
	const data = await getReservesData(period);

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
						title="Reservas Internacionales"
						value={formatNumber(data.latestValue, 2)}
						unit="MDD"
						change={change}
					/>
				</div>
			)}
			<ReservesChart data={data.chartData} period={period} />
			<ReservesDataGrid data={data.gridData} />
		</div>
	);
}

export default async function ReservasPage({
	searchParams,
}: {
	searchParams: Promise<{ period?: string }>;
}) {
	const params = await searchParams;
	const period = (params.period as Period) || "5Y";

	return (
		<>
			<PageHeader
				title="Reservas Internacionales"
				description="Reservas internacionales del Banco de México en millones de dólares"
			/>
			<SectionExplainer>
				<p>
					Las reservas internacionales son activos en moneda extranjera que
					mantiene Banxico para respaldar la estabilidad cambiaria y la
					confianza en la economía. Se reportan semanalmente en millones de
					dólares (MDD).
				</p>
				<p>
					Un nivel alto de reservas proporciona un colchón contra crisis
					cambiarias y mejora la calificación crediticia soberana. Las
					variaciones semanales reflejan intervenciones cambiarias, pagos de
					deuda externa y ajustes de valoración de los activos.
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
					<ReservesContent period={period} />
				</Suspense>
			</div>
		</>
	);
}
