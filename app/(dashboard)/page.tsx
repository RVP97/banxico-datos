import {
	ArrowLeftRight,
	Banknote,
	BarChart3,
	Briefcase,
	Building2,
	CircleDollarSign,
	Coins,
	Factory,
	Globe,
	Home,
	Landmark,
	LineChart,
	Percent,
	TrendingUp,
	Users,
	Wallet,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { getOverviewData } from "./actions/overview";
import { KPICards } from "./components/kpi-cards";
import { OverviewSparklines } from "./components/overview-sparklines";

export const dynamic = "force-dynamic";

const KPI_SKELETON_GROUPS = [
	{ id: "mercados", cardIds: ["a", "b", "c", "d", "e"] as const },
	{ id: "precios", cardIds: ["a", "b", "c", "d"] as const },
	{ id: "actividad", cardIds: ["a", "b", "c", "d"] as const },
	{ id: "externo", cardIds: ["a", "b", "c"] as const },
] as const;

const SPARKLINE_SKELETON_IDS = [
	"s1",
	"s2",
	"s3",
	"s4",
	"s5",
	"s6",
	"s7",
	"s8",
	"s9",
	"s10",
	"s11",
	"s12",
	"s13",
	"s14",
	"s15",
	"s16",
] as const;

const QUICK_NAV_ITEMS = [
	{ title: "Resumen", href: "/", icon: Home },
	{ title: "Tipo de Cambio", href: "/tipo-cambio", icon: CircleDollarSign },
	{ title: "Tasas de Interés", href: "/tasas", icon: TrendingUp },
	{ title: "Mercado de Dinero", href: "/mercado-dinero", icon: Percent },
	{ title: "Inflación", href: "/inflacion", icon: BarChart3 },
	{ title: "Actividad Económica", href: "/actividad", icon: Factory },
	{ title: "Mercado Laboral", href: "/empleo", icon: Users },
	{ title: "Comercio Exterior", href: "/comercio", icon: ArrowLeftRight },
	{ title: "Remesas", href: "/remesas", icon: Banknote },
	{ title: "Expectativas", href: "/expectativas", icon: LineChart },
	{ title: "Reservas", href: "/reservas", icon: Building2 },
	{ title: "UDIS", href: "/udis", icon: Coins },
	{ title: "Banco Central", href: "/banco-central", icon: Landmark },
	{ title: "Agregados Monetarios", href: "/monetario", icon: Wallet },
	{ title: "Finanzas Públicas", href: "/finanzas-publicas", icon: Briefcase },
	{ title: "Balanza de Pagos", href: "/balanza-pagos", icon: Globe },
] as const;

function KPISkeleton() {
	return (
		<div className="space-y-6">
			{KPI_SKELETON_GROUPS.map((group) => (
				<div key={group.id}>
					<Skeleton className="mb-2 h-3 w-32" />
					<div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">
						{group.cardIds.map((cardId) => (
							<Skeleton key={`${group.id}-${cardId}`} className="h-[100px]" />
						))}
					</div>
				</div>
			))}
		</div>
	);
}

function SparklineSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
			{SPARKLINE_SKELETON_IDS.map((id) => (
				<Skeleton key={id} className="h-[140px]" />
			))}
		</div>
	);
}

function QuickNavSection() {
	return (
		<section>
			<h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
				Navegación Rápida
			</h2>
			<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
				{QUICK_NAV_ITEMS.map((item) => (
					<Link key={item.href} href={item.href} className="block">
						<div className="flex h-full items-center gap-2.5 border border-border p-2.5 transition-colors hover:border-primary/50 hover:bg-primary/5">
							<item.icon className="size-3.5 shrink-0 text-muted-foreground" />
							<span className="font-mono text-xs leading-snug">
								{item.title}
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}

async function OverviewContent() {
	const data = await getOverviewData();

	return (
		<div className="space-y-6">
			<section>
				<h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
					Indicadores Principales
				</h2>
				<KPICards groups={data.kpiGroups} />
			</section>

			<section>
				<h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
					Tendencias Recientes
				</h2>
				<OverviewSparklines
					sparklines={data.sparklines}
					sparklineOrder={data.sparklineOrder}
				/>
			</section>
		</div>
	);
}

export default function OverviewPage() {
	return (
		<>
			<PageHeader
				title="Resumen"
				description="Indicadores económicos de México — Banco de México"
			/>
			<div className="space-y-6 p-4 md:p-6">
				<Suspense
					fallback={
						<div className="space-y-6">
							<section>
								<h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
									Indicadores Principales
								</h2>
								<KPISkeleton />
							</section>
							<section>
								<h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
									Tendencias Recientes
								</h2>
								<SparklineSkeleton />
							</section>
						</div>
					}
				>
					<OverviewContent />
				</Suspense>
				<QuickNavSection />
			</div>
		</>
	);
}
