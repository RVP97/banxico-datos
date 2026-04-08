import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, type Period } from "@/lib/constants";
import { getPaymentsData } from "./actions/payments";
import { CardOpsChart } from "./components/card-ops-chart";
import { CardsChart } from "./components/cards-chart";
import { ChequesChart } from "./components/cheques-chart";
import { OtherPaymentsChart } from "./components/other-payments-chart";
import { PaymentsDataGrid } from "./components/payments-data-grid";
import { SpeiMonthlyChart } from "./components/spei-monthly-chart";
import { SpeiP2PChart } from "./components/spei-p2p-chart";
import { SpeiVolumeChart } from "./components/spei-volume-chart";
import { TransfersChart } from "./components/transfers-chart";

export const dynamic = "force-dynamic";

async function PaymentsContent({ period }: { period: Period }) {
  const data = await getPaymentsData(period);

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
              unit={item.unit}
              change={change}
            />
          );
        })}
      </div>

      <SpeiVolumeChart data={data.speiDaily} period={period} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SpeiP2PChart data={data.speiP2P} />
        <SpeiMonthlyChart data={data.speiMonthly} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CardsChart data={data.cards} />
        <CardOpsChart data={data.cardOps} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChequesChart data={data.cheques} />
        <TransfersChart data={data.transfers} />
      </div>

      <OtherPaymentsChart data={data.other} />

      <PaymentsDataGrid data={data.gridData} />
    </div>
  );
}

export default async function SistemasPagoPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const params = await searchParams;
  const period = (params.period as Period) || "5Y";

  return (
    <>
      <PageHeader
        title="Sistemas de Pago"
        description="SPEI, tarjetas, cheques, transferencias electrónicas, CoDi y más"
      />
      <SectionExplainer>
        <p>
          Los sistemas de pago en México incluyen infraestructuras de alto y
          bajo valor. El SPEI (Sistema de Pagos Electrónicos Interbancarios)
          procesa más de 20 millones de transferencias diarias y es la columna
          vertebral del sistema financiero mexicano.
        </p>
        <p>
          Las transferencias P2P (persona a persona) se clasifican por rango de
          monto: menores a $8,000 MXN (micropagas), entre $8,000 y $300,000 MXN,
          y mayores a $300,000 MXN. Las operaciones de bajo valor representan la
          mayor cantidad pero menor monto, mientras que alto valor es lo
          inverso.
        </p>
        <p>
          Las tarjetas bancarias (crédito y débito) son el principal instrumento
          de pago minorista. Los cheques continúan en tendencia descendente,
          siendo reemplazados por transferencias electrónicas. El TEF CECOBAN
          procesa transferencias interbancarias por lotes, complementando el
          procesamiento en tiempo real del SPEI. CoDi es la plataforma de cobro
          digital del Banco de México basada en códigos QR.
        </p>
      </SectionExplainer>
      <div className="p-4 md:p-6">
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
                <Skeleton className="h-[120px]" />
              </div>
              <Skeleton className="h-[480px]" />
              <div className="grid gap-6 lg:grid-cols-2">
                <Skeleton className="h-[430px]" />
                <Skeleton className="h-[430px]" />
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <Skeleton className="h-[430px]" />
                <Skeleton className="h-[430px]" />
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <Skeleton className="h-[430px]" />
                <Skeleton className="h-[430px]" />
              </div>
              <Skeleton className="h-[430px]" />
              <Skeleton className="h-[500px]" />
            </div>
          }
        >
          <PaymentsContent period={period} />
        </Suspense>
      </div>
    </>
  );
}
