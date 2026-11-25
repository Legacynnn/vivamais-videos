import * as React from "react";
import { createPortal } from "react-dom";
import { CaretLeft, CaretRight, MagnifyingGlass, SquaresFour, X } from "@phosphor-icons/react";
import { cn } from "@/ui/lib/utils";
import { journeyOf, screenFlow, screenJourneys, screenState, screens, stateLabel, type LibraryItem, type ScreenFlow } from "./library";

const ASPECT = "402 / 874";
const muted = "text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)]";
const hover = "hover:bg-[color:color-mix(in_oklab,var(--foreground)_7%,transparent)]";

function Thumb({ item, active, onPick, size = "md", label }: { item: LibraryItem; active: boolean; onPick: () => void; size?: "sm" | "md"; label?: string }) {
  return (
    <button
      type="button"
      title={label ?? stateLabel(screenState(item.value))}
      onClick={onPick}
      className={cn("group flex min-w-0 shrink-0 cursor-pointer flex-col gap-1.5 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]", size === "sm" && "w-11")}
    >
      <span
        className={cn(
          "block w-full overflow-hidden bg-[color:color-mix(in_oklab,var(--foreground)_6%,transparent)] transition-[box-shadow,transform] duration-150",
          size === "sm" ? "rounded-[6px]" : "rounded-[10px] group-hover:-translate-y-0.5",
          active
            ? "shadow-[0_0_0_2px_var(--accent)]"
            : "shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_10%,transparent)] group-hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_30%,transparent),0_12px_24px_-12px_rgb(0_0_0/0.6)]",
        )}
        style={{ aspectRatio: ASPECT }}
      >
        <img src={item.src} alt="" loading="lazy" draggable={false} className="size-full object-cover object-top" />
      </span>
      {size === "md" ? <span className={cn("truncate px-0.5 text-[11.5px]", active ? "text-[color:var(--foreground)]" : muted)}>{label ?? stateLabel(screenState(item.value))}</span> : null}
    </button>
  );
}

function Browser({ value, onChange, onClose, anchor }: { value: string; onChange: (v: string) => void; onClose: () => void; anchor: DOMRect }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState("");
  const [flowId, setFlowId] = React.useState(() => screenFlow(value)?.id ?? screenJourneys[0]?.flows[0]?.id);
  const flows = screenJourneys.flatMap((j) => j.flows);
  const flow = flows.find((f) => f.id === flowId);
  const q = query.trim().toLowerCase();
  const matches = q
    ? flows.flatMap((f) =>
        f.states
          .filter((s) => `${journeyOf(f.id)} ${f.title} ${stateLabel(screenState(s.value))} ${s.value}`.toLowerCase().includes(q))
          .map((s) => ({ item: s, label: `${f.title} · ${stateLabel(screenState(s.value))}` })),
      )
    : [];

  React.useEffect(() => {
    const down = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("pointerdown", down, true);
    window.addEventListener("keydown", key, true);
    return () => {
      window.removeEventListener("pointerdown", down, true);
      window.removeEventListener("keydown", key, true);
    };
  }, [onClose]);

  const width = Math.min(760, anchor.left - 24);
  const left = Math.max(12, anchor.left - width - 10);

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label="Escolher tela do app"
      className="fixed top-2.5 bottom-2.5 z-[1000] flex flex-col overflow-hidden rounded-xl border border-[color:color-mix(in_oklab,var(--border)_14%,transparent)] bg-[color:var(--popover,var(--background))] text-[color:var(--foreground)] shadow-[0_24px_80px_-16px_rgb(0_0_0/0.7)]"
      style={{ left, width }}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <header className="flex items-center gap-2 border-b border-[color:color-mix(in_oklab,var(--border)_10%,transparent)] px-3 py-2.5">
        <MagnifyingGlass className={cn("size-4 shrink-0", muted)} />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar tela, fluxo ou estado…"
          className="h-7 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[color:color-mix(in_oklab,var(--foreground)_40%,transparent)]"
        />
        <span className={cn("font-mono text-[10.5px]", muted)}>{screens.length} telas do app</span>
        <button type="button" aria-label="Fechar" onClick={onClose} className={cn("flex size-7 cursor-pointer items-center justify-center rounded-md", hover, muted)}>
          <X className="size-4" />
        </button>
      </header>
      <div className="flex min-h-0 flex-1">
        <nav className="flex w-[210px] shrink-0 flex-col gap-3 overflow-y-auto border-r border-[color:color-mix(in_oklab,var(--border)_10%,transparent)] px-2 py-3">
          {screenJourneys.map((j) => (
            <div key={j.label} className="flex flex-col gap-px">
              <span className={cn("px-2 pb-1 text-[10.5px] font-medium tracking-[0.04em] uppercase", muted)}>{j.label}</span>
              {j.flows.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setFlowId(f.id);
                    setQuery("");
                  }}
                  className={cn(
                    "flex h-7 cursor-pointer items-center gap-2 rounded-md px-2 text-left text-[12.5px] outline-none",
                    !q && f.id === flowId ? "bg-[color:color-mix(in_oklab,var(--primary)_28%,transparent)] text-[color:var(--foreground)]" : cn(hover, "text-[color:color-mix(in_oklab,var(--foreground)_80%,transparent)]"),
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{f.title}</span>
                  {f.id === screenFlow(value)?.id ? <span className="size-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" title="Tela atual" /> : null}
                  <span className={cn("font-mono text-[10.5px]", muted)}>{f.states.length}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <section className="flex min-w-0 flex-1 flex-col overflow-y-auto p-4">
          {q ? (
            <>
              <h3 className="pb-3 text-[12px] font-semibold">
                {matches.length} {matches.length === 1 ? "resultado" : "resultados"} para “{query.trim()}”
              </h3>
              {matches.length ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-x-3 gap-y-4">
                  {matches.map(({ item, label }) => (
                    <Thumb key={item.value} item={item} label={label} active={item.value === value} onPick={() => onChange(item.value)} />
                  ))}
                </div>
              ) : (
                <p className={cn("text-[12px]", muted)}>Nenhuma tela encontrada. Tente o nome do fluxo, como “plantão” ou “busca”.</p>
              )}
            </>
          ) : flow ? (
            <>
              <div className="flex items-baseline gap-2 pb-3">
                <h3 className="text-[13px] font-semibold">{flow.title}</h3>
                <span className={cn("text-[11.5px]", muted)}>
                  {journeyOf(flow.id)} · {flow.states.length} {flow.states.length === 1 ? "estado" : "estados"}
                </span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-x-3 gap-y-4">
                {flow.states.map((s) => (
                  <Thumb key={s.value} item={s} active={s.value === value} onPick={() => onChange(s.value)} />
                ))}
              </div>
            </>
          ) : null}
        </section>
      </div>
      <footer className={cn("border-t border-[color:color-mix(in_oklab,var(--border)_10%,transparent)] px-3 py-2 text-[11px]", muted)}>
        Clique aplica na hora. Esc fecha. As telas vêm do app real (screens/dist).
      </footer>
    </div>,
    document.body,
  );
}

export function ScreenPicker({ name, value, onChange }: { name: string; value: string; onChange: (screen: string) => void }) {
  const [anchor, setAnchor] = React.useState<DOMRect | null>(null);
  const box = React.useRef<HTMLDivElement>(null);
  const close = React.useCallback(() => setAnchor(null), []);
  const current = screens.find((s) => s.value === value);
  const flow: ScreenFlow | undefined = screenFlow(value);
  const index = flow ? flow.states.findIndex((s) => s.value === value) : -1;
  const step = (d: number) => {
    if (!flow || flow.states.length < 2) return;
    onChange(flow.states[(index + d + flow.states.length) % flow.states.length].value);
  };
  const open = () => {
    const panel = box.current?.closest("[data-workspace-overlay]") ?? box.current;
    if (panel) setAnchor(panel.getBoundingClientRect());
  };

  return (
    <div ref={box} className="flex min-w-0 flex-col gap-2">
      <span className="text-[12px] text-[color:color-mix(in_oklab,var(--foreground)_70%,transparent)]">{name}</span>
      <div className="flex gap-3">
        <button type="button" onClick={open} title="Trocar tela" className="w-[72px] shrink-0 cursor-pointer outline-none">
          <span className="block overflow-hidden rounded-[10px] bg-[color:color-mix(in_oklab,var(--foreground)_6%,transparent)] shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_12%,transparent)]" style={{ aspectRatio: ASPECT }}>
            {current ? <img src={current.src} alt="" draggable={false} className="size-full object-cover object-top" /> : null}
          </span>
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-1 py-0.5">
          <span className={cn("truncate text-[10.5px] tracking-[0.04em] uppercase", muted)}>{flow ? journeyOf(flow.id) : "Sem tela"}</span>
          <span className="truncate text-[13px] font-medium">{flow?.title ?? (value || "Nenhuma")}</span>
          <span className={cn("truncate text-[12px]", muted)}>
            {current ? stateLabel(screenState(current.value)) : ""}
            {flow && flow.states.length > 1 ? ` · ${index + 1} de ${flow.states.length}` : ""}
          </span>
          <div className="mt-auto flex items-center gap-1">
            {flow && flow.states.length > 1 ? (
              <>
                <button type="button" aria-label="Estado anterior" onClick={() => step(-1)} className={cn("flex size-7 cursor-pointer items-center justify-center rounded-md", hover)}>
                  <CaretLeft className="size-3.5" />
                </button>
                <button type="button" aria-label="Próximo estado" onClick={() => step(1)} className={cn("flex size-7 cursor-pointer items-center justify-center rounded-md", hover)}>
                  <CaretRight className="size-3.5" />
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={open}
              className={cn(
                "ml-auto flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-2 text-[12px] whitespace-nowrap",
                "border-[color:color-mix(in_oklab,var(--border)_14%,transparent)] hover:border-[color:color-mix(in_oklab,var(--border)_30%,transparent)]",
              )}
            >
              <SquaresFour className="size-3.5" />
              Trocar
            </button>
          </div>
        </div>
      </div>
      {flow && flow.states.length > 1 ? (
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pt-0.5 pb-1">
          {flow.states.map((s) => (
            <Thumb key={s.value} item={s} size="sm" active={s.value === value} onPick={() => onChange(s.value)} />
          ))}
        </div>
      ) : null}
      {anchor ? <Browser value={value} anchor={anchor} onChange={onChange} onClose={close} /> : null}
    </div>
  );
}
