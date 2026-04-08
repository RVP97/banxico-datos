import { SidebarTrigger } from "@/components/ui/sidebar";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-baseline gap-3">
        <h1 className="font-mono text-sm uppercase tracking-wider">{title}</h1>
        {description && (
          <p className="hidden font-mono text-[10px] text-muted-foreground sm:block">
            {description}
          </p>
        )}
      </div>
    </header>
  );
}
