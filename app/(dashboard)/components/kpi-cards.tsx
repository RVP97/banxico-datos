"use client";

import { SeriesCard } from "@/components/series-card";
import { formatDisplayDate, formatNumber } from "@/lib/constants";
import type { KPIGroupData } from "../types/overview";

interface KPICardsProps {
	groups: KPIGroupData[];
}

export function KPICards({ groups }: KPICardsProps) {
	return (
		<div className="space-y-6">
			{groups.map((group) => (
				<div key={group.title}>
					<h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-primary">
						{group.title}
					</h3>
					<div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">
						{group.kpis.map((kpi) => {
							const change =
								kpi.previousValue != null && kpi.previousValue !== 0
									? ((kpi.value - kpi.previousValue) / kpi.previousValue) * 100
									: null;

							return (
								<SeriesCard
									key={kpi.seriesId}
									title={kpi.shortLabel}
									value={formatNumber(kpi.value, kpi.unit === "%" ? 2 : 4)}
									unit={kpi.unit}
									change={change}
									date={formatDisplayDate(kpi.date)}
								/>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
