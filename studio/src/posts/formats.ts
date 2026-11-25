import type { Kind } from "./model";

export type Safe = { top: number; right: number; bottom: number; left: number };

export type Format = {
  id: string;
  kind: Kind;
  label: string;
  width: number;
  height: number;
  frames: number;
  slices?: boolean;
  safe?: Safe;
  circle?: number;
  note: string;
};

export const FORMATS: Format[] = [
  { id: "feed", kind: "post", label: "Feed 4:5", width: 1080, height: 1350, frames: 1, note: "Post no feed do Instagram" },
  {
    id: "story",
    kind: "post",
    label: "Story 9:16",
    width: 1080,
    height: 1920,
    frames: 1,
    safe: { top: 250, right: 64, bottom: 340, left: 64 },
    note: "Stories e Reels; topo e base ficam sob a interface",
  },
  { id: "square", kind: "post", label: "Quadrado 1:1", width: 1080, height: 1080, frames: 1, note: "Feed, LinkedIn, WhatsApp" },
  { id: "carousel", kind: "sequence", label: "Carrossel 4:5", width: 1080, height: 1350, frames: 5, note: "Telas 4:5 independentes, uma imagem por tela" },
  {
    id: "panorama",
    kind: "sequence",
    label: "Panorâmico",
    width: 5400,
    height: 1350,
    frames: 1,
    slices: true,
    note: "Uma arte contínua, fatiada em telas 1080×1350 no export",
  },
  { id: "highlight", kind: "cover", label: "Destaques IG", width: 1080, height: 1920, frames: 8, circle: 1080, note: "Story com recorte circular no centro" },
  { id: "linkedin", kind: "cover", label: "Banner LinkedIn", width: 1584, height: 396, frames: 1, note: "Capa de perfil e página" },
  { id: "x", kind: "cover", label: "Banner X", width: 1500, height: 500, frames: 1, note: "Capa de perfil no X" },
];

export const FORMAT_BY_ID = Object.fromEntries(FORMATS.map((f) => [f.id, f])) as Record<string, Format>;

export const KIND_LABEL: Record<Kind, string> = { post: "Posts", sequence: "Sequências", cover: "Capas" };

export function frameSize(format: Format, base: { width: number; height: number }) {
  if (format.slices) return { width: base.width, height: format.height };
  return { width: format.width, height: format.height };
}

export function sliceCount(format: Format, width: number) {
  return format.slices ? Math.max(1, Math.round(width / 1080)) : 1;
}
