import tokens from "@brand/tokens.json";

type Scale = Record<string, string>;
const palette = tokens.color as unknown as Record<string, string | Scale>;

const REF = /^\{([\w-]+(?:\.[\w-]+)?)\}(?:\/(\d{1,3}))?$/;

export const SCALE_NAMES = ["violet", "spark", "iris", "azure", "ink"] as const;

export const SEMANTIC_TOKENS: { path: string; label: string }[] = [
  { path: "primary", label: "Primária" },
  { path: "primary-strong", label: "Primária forte" },
  { path: "primary-soft", label: "Primária suave" },
  { path: "secondary", label: "Secundária" },
  { path: "secondary-strong", label: "Secundária forte" },
  { path: "foreground", label: "Texto" },
  { path: "foreground-body", label: "Texto corpo" },
  { path: "foreground-subtle", label: "Texto sutil" },
  { path: "background", label: "Fundo" },
  { path: "card", label: "Cartão" },
  { path: "surface", label: "Superfície" },
  { path: "tile", label: "Tile" },
  { path: "tint", label: "Tinta" },
  { path: "border", label: "Borda" },
  { path: "white", label: "Branco" },
  { path: "scrim", label: "Véu" },
];

export function tokenValue(path: string, depth = 0): string | undefined {
  if (depth > 6) return;
  const [head, step] = path.split(".");
  const entry = palette[head];
  const raw = step ? (typeof entry === "object" ? entry[step] : undefined) : typeof entry === "string" ? entry : undefined;
  if (!raw) return;
  const inner = /^\{([\w-]+(?:\.[\w-]+)?)\}$/.exec(raw);
  return inner ? tokenValue(inner[1], depth + 1) : raw;
}

export function tokenRef(value: string | undefined): { path: string; alpha: number } | undefined {
  const m = value ? REF.exec(value.trim()) : null;
  if (!m || !tokenValue(m[1])) return;
  return { path: m[1], alpha: m[2] ? Math.min(100, Number(m[2])) / 100 : 1 };
}

export function makeRef(path: string, alpha = 1): string {
  return alpha >= 1 ? `{${path}}` : `{${path}}/${Math.round(alpha * 100)}`;
}

const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, "0").toUpperCase();

export function cssColor<T extends string | undefined>(value: T): T {
  const ref = tokenRef(value);
  if (!ref) return value;
  const hex = tokenValue(ref.path)!;
  if (ref.alpha >= 1 || !/^#[0-9a-f]{6}$/i.test(hex)) return hex as T;
  return `${hex}${hex2(ref.alpha * 255)}` as T;
}

export function tokenName(path: string): string {
  const semantic = SEMANTIC_TOKENS.find((t) => t.path === path);
  return semantic ? semantic.label : path.replace(".", " ");
}

export function tokenVar(path: string): string {
  return `--vm-${path.replace(".", "-")}`;
}
