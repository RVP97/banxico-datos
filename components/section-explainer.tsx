"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SectionExplainerProps {
  title?: string;
  children: React.ReactNode;
}

export function SectionExplainer({
  title = "Cómo interpretar",
  children,
}: SectionExplainerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border bg-card/50">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-1.5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary md:px-6"
      >
        <ChevronRight
          className={cn(
            "size-3 shrink-0 transition-transform duration-150",
            open && "rotate-90",
          )}
          aria-hidden
        />
        <span>{title}</span>
      </button>
      {open && (
        <div className="border-t border-border/50 px-4 py-3 md:px-6">
          <div className="max-w-4xl space-y-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
