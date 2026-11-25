import type * as React from "react";
import { PanelSurface } from "@/ui";
import { cn } from "@/ui/lib/utils";
import { logos } from "@/brand";

export type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  ready?: boolean;
};

export type NavGroup = { label: string; items: NavItem[] };

export function NavPanel({
  groups,
  current,
  onSelect,
}: {
  groups: NavGroup[];
  current: string;
  onSelect: (id: string) => void;
}) {
  return (
    <PanelSurface
      className="pointer-events-auto flex w-[220px] flex-col overflow-hidden rounded-lg"
      data-panel-id="nav"
    >
      <div className="flex h-11 items-center gap-2 px-3">
        <img src={logos.lockupWhite} alt="Viva Mais" className="h-5 w-auto" />
        <span className="ml-auto rounded-sm bg-[color:color-mix(in_oklab,var(--primary)_22%,transparent)] px-1.5 py-px font-mono text-[10px] tracking-wide text-[color:var(--accent)] uppercase">
          Studio
        </span>
      </div>
      <nav className="flex flex-col gap-3 border-t border-[color:color-mix(in_oklab,var(--border)_8%,transparent)] px-1.5 pt-2 pb-2.5">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-px">
            <div className="px-1.5 pb-1 text-[11px] font-medium text-[color:color-mix(in_oklab,var(--foreground)_45%,transparent)]">
              {group.label}
            </div>
            {group.items.map((item) => {
              const active = item.id === current;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item.id)}
                  data-active={active || undefined}
                  className={cn(
                    "flex h-7 items-center gap-2 rounded-md px-1.5 text-left text-[13px] leading-[18px] font-medium tracking-[-0.01em] outline-none",
                    "text-[color:color-mix(in_oklab,var(--foreground)_75%,transparent)] transition-colors duration-100",
                    "hover:bg-[color:color-mix(in_oklab,var(--foreground)_6%,transparent)] hover:text-[color:var(--foreground)]",
                    "focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
                    active &&
                      "bg-[color:color-mix(in_oklab,var(--foreground)_9%,transparent)] text-[color:var(--foreground)]",
                  )}
                >
                  <span className="flex size-4 items-center justify-center text-[15px] [&_svg]:size-4">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                  {item.ready ? null : (
                    <span className="ml-auto text-[10px] text-[color:color-mix(in_oklab,var(--foreground)_35%,transparent)]">
                      em breve
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
    </PanelSurface>
  );
}
