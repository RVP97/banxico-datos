import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionExplainer } from "@/components/section-explainer";
import { SeriesCard } from "@/components/series-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, type Period } from "@/lib/constants";
import { getUDIData } from "./actions/udis";
import { UDIChart } from "./components/udi-chart";

export const dynamic = "force-dynamic";

async function UDIContent({ period }: { period: Period }) {
  const data = await getUDIData(period);

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
            title="Valor de UDI"
            value={formatNumber(data.latestValue, 6)}
            unit="MXN"
            change={change}
          />
        </div>
      )}
      <UDIChart data={data.chartData} period={period} />
    </div>
  );
}

export default async function UdisPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const params = await searchParams;
  const period = (params.period as Period) || "5Y";

  return (
    <>
      <PageHeader
        title="UDIS"
        description="Valor de las Unidades de Inversión"
      />
      <SectionExplainer>
        <p>
          La UDI (Unidad de Inversión) es una unidad de cuenta cuyo valor se
          actualiza diariamente conforme a la inflación medida por el INPC. Fue
          creada en 1995 para proteger el ahorro y los créditos del efecto
          inflacionario.
        </p>
        <p>
          Se utiliza como referencia para créditos hipotecarios, instrumentos de
          deuda (Udibonos) y contratos indexados a inflación. Su trayectoria
          ascendente refleja la inflación acumulada; la pendiente indica el
          ritmo inflacionario reciente.
        </p>
      </SectionExplainer>
      <div className="p-4 md:p-6">
        <Suspense
          fallback={
            <div className="space-y-6">
              <Skeleton className="h-[120px] max-w-sm rounded-xl" />
              <Skeleton className="h-[480px] rounded-xl" />
            </div>
          }
        >
          <UDIContent period={period} />
        </Suspense>
      </div>
    </>
  );
}
