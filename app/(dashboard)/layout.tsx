import { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { MarketTicker, MarketTickerSkeleton } from "@/components/market-ticker";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<div className="flex min-h-0 min-w-0 flex-1 flex-col">
					<Suspense fallback={<MarketTickerSkeleton />}>
						<MarketTicker />
					</Suspense>
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
