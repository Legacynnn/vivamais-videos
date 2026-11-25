import tokens from "@brand/tokens.json";
import lockupWhite from "@brand/logos/lockup-branco.svg?url";
import lockupColor from "@brand/logos/lockup-cor.svg?url";
import lockupViolet from "@brand/logos/lockup-violeta.svg?url";
import symbolColor from "@brand/logos/simbolo-cor.svg?url";
import symbolWhite from "@brand/logos/simbolo-branco.svg?url";
import symbolViolet from "@brand/logos/simbolo-violeta.svg?url";
import wordmarkWhite from "@brand/logos/assinatura-branco.svg?url";
import wordmarkPurple from "@brand/logos/assinatura-roxo.svg?url";
import wordmarkViolet from "@brand/logos/assinatura-violeta.svg?url";
import appIcon from "@brand/logos/icone-menta.svg?url";

type Scale = Record<string, string>;

const color = tokens.color as unknown as Record<string, string | Scale>;

export function resolveColor(ref: string): string {
  const match = /^\{(\w+)\.(\w+)\}$/.exec(ref);
  if (!match) return ref;
  const scale = color[match[1]];
  return typeof scale === "object" ? (scale[match[2]] ?? ref) : ref;
}

export const scales = {
  violet: color.violet as Scale,
  spark: color.spark as Scale,
  iris: color.iris as Scale,
  azure: color.azure as Scale,
  ink: color.ink as Scale,
};

export const gradients = tokens.gradient as Record<string, string>;
export const fonts = tokens.font as { display: string; text: string };
export const radii = tokens.radius as Record<string, string>;

export const logos = {
  lockupWhite,
  lockupColor,
  lockupViolet,
  symbolColor,
  symbolWhite,
  symbolViolet,
  wordmarkWhite,
  wordmarkPurple,
  wordmarkViolet,
  appIcon,
};
