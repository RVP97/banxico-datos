import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, type Period } from "@/lib/constants";
import { getTourismData } from "./actions/tourism";
import { IncomeBreakdownChart } from "./components/income-breakdown-chart";
import { SpendingChart } from "./components/spending-chart";
import { TourismBalanceChart } from "./components/tourism-balance-chart";
import { TourismDataGrid } from "./components/tourism-data-grid";
import { VisitorsChart } from "./components/visitors-chart";

export const dynamic = "force-dynamic";

async function TourismContent({ period }: { period: Period }) {
  const data = await getTourismData(period);

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
              value={formatNumber(item.value, item.unit === "USD" ? 2 : 0)}
              unit={item.unit}
              change={change}
            />
          );
        })}
      </div>
      <TourismBalanceChart data={data.balanceData} period={period} />
      <div className="grid gap-6 lg:grid-cols-2">
        <VisitorsChart data={data.visitorsData} />
        <SpendingChart data={data.spendingData} />
      </div>
      <IncomeBreakdownChart data={data.incomeBreakdown} />
      <TourismDataGrid data={data.gridData} />
    </div>
  );
}

export default async function TurismoPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const params = await searchParams;
  const period = (params.period as Period) || "5Y";

  return (
    <>
      <PageHeader
        title="Turismo Internacional"
        description="Viajeros internacionales: ingresos, egresos, visitantes y gasto medio"
      />
      <SectionExplainer>
        <p>
          La cuenta de viajeros internacionales registra los ingresos y egresos
          de divisas por turismo. Los ingresos provienen de visitantes
          extranjeros en México; los egresos representan el gasto de mexicanos
          en el exterior. El saldo positivo indica que México es receptor neto
          de divisas turísticas.
        </p>
        <p>
          Los turistas no fronterizos generan el mayor ingreso por persona
          (gasto medio ~$1,200 USD). Los visitantes en cruceros tienen un gasto
          medio menor (~$90 USD) pero representan un volumen significativo. El
          turismo es la tercera fuente de divisas del país, después de
          exportaciones manufactureras y remesas.
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
              <div className="grid gap-6 lg:grid-cols-2">
                <Skeleton className="h-[430px] rounded-xl" />
                <Skeleton className="h-[430px] rounded-xl" />
              </div>
              <Skeleton className="h-[430px] rounded-xl" />
              <Skeleton className="h-[500px] rounded-xl" />
            </div>
          }
        >
          <TourismContent period={period} />
        </Suspense>
      </div>
    </>
  );
}
