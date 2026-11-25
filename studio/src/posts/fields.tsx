import * as React from "react";
import { ControlFieldLabel, Field, Textarea } from "@/ui";
import { cn } from "@/ui/lib/utils";

export function TextAreaField({ name, value, onValueChange }: { name: string; value: string; onValueChange: (value: string) => void }) {
  const id = React.useId();
  return (
    <Field className="min-w-0 gap-2">
      <ControlFieldLabel htmlFor={id}>{name}</ControlFieldLabel>
      <Textarea id={id} rows={Math.min(5, value.split("\n").length + (value.length > 34 ? 1 : 0))} value={value} onChange={(e) => onValueChange(e.target.value)} />
    </Field>
  );
}

const decimals = (step: number) => String(step).split(".")[1]?.length ?? 0;

export function NumberField({
  name,
  value,
  min,
  max,
  step = 1,
  unit = "",
  fill = true,
  placeholder,
  label,
  onValueChange,
}: {
  name: string;
  label?: React.ReactNode;
  value: number | undefined;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  fill?: boolean;
  placeholder?: string;
  onValueChange: (value: number) => void;
}) {
  const [draft, setDraft] = React.useState<string | null>(null);
  const [scrubbing, setScrubbing] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);
  const scrub = React.useRef<{ x: number; v: number; moved: boolean; id: number } | null>(null);
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const round = (v: number) => Number((Math.round(v / step) * step).toFixed(decimals(step)));
  const set = (v: number) => onValueChange(round(clamp(v)));
  const shown = value === undefined ? "" : `${Number(value.toFixed(decimals(step)))}${unit}`;
  const ratio = value === undefined ? 0 : (clamp(value) - min) / (max - min || 1);
  const pxPerStep = Math.max(1, 240 / ((max - min) / step));

  React.useEffect(() => {
    if (draft !== null) input.current?.select();
  }, [draft !== null]);

  function commit() {
    if (draft === null) return;
    const n = Number.parseFloat(draft.replace(",", "."));
    setDraft(null);
    if (Number.isFinite(n)) set(n);
  }

  if (draft !== null)
    return (
      <label className="relative flex h-7 min-w-0 items-center gap-2 rounded-lg border border-[color:color-mix(in_oklab,var(--border)_30%,transparent)] bg-[color:color-mix(in_oklab,var(--input)_5%,transparent)] px-2 text-xs">
        <span className="flex shrink-0 items-center text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)] [&_svg]:size-3.5">{label ?? name}</span>
        <input
          ref={input}
          className="min-w-0 flex-1 bg-transparent text-right font-mono tabular-nums outline-none"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setDraft(null);
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
              const n = Number.parseFloat(draft) || value || 0;
              const next = round(clamp(n + (e.key === "ArrowUp" ? 1 : -1) * step * (e.shiftKey ? 10 : 1)));
              setDraft(String(next));
              onValueChange(next);
            }
          }}
        />
        {unit ? <span className="shrink-0 font-mono text-[color:color-mix(in_oklab,var(--foreground)_45%,transparent)]">{unit}</span> : null}
      </label>
    );

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={name}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      title={`${name} · arraste pra ajustar, clique pra digitar`}
      className={cn(
        "relative flex h-7 min-w-0 cursor-ew-resize items-center gap-2 overflow-hidden rounded-lg border px-2 text-xs outline-none select-none",
        "border-[color:color-mix(in_oklab,var(--border)_12%,transparent)] bg-[color:color-mix(in_oklab,var(--input)_5%,transparent)]",
        "hover:border-[color:color-mix(in_oklab,var(--border)_20%,transparent)] focus-visible:border-[color:color-mix(in_oklab,var(--border)_30%,transparent)]",
        scrubbing && "border-[color:color-mix(in_oklab,var(--border)_30%,transparent)]",
      )}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        scrub.current = { x: e.clientX, v: value ?? 0, moved: false, id: e.pointerId };
      }}
      onPointerMove={(e) => {
        const s = scrub.current;
        if (!s) return;
        const dx = e.clientX - s.x;
        if (!s.moved && Math.abs(dx) < 3) return;
        if (!s.moved) {
          s.moved = true;
          setScrubbing(true);
        }
        set(s.v + Math.round(dx / pxPerStep) * step * (e.shiftKey ? 10 : 1) * (e.altKey ? 0.1 : 1));
      }}
      onPointerUp={() => {
        const s = scrub.current;
        scrub.current = null;
        setScrubbing(false);
        if (s && !s.moved) setDraft(value === undefined ? "" : String(Number(value.toFixed(decimals(step)))));
      }}
      onLostPointerCapture={() => {
        scrub.current = null;
        setScrubbing(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          setDraft(String(value ?? ""));
          return;
        }
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
        e.preventDefault();
        e.stopPropagation();
        const dir = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : -1;
        set((value ?? 0) + dir * step * (e.shiftKey ? 10 : 1));
      }}
    >
      {fill ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 bg-[color:color-mix(in_oklab,var(--foreground)_10%,transparent)] transition-[width] duration-75"
          style={{ width: `${ratio * 100}%` }}
        />
      ) : null}
      <span className="relative flex shrink-0 items-center text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)] [&_svg]:size-3.5">{label ?? name}</span>
      <span className="relative ml-auto truncate font-mono tabular-nums">{shown || <span className="text-[color:color-mix(in_oklab,var(--foreground)_40%,transparent)]">{placeholder ?? "auto"}</span>}</span>
    </div>
  );
}
