"use client";

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
  ScrollText,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const overviewNav = [{ title: "Resumen", href: "/", icon: Home }];

const mercadosNav = [
  { title: "Tipo de Cambio", href: "/tipo-cambio", icon: CircleDollarSign },
  { title: "Tasas de Interés", href: "/tasas", icon: TrendingUp },
  { title: "Mercado de Dinero", href: "/mercado-dinero", icon: Percent },
];

const economiaNav = [
  { title: "Inflación", href: "/inflacion", icon: BarChart3 },
  { title: "Actividad Económica", href: "/actividad", icon: Factory },
  { title: "Mercado Laboral", href: "/empleo", icon: Users },
  { title: "Comercio Exterior", href: "/comercio", icon: ArrowLeftRight },
  { title: "Remesas", href: "/remesas", icon: Banknote },
  { title: "Expectativas", href: "/expectativas", icon: LineChart },
];

const banxicoNav = [
  { title: "Reservas", href: "/reservas", icon: Building2 },
  { title: "UDIS", href: "/udis", icon: Coins },
  { title: "Banco Central", href: "/banco-central", icon: Landmark },
  { title: "Agregados Monetarios", href: "/monetario", icon: Wallet },
  {
    title: "Finanzas Públicas",
    href: "/finanzas-publicas",
    icon: Briefcase,
  },
  { title: "Balanza de Pagos", href: "/balanza-pagos", icon: Globe },
];

const navGroups = [
  { label: null, items: overviewNav },
  { label: "Mercados", items: mercadosNav },
  { label: "Economía", items: economiaNav },
  { label: "Banxico y Gobierno", items: banxicoNav },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <ScrollText className="size-4 text-primary" />
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest">
              Banxico Datos
            </p>
            <p className="font-mono text-[10px] text-sidebar-foreground/50">
              Terminal Financiero
            </p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label ?? "overview"} className="py-1">
            {group.label && (
              <SidebarGroupLabel className="px-4 font-mono text-[10px] uppercase tracking-widest text-primary/70">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={isActive}
                        className={cn(
                          "h-7 font-mono text-xs",
                          isActive &&
                            "border-l-2 border-primary bg-primary/10 text-primary",
                        )}
                      >
                        <item.icon className="size-3.5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
