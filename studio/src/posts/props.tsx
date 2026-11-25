import * as React from "react";
import { CaretDown, Minus, Plus } from "@phosphor-icons/react";
import { cn } from "@/ui/lib/utils";
import { ColorInput } from "./color";

const fg = (pct: number) => `color-mix(in oklab, var(--foreground) ${pct}%, transparent)`;
const surface =
  "border border-[color:color-mix(in_oklab,var(--border)_12%,transparent)] bg-[color:color-mix(in_oklab,var(--input)_5%,transparent)] hover:border-[color:color-mix(in_oklab,var(--border)_20%,transparent)] focus-within:border-[color:color-mix(in_oklab,var(--border)_30%,transparent)]";

export function Section({
  title,
  action,
  children,
  muted,
}: {
  title: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <section className="flex flex-col gap-2 border-t border-[color:color-mix(in_oklab,var(--border)_8%,transparent)] px-3 py-3 first:border-t-0">
      <header className="flex h-5 items-center justify-between">
        <h3 className="text-[11.5px] font-semibold tracking-[0.01em]" style={{ color: muted ? fg(55) : fg(92) }}>
          {title}
        </h3>
        {action}
      </header>
      {children}
    </section>
  );
}

export function IconButton({
  label,
  active,
  onClick,
  children,
  className,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md outline-none transition-colors duration-100 [&_svg]:size-4",
        "hover:bg-[color:color-mix(in_oklab,var(--foreground)_8%,transparent)] focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
        active ? "bg-[color:color-mix(in_oklab,var(--primary)_30%,transparent)] text-[color:var(--foreground)]" : "text-[color:color-mix(in_oklab,var(--foreground)_65%,transparent)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export const AddButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <IconButton label={label} onClick={onClick} className="size-6">
    <Plus />
  </IconButton>
);

export const RemoveButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <IconButton label={label} onClick={onClick} className="size-6">
    <Minus />
  </IconButton>
);

export function IconGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T | undefined;
  options: { value: T; label: string; icon: React.ReactNode }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className={cn("flex h-7 items-center gap-px rounded-lg p-px", surface)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          title={o.label}
          aria-label={o.label}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex h-full flex-1 cursor-pointer items-center justify-center rounded-md outline-none transition-colors duration-100 [&_svg]:size-3.5",
            "focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
            value === o.value
              ? "bg-[color:color-mix(in_oklab,var(--foreground)_12%,transparent)] text-[color:var(--foreground)]"
              : "text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)] hover:text-[color:var(--foreground)]",
          )}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}

export function MiniSelect<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <label className={cn("relative flex h-7 min-w-0 items-center rounded-lg text-xs", surface, className)}>
      <select
        aria-label={label}
        title={label}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-full w-full min-w-0 cursor-pointer appearance-none truncate bg-transparent pr-6 pl-2 text-[color:var(--foreground)] outline-none [&>option]:bg-[color:var(--background)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <CaretDown className="pointer-events-none absolute right-2 size-3 opacity-60" />
    </label>
  );
}

export function TextField({ value, onCommit, label, mono, placeholder }: { value: string; onCommit: (v: string) => void; label: string; mono?: boolean; placeholder?: string }) {
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => setDraft(value), [value]);
  return (
    <input
      aria-label={label}
      title={label}
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => draft !== value && onCommit(draft)}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          setDraft(value);
          e.currentTarget.blur();
        }
      }}
      className={cn("h-7 w-full min-w-0 rounded-lg px-2 text-xs text-[color:var(--foreground)] outline-none", surface, mono && "font-mono")}
    />
  );
}


export function ColorField({ value, onChange, label = "Cor" }: { value: string; onChange: (color: string) => void; label?: string }) {
  return <ColorInput value={value} onChange={onChange} label={label} />;
}

export function Row({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 }) {
  return <div className={cn("grid gap-1.5", cols === 2 ? "grid-cols-2" : "grid-cols-3")}>{children}</div>;
}

export function EffectRow({
  icon,
  label,
  hidden,
  onToggle,
  onRemove,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  hidden?: boolean;
  onToggle?: () => void;
  onRemove: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", hidden && "opacity-50")}>
      <div className="flex h-6 items-center gap-2 text-xs">
        <span className="flex size-4 items-center justify-center opacity-70 [&_svg]:size-3.5">{icon}</span>
        <span className="flex-1">{label}</span>
        {onToggle ? (
          <button type="button" onClick={onToggle} className="cursor-pointer text-[10.5px] opacity-60 hover:opacity-100">
            {hidden ? "mostrar" : "ocultar"}
          </button>
        ) : null}
        <RemoveButton label={`Remover ${label.toLowerCase()}`} onClick={onRemove} />
      </div>
      {children}
    </div>
  );
}
