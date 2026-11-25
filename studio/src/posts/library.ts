const assetFiles = import.meta.glob("../../../assets/{posts,people}/**/*.{jpg,jpeg,png,webp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const shotFiles = import.meta.glob("../../../screens/dist/shots/*.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const manifestFiles = import.meta.glob("../../../screens/dist/manifest.json", { eager: true, import: "default" }) as Record<
  string,
  Record<string, { title: string; states: string[] }>
>;

const ASSETS = Object.fromEntries(Object.entries(assetFiles).map(([key, url]) => [key.replace("../../../", ""), url]));

export function assetUrl(path: string): string {
  return ASSETS[path] ?? (path.startsWith("assets/") ? `/repo-${path}` : path);
}

export type LibraryItem = { value: string; label: string; src: string; group?: string };

function listAssets(prefix: string): LibraryItem[] {
  return Object.entries(ASSETS)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, src]) => ({ value: path, label: path.slice(prefix.length).replace(/\.\w+$/, ""), src }));
}

export const photos = [...listAssets("assets/posts/ui-photos/"), ...listAssets("assets/posts/photos/"), ...listAssets("assets/posts/paper/")].filter(
  (p) => !p.value.endsWith(".svg"),
);

export function photoChoices(src: string, choices?: string[]): LibraryItem[] {
  const pool = [...photos, ...people];
  if (choices?.length) return pool.filter((p) => choices.some((c) => p.value === c || (c.endsWith("/") && p.value.startsWith(c))));
  const folder = src.slice(0, src.lastIndexOf("/") + 1);
  const same = pool.filter((p) => p.value.startsWith(folder));
  return same.length > 1 ? same : pool;
}
export const people = listAssets("assets/people/");
export const highlightIcons = listAssets("assets/posts/highlights/");

const manifest = Object.values(manifestFiles)[0] ?? {};

export const screens: LibraryItem[] = Object.entries(shotFiles)
  .map(([key, src]) => {
    const value = key.split("/").pop()!.replace(/\.png$/, "");
    const [id, state] = value.split("--");
    const title = manifest[id]?.title ?? id;
    return { value, label: `${title} · ${state}`, src, group: id };
  })
  .filter((s) => !s.value.startsWith("kit-"))
  .sort((a, b) => a.label.localeCompare(b.label));

export function screenUrl(value: string): string | undefined {
  return screens.find((s) => s.value === value)?.src;
}

export const screenGroups: LibraryItem[] = Object.values(
  Object.fromEntries(screens.map((s) => [s.group!, { value: s.group!, label: manifest[s.group!]?.title ?? s.group!, src: s.src }])),
).sort((a, b) => a.label.localeCompare(b.label));

export function screenState(value: string): string {
  return value.split("--")[1] ?? value;
}

const JOURNEYS: { label: string; flows: string[] }[] = [
  { label: "Entrada", flows: ["account-type", "signin"] },
  { label: "Início", flows: ["client-home", "client-home-company", "client-home-specialties", "my-plan", "health-profile"] },
  {
    label: "Plantão 24h",
    flows: ["plantao-hub", "plantao-anamnese", "plantao-anamnese-steps", "plantao-checkout", "plantao-pay", "plantao-queue", "plantao-queue-countdown", "plantao-called", "plantao-success"],
  },
  { label: "Buscar e agendar", flows: ["search-results", "search-filters", "specialty-picker", "search-benefit", "doctor-profile", "doctor-calendar"] },
  { label: "Consulta", flows: ["anamnese-fill", "video-call", "call-chat", "consult-chat", "post-consultation", "consultation-record"] },
  { label: "Super Inteligência", flows: ["ai-chat"] },
];

const STATE_WORDS: Record<string, string> = {
  default: "Padrão",
  empty: "Vazio",
  loading: "Carregando",
  filled: "Preenchido",
  video: "Vídeo",
  chat: "Chat",
  answer: "Resposta",
  summary: "Resumo",
  cardio: "Cardio",
  symptom: "Sintoma",
  since: "Desde quando",
  pain: "Dor",
  health: "Saúde",
  sent: "Enviada",
  done: "Concluída",
  typing: "Digitando",
  full: "Completa",
  day: "Dia",
  tarde: "tarde",
  slot: "Horário",
  preco: "Preço",
  open: "Aberto",
  picked: "Escolhido",
  company: "Empresa",
  where: "Onde",
  blank: "vazio",
  credit: "Crédito",
  reading: "Lendo",
  calling: "Chamando",
  position: "Posição",
  preparing: "Preparando",
  ready: "Pronto",
  transcript: "Transcrição",
  documents: "Documentos",
  clinica: "Clínica",
  filtered: "filtrado",
  set: "Aplicado",
  especialistas: "Especialistas",
  button: "Botão",
  picker: "Seletor",
  photo: "Foto",
  pdf: "PDF",
  rafael: "Rafael",
  in: "Em",
  call: "chamada",
};

export function stateLabel(state: string): string {
  const m = /^m(\d+)$/.exec(state);
  if (m) return `Mensagem ${m[1]}`;
  if (state === "in-call") return "Em chamada";
  return state
    .split("-")
    .map((w, i) => (STATE_WORDS[w] ? (i === 0 ? STATE_WORDS[w] : STATE_WORDS[w].toLowerCase()) : /^\d+$/.test(w) ? `${w}º` : w))
    .join(" · ")
    .replace(/^Posição · (\d+º)$/, "Posição $1");
}

export type ScreenFlow = { id: string; title: string; states: LibraryItem[] };

const flowOf = (id: string): ScreenFlow => {
  const order = manifest[id]?.states ?? [];
  const states = screens.filter((s) => s.group === id).sort((a, b) => order.indexOf(screenState(a.value)) - order.indexOf(screenState(b.value)));
  return { id, title: manifest[id]?.title ?? id, states };
};

export const screenJourneys: { label: string; flows: ScreenFlow[] }[] = (() => {
  const known = new Set(JOURNEYS.flatMap((j) => j.flows));
  const groups = JOURNEYS.map((j) => ({ label: j.label, flows: j.flows.map(flowOf).filter((f) => f.states.length) }));
  const rest = screenGroups.filter((g) => !known.has(g.value)).map((g) => flowOf(g.value));
  return [...groups, ...(rest.length ? [{ label: "Outros", flows: rest }] : [])].filter((g) => g.flows.length);
})();

export function screenFlow(value: string): ScreenFlow | undefined {
  const id = value.split("--")[0];
  return screenJourneys.flatMap((j) => j.flows).find((f) => f.id === id);
}

export function journeyOf(flowId: string): string | undefined {
  return screenJourneys.find((j) => j.flows.some((f) => f.id === flowId))?.label;
}
