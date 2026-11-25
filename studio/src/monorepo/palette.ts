import tokens from "@monorepo/theme/tokens.json";

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

export function resolveRef(ref: string): string {
  if (ref.startsWith("#")) return ref;
  const value = ref
    .split(".")
    .reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], tokens.color);
  if (typeof value !== "string") throw new Error(`Unknown color ref "${ref}"`);
  return value;
}

function hexToRgbTriplet(hex: string): string {
  const v = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(v.substring(i, i + 2), 16)).join(" ");
}

const resolveTheme = (refs: Record<string, string>) =>
  Object.fromEntries(Object.entries(refs).map(([role, ref]) => [role, resolveRef(ref)]));

export const themes = Object.fromEntries(
  Object.entries(tokens.theme as Record<string, Record<string, string>>).map(([name, refs]) => [
    name,
    resolveTheme(refs),
  ]),
) as Record<"light" | "dark", Record<string, string>>;

export const roleVar = (role: string) => `--color-${kebab(role)}`;

export const themeVars = (theme: Record<string, string>) =>
  Object.fromEntries(Object.entries(theme).map(([role, hex]) => [roleVar(role), hexToRgbTriplet(hex)]));

export const roles = Object.keys(tokens.theme.light);

export default { themes, roles, roleVar, themeVars };
