import type { Frame, Layer, PostDoc } from "./model";
import { uid, walk } from "./model";

export type Style = { id: string; note: string };

export const STYLES: Style[] = [
  { id: "Foto com UI", note: "Foto real com a tela do app na mão ou saindo do celular" },
  { id: "Foto editorial", note: "Foto, formas e tipografia, sem UI" },
  { id: "Mockup de celular", note: "Celular renderizado com telas reais do app" },
  { id: "Gráfico", note: "Fundo de cor, tipografia grande e cartões" },
  { id: "Conteúdo", note: "Informativo, listas e explicações" },
  { id: "Marca", note: "Capas, banners e destaques do perfil" },
];

export const TOPICS = ["Plantão", "Pergunte à Viva", "Médicos", "Documentos e receita", "Empresas", "Saúde", "Datas", "Institucional"];

export const FALLBACK_STYLE = "Sem estilo";

export const FORMAT_FILTERS = [
  { id: "all", label: "Todos" },
  { id: "post", label: "Posts" },
  { id: "carousel", label: "Carrossel" },
  { id: "panorama", label: "Panorâmico" },
  { id: "cover", label: "Capas" },
] as const;

export type FormatFilter = (typeof FORMAT_FILTERS)[number]["id"];

export function formatGroup(doc: PostDoc): FormatFilter {
  if (doc.kind === "cover") return "cover";
  if (doc.kind === "sequence") return doc.format === "panorama" ? "panorama" : "carousel";
  return "post";
}

export function styleOf(doc: PostDoc): string {
  return doc.style ?? FALLBACK_STYLE;
}

export function groupByStyle(docs: PostDoc[]): [string, PostDoc[]][] {
  const order = [...STYLES.map((s) => s.id), FALLBACK_STYLE];
  const map = new Map<string, PostDoc[]>();
  for (const d of docs) map.set(styleOf(d), [...(map.get(styleOf(d)) ?? []), d]);
  return [...map.entries()]
    .sort(([a], [b]) => (order.indexOf(a) + 99 * +(order.indexOf(a) < 0)) - (order.indexOf(b) + 99 * +(order.indexOf(b) < 0)))
    .map(([style, list]) => [style, [...list].sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { numeric: true }))]);
}

export function canJoin(doc: PostDoc): boolean {
  return doc.base.width === 1080 && doc.base.height === 1350 && (doc.kind === "post" || doc.format === "carousel");
}

function relink(frame: Frame): Frame {
  const ids = new Map<string, string>();
  const copy = structuredClone(frame);
  walk(copy.layers, (l) => {
    const next = uid();
    ids.set(l.id, next);
    l.id = next;
  });
  walk(copy.layers, (l: Layer) => {
    if (l.type === "screen") l.photo = ids.get(l.photo) ?? l.photo;
  });
  return { ...copy, id: uid("f") };
}

export function cloneFrame(frame: Frame, name?: string): Frame {
  return { ...relink(frame), name: name ?? frame.name };
}

export function joinDocs(docs: PostDoc[], id: string, name: string): PostDoc {
  const frames = docs.flatMap((d) => (d.kind === "post" ? d.frames.slice(0, 1).map((f) => cloneFrame(f, d.name.split(" · ").pop() ?? d.name)) : d.frames.map((f) => cloneFrame(f))));
  const styles = docs.map(styleOf);
  const style = styles.sort((a, b) => styles.filter((s) => s === b).length - styles.filter((s) => s === a).length)[0];
  return {
    id,
    name,
    kind: "sequence",
    format: "carousel",
    style,
    topics: [...new Set(docs.flatMap((d) => d.topics ?? []))],
    base: { width: 1080, height: 1350 },
    frames,
    source: docs.map((d) => d.id).join(", "),
    updatedAt: "",
  };
}
