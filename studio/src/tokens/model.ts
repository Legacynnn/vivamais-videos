import tokens from "@monorepo/theme/tokens.json";
import lock from "../../../monorepo.lock?raw";
import { resolveRef } from "@/monorepo/palette";

export const source = { ...(JSON.parse(lock) as { ref: string; sha: string; date: string }), file: "packages/theme/tokens.json" };

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

export type TokenRef = {
  id: string;
  name: string;
  value: string;
  path: string;
  cssVar?: string;
  web?: string;
  mobile?: string;
  note?: string;
};

export const SCALES = ["violet", "spark", "iris", "azure", "ink"] as const;
export type ScaleName = (typeof SCALES)[number];

const color = tokens.color as unknown as Record<string, Record<string, string> | string>;

export function scale(name: ScaleName): TokenRef[] {
  return Object.entries(color[name] as Record<string, string>).map(([step, hex]) => ({
    id: `color.${name}.${step}`,
    name: `${name}-${step}`,
    value: hex,
    path: `color.${name}.${step}`,
    cssVar: `--color-brand-${name}-${step}`,
    web: `bg-brand-${name}-${step}`,
    mobile: `bg-${name}-${step}`,
  }));
}

export const extraColors: TokenRef[] = ["canvas", "panel", "mist", "success", "warning", "danger", "info"].map((key) => ({
  id: `color.${key}`,
  name: key,
  value: color[key] as string,
  path: `color.${key}`,
}));

export const logoColors: TokenRef[] = Object.entries(color.logo as Record<string, string>).map(([key, hex]) => ({
  id: `color.logo.${key}`,
  name: `logo ${key}`,
  value: hex,
  path: `color.logo.${key}`,
  note: "Só para a marca (logo, gradiente do símbolo). Nunca recolorir o símbolo.",
}));

export type Role = { name: string; light: TokenRef; dark: TokenRef };

const theme = tokens.theme as Record<"light" | "dark", Record<string, string>>;

export const roles: Role[] = Object.keys(theme.light).map((role) => {
  const make = (mode: "light" | "dark"): TokenRef => ({
    id: `theme.${mode}.${role}`,
    name: kebab(role),
    value: resolveRef(theme[mode][role]),
    path: `theme.${mode}.${role} → ${theme[mode][role]}`,
    cssVar: `--${kebab(role)}`,
    web: `bg-${kebab(role)}`,
    mobile: `bg-${kebab(role)}`,
  });
  return { name: kebab(role), light: make("light"), dark: make("dark") };
});

type TypeStyle = { family?: string; size: number; lineHeight: number; letterSpacing: number };

export const mobileType = Object.entries(tokens.type as Record<string, TypeStyle>).map(([name, t]) => ({
  name,
  ...t,
  ref: {
    id: `type.${name}`,
    name,
    value: `${t.size}/${t.lineHeight} · ${t.family}`,
    path: `type.${name}`,
    mobile: `text-${name}`,
  } satisfies TokenRef,
}));

export const webType = Object.entries(tokens.webType as Record<string, TypeStyle>).map(([name, t]) => ({
  name,
  ...t,
  ref: {
    id: `webType.${name}`,
    name,
    value: `${t.size}/${t.lineHeight}px · ${t.letterSpacing}em`,
    path: `webType.${name}`,
    cssVar: `--text-${name}`,
    web: `text-${name}`,
  } satisfies TokenRef,
}));

export const brandType = Object.entries(
  tokens.brandType as Record<string, { min: number; max: number; lineHeight: number; letterSpacing: number }>,
).map(([name, t]) => ({
  name,
  ...t,
  ref: {
    id: `brandType.${name}`,
    name,
    value: `${t.min}→${t.max}px fluido · lh ${t.lineHeight}`,
    path: `brandType.${name}`,
    cssVar: `--text-${name}`,
    web: `text-${name}`,
  } satisfies TokenRef,
}));

export const radii: TokenRef[] = Object.entries(tokens.radius as Record<string, number>).map(([name, px]) => ({
  id: `radius.${name}`,
  name,
  value: px >= 9999 ? "9999px (pill)" : `${px}px`,
  path: `radius.${name}`,
  cssVar: `--radius-${name}`,
  web: `rounded-${name}`,
  mobile: `rounded-${name}`,
}));

export const spaces: TokenRef[] = Object.entries(tokens.space as Record<string, number>).map(([name, px]) => ({
  id: `space.${name}`,
  name,
  value: `${px}px`,
  path: `space.${name}`,
  mobile: `p-${name}`,
}));

type Shadow = { color: string; opacity: number; radius: number; offsetY: number; elevation: number };

export const shadows = Object.entries(tokens.shadow as Record<string, Shadow>).map(([name, s]) => ({
  name,
  css: `0 ${s.offsetY}px ${s.radius}px color-mix(in srgb, ${s.color} ${Math.round(s.opacity * 100)}%, transparent)`,
  ref: {
    id: `shadow.${name}`,
    name,
    value: `y ${s.offsetY} · blur ${s.radius} · ${s.color} ${Math.round(s.opacity * 100)}%`,
    path: `shadow.${name}`,
    cssVar: `--shadow-${kebab(name)}`,
    web: `shadow-${kebab(name)}`,
  } satisfies TokenRef,
}));

const motion = tokens.motion as unknown as {
  duration: Record<string, number>;
  easing: Record<string, [number, number, number, number]>;
  spring: Record<string, { damping: number; stiffness: number; mass: number }>;
  pressScale: number;
  stagger: number;
};

export const durations: TokenRef[] = Object.entries(motion.duration).map(([name, ms]) => ({
  id: `motion.duration.${name}`,
  name,
  value: `${ms}ms`,
  path: `motion.duration.${name}`,
  cssVar: `--duration-${name}`,
  web: `duration-(--duration-${name})`,
}));

export const easings = Object.entries(motion.easing).map(([name, curve]) => ({
  name,
  curve,
  ref: {
    id: `motion.easing.${name}`,
    name,
    value: `cubic-bezier(${curve.join(", ")})`,
    path: `motion.easing.${name}`,
    cssVar: `--ease-${kebab(name)}`,
    web: `ease-${kebab(name)}`,
  } satisfies TokenRef,
}));

export const springs: TokenRef[] = Object.entries(motion.spring).map(([name, s]) => ({
  id: `motion.spring.${name}`,
  name,
  value: `damping ${s.damping} · stiffness ${s.stiffness} · mass ${s.mass}`,
  path: `motion.spring.${name}`,
  note: "Mobile (Reanimated).",
}));

export const motionExtras: TokenRef[] = [
  { id: "motion.pressScale", name: "pressScale", value: String(motion.pressScale), path: "motion.pressScale" },
  { id: "motion.stagger", name: "stagger", value: `${motion.stagger}ms`, path: "motion.stagger" },
];

export const fontFamily = { display: '"Space Grotesk", sans-serif', body: '"DM Sans", sans-serif' };

export function familyFor(native?: string): string {
  return native?.startsWith("SpaceGrotesk") ? fontFamily.display : fontFamily.body;
}

export function weightFor(native?: string): number {
  if (!native) return 400;
  if (native.includes("700")) return 700;
  if (native.includes("500")) return 500;
  return 400;
}

export function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const v = hex.replace("#", "");
    const [r, g, bl] = [0, 2, 4].map((i) => {
      const c = parseInt(v.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
