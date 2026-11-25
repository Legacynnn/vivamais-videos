import * as React from "react";
import { ArrowLeft, MagnifyingGlass, Plus, X } from "@phosphor-icons/react";
import { cn } from "@/ui/lib/utils";
import { FORMATS, FORMAT_BY_ID, frameSize } from "./formats";
import { FALLBACK_STYLE, FORMAT_FILTERS, STYLES, TOPICS, canJoin, formatGroup, groupByStyle, joinDocs, styleOf, type FormatFilter } from "./catalog";
import { PostsEditor } from "./editor";
import { slugify, type PostDoc } from "./model";
import { blankFrames } from "./presets";
import { FrameView } from "./render";
import { usePosts } from "./store";
import { cssColor } from "./tokens";
import "./library.css";

function readPref(key: string, fallback: string): string {
  try {
    return localStorage.getItem(`studio:library:${key}`) ?? fallback;
  } catch {
    return fallback;
  }
}

function writePref(key: string, value: string) {
  try {
    localStorage.setItem(`studio:library:${key}`, value);
  } catch {
    return;
  }
}

function useBox<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [box, setBox] = React.useState({ w: 0, h: 0, seen: false });
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox((b) => ({ ...b, w: e.contentRect.width, h: e.contentRect.height })));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setBox((b) => (b.seen ? b : { ...b, seen: true })), { rootMargin: "300px" });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);
  return [ref, box] as const;
}

function sizeOf(doc: PostDoc) {
  const format = FORMAT_BY_ID[doc.format] ?? FORMATS[0];
  return { format, size: frameSize(format, doc.base) };
}

function Mini({ doc, index = 0, width, visible, className }: { doc: PostDoc; index?: number; width: number; visible: boolean; className?: string }) {
  const { size } = sizeOf(doc);
  const frame = doc.frames[index] ?? doc.frames[0];
  const k = width / size.width;
  return (
    <span className={cn("block", className)} style={{ width, height: size.height * k, background: cssColor(frame?.background) }}>
      {visible && frame && width > 0 ? (
        <span className="pointer-events-none block origin-top-left" style={{ width: size.width, height: size.height, transform: `scale(${k})` }}>
          <FrameView frame={frame} width={size.width} height={size.height} base={doc.base} />
        </span>
      ) : null}
    </span>
  );
}

const pieceTitle = (doc: PostDoc) => {
  const [code, ...rest] = doc.name.split(" · ");
  return rest.length ? { code, title: rest.join(" · ") } : { code: "", title: code };
};

function FolderCard({ name, note, docs, index, onOpen }: { name: string; note: string; docs: PostDoc[]; index: number; onOpen: () => void }) {
  const [ref, box] = useBox<HTMLDivElement>();
  const papers = [...docs].sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")).slice(0, 3);
  const order = papers.length === 3 ? [papers[1], papers[0], papers[2]] : papers;
  return (
    <button type="button" className="vm-folder vm-enter" style={{ "--i": index } as React.CSSProperties} onClick={onOpen}>
      <div ref={ref} className="vm-folder__art">
        <div className="vm-folder__back" />
        {order.map((d) => (
          <span key={d.id} className="vm-folder__paper">
            <Mini doc={d} width={box.w * 0.34} visible={box.seen} />
          </span>
        ))}
        <div className="vm-folder__front">
          <span className="font-mono text-[11px] tracking-[0.02em] opacity-80">{docs.length} {docs.length === 1 ? "peça" : "peças"}</span>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 px-1">
        <span className="text-[14px] font-medium text-[color:var(--foreground)]">{name}</span>
        <span className="line-clamp-2 text-[12px] leading-[17px] text-[color:color-mix(in_oklab,var(--foreground)_50%,transparent)]">{note}</span>
      </div>
    </button>
  );
}

function PieceCard({ doc, index, picked, onClick }: { doc: PostDoc; index: number; picked: boolean; onClick: (e: React.MouseEvent) => void }) {
  const [ref, box] = useBox<HTMLDivElement>();
  const { format, size } = sizeOf(doc);
  const many = format.kind !== "post" && doc.frames.length > 1;
  const pad = 36;
  const inner = Math.max(0, Math.min(box.w, box.h) - pad);
  const scale = Math.min(inner / size.width, inner / size.height) * (many ? 0.78 : 1);
  const width = size.width * scale;
  const { code, title } = pieceTitle(doc);
  return (
    <button type="button" className="vm-card vm-enter" data-picked={picked} style={{ "--i": index } as React.CSSProperties} onClick={onClick}>
      <div ref={ref} className="vm-card__art">
        {many ? (
          <span className="vm-card__stack">
            {doc.frames.slice(0, 3).map((f, i) => (
              <span key={f.id} className="vm-card__frame">
                <Mini doc={doc} index={i} width={width} visible={box.seen} />
              </span>
            ))}
          </span>
        ) : (
          <span className="vm-card__frame">
            <Mini doc={doc} width={width} visible={box.seen} />
          </span>
        )}
        {many ? (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-[color:color-mix(in_oklab,var(--background)_75%,transparent)] px-2 py-0.5 font-mono text-[10.5px] text-[color:color-mix(in_oklab,var(--foreground)_80%,transparent)] backdrop-blur">
            {doc.frames.length} telas
          </span>
        ) : null}
        {picked ? <span className="absolute top-2.5 left-2.5 size-2.5 rounded-full bg-[color:var(--accent)]" /> : null}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5 px-1">
        <span className="flex min-w-0 items-baseline gap-1.5 text-[13px] text-[color:var(--foreground)]">
          {code ? <span className="shrink-0 font-mono text-[11px] text-[color:var(--accent)]">{code}</span> : null}
          <span className="truncate">{title}</span>
        </span>
        <span className="truncate text-[11.5px] text-[color:color-mix(in_oklab,var(--foreground)_45%,transparent)]">
          {format.label}
          {doc.topics?.length ? ` · ${doc.topics.join(", ")}` : ""}
        </span>
      </div>
    </button>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12px] whitespace-nowrap outline-none transition-colors duration-150 active:scale-[0.97]",
        "focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
        active
          ? "bg-[color:var(--foreground)] text-[color:var(--background)]"
          : "bg-[color:color-mix(in_oklab,var(--foreground)_6%,transparent)] text-[color:color-mix(in_oklab,var(--foreground)_70%,transparent)] hover:text-[color:var(--foreground)]",
      )}
    >
      {children}
    </button>
  );
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="flex h-9 w-full max-w-[320px] items-center gap-2 rounded-lg border border-[color:color-mix(in_oklab,var(--border)_12%,transparent)] bg-[color:color-mix(in_oklab,var(--input)_5%,transparent)] px-3 focus-within:border-[color:color-mix(in_oklab,var(--border)_30%,transparent)]">
      <MagnifyingGlass className="size-4 shrink-0 opacity-50" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-full min-w-0 flex-1 bg-transparent text-[13px] outline-none" />
      {value ? (
        <button type="button" aria-label="Limpar busca" onClick={() => onChange("")} className="cursor-pointer opacity-50 hover:opacity-100">
          <X className="size-3.5" />
        </button>
      ) : null}
    </label>
  );
}

function uniqueId(docs: PostDoc[], seed: string) {
  const taken = new Set(docs.map((d) => d.id));
  let id = slugify(seed);
  for (let n = 2; taken.has(id); n++) id = slugify(`${seed}-${n}`);
  return id;
}

const CAROUSELS = "Carrosséis";
const isCarousel = (d: PostDoc) => formatGroup(d) === "carousel";

const matches = (d: PostDoc, q: string) => `${d.name} ${d.id} ${styleOf(d)} ${(d.topics ?? []).join(" ")}`.toLowerCase().includes(q);

export function LibraryPage() {
  const store = usePosts();
  const { docs, put } = store;
  const [openId, setOpenId] = React.useState(() => readPref("open", ""));
  const [folder, setFolder] = React.useState(() => readPref("folder", ""));
  const [query, setQuery] = React.useState("");
  const [formatFilter, setFormatFilter] = React.useState<FormatFilter>(() => readPref("format", "all") as FormatFilter);
  const [topic, setTopic] = React.useState<string | null>(null);
  const [picked, setPicked] = React.useState<string[]>([]);

  React.useEffect(() => writePref("open", openId), [openId]);
  React.useEffect(() => writePref("folder", folder), [folder]);
  React.useEffect(() => writePref("format", formatFilter), [formatFilter]);

  const all = React.useMemo(() => docs ?? [], [docs]);
  const open = all.find((d) => d.id === openId);
  const folders = React.useMemo(() => {
    const carousels = all.filter(isCarousel);
    const rest = groupByStyle(all.filter((d) => !isCarousel(d)));
    return carousels.length ? ([[CAROUSELS, carousels], ...rest] as [string, PostDoc[]][]) : rest;
  }, [all]);
  const inFolder = React.useMemo(() => folders.find(([name]) => name === folder)?.[1] ?? [], [folders, folder]);
  const q = query.trim().toLowerCase();

  const shown = React.useMemo(() => {
    const pool = folder ? inFolder : q ? all : [];
    return pool.filter((d) => (formatFilter === "all" || formatGroup(d) === formatFilter) && (!topic || (d.topics ?? []).includes(topic)) && (!q || matches(d, q)));
  }, [folder, inFolder, all, q, formatFilter, topic]);

  const scope = folder ? inFolder : all;
  const formatCounts = Object.fromEntries(FORMAT_FILTERS.map((f) => [f.id, f.id === "all" ? scope.length : scope.filter((d) => formatGroup(d) === f.id).length]));
  const topicCounts = [...new Set([...TOPICS, ...scope.flatMap((d) => d.topics ?? [])])]
    .map((t) => [t, scope.filter((d) => (d.topics ?? []).includes(t)).length] as const)
    .filter(([, n]) => n > 0);
  const recent = React.useMemo(() => [...all].sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "")).slice(0, 6), [all]);

  const selected = picked.map((id) => all.find((d) => d.id === id)).filter((d): d is PostDoc => !!d);
  const joinable = selected.length > 0 && selected.every(canJoin);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || open) return;
      if (picked.length) setPicked([]);
      else if (query) setQuery("");
      else if (folder) setFolder("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, picked.length, query, folder]);

  if (open) return <PostsEditor key={open.id} store={store} doc={open} onOpen={setOpenId} onClose={() => setOpenId("")} />;

  function enter(name: string) {
    setFolder(name);
    setTopic(null);
    setQuery("");
    setFormatFilter("all");
  }

  function createBlank() {
    const format = FORMAT_BY_ID.feed;
    const base = { width: format.width, height: format.height };
    const id = uniqueId(all, `${format.id}-nova-peca`);
    const style = folder && folder !== FALLBACK_STYLE && folder !== CAROUSELS ? folder : STYLES[0].id;
    put({ id, name: "Nova peça", kind: format.kind, format: format.id, style, topics: [], base, frames: blankFrames(format, base), updatedAt: "" });
    setOpenId(id);
  }

  function join() {
    const id = uniqueId(all, "seq-carrossel-montado");
    put(joinDocs(selected, id, "Carrossel · Montado"));
    setPicked([]);
    setOpenId(id);
  }

  const pick = (d: PostDoc) => (e: React.MouseEvent) => (e.metaKey || e.ctrlKey || e.shiftKey || picked.length ? toggle(d.id) : setOpenId(d.id));
  const styleNote = (name: string) =>
    name === CAROUSELS
      ? "Todos os carrosséis, de todos os estilos. Monte novos com ⌘-clique em peças 4:5"
      : (STYLES.find((s) => s.id === name)?.note ?? "Peças sem estilo definido. Escolha um estilo dentro da peça.");
  const muted = "text-[color:color-mix(in_oklab,var(--foreground)_50%,transparent)]";
  const grid = "grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-x-5 gap-y-8";

  return (
    <div className="vm-lib absolute inset-0 overflow-y-auto">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 py-10 pr-10 pl-[264px]">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            {folder ? (
              <button type="button" onClick={() => setFolder("")} className={cn("flex w-fit cursor-pointer items-center gap-1.5 text-[12.5px] hover:text-[color:var(--foreground)]", muted)}>
                <ArrowLeft className="size-3.5" />
                Biblioteca
              </button>
            ) : (
              <span className={cn("text-[12.5px]", muted)}>{all.length} peças em {folders.length} pastas</span>
            )}
            <h1 className="text-[30px] leading-[34px] font-medium tracking-[-0.02em]" style={{ fontFamily: "Space Grotesk" }}>
              {folder || "Biblioteca"}
            </h1>
            {folder ? <p className={cn("max-w-[560px] text-[13px]", muted)}>{styleNote(folder)}</p> : null}
          </div>
          <div className="flex items-center gap-2">
            <SearchBox value={query} onChange={setQuery} placeholder={folder ? `Buscar em ${folder}` : "Buscar em todas as peças"} />
            <button
              type="button"
              onClick={createBlank}
              className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-[color:var(--primary)] px-3.5 text-[13px] font-medium whitespace-nowrap text-white transition-transform duration-150 active:scale-[0.97]"
            >
              <Plus className="size-4" weight="bold" />
              Nova peça
            </button>
          </div>
        </header>

        {folder || q ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-1.5">
              {FORMAT_FILTERS.filter((f) => f.id === "all" || formatCounts[f.id]).map((f) => (
                <Pill key={f.id} active={formatFilter === f.id} onClick={() => setFormatFilter(f.id)}>
                  {f.label}
                  <span className="font-mono text-[10.5px] opacity-50">{formatCounts[f.id]}</span>
                </Pill>
              ))}
            </div>
            {topicCounts.length ? (
              <div className="flex flex-wrap gap-1.5">
                {topicCounts.map(([t, n]) => (
                  <Pill key={t} active={topic === t} onClick={() => setTopic(topic === t ? null : t)}>
                    {t}
                    <span className="font-mono text-[10.5px] opacity-50">{n}</span>
                  </Pill>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {docs === null ? null : folder || q ? (
          shown.length ? (
            <div key={`${folder}-${formatFilter}-${topic}-${q}`} className={grid}>
              {shown.map((d, i) => (
                <PieceCard key={d.id} doc={d} index={i} picked={picked.includes(d.id)} onClick={pick(d)} />
              ))}
            </div>
          ) : (
            <p className={cn("py-16 text-center text-[14px]", muted)}>Nada encontrado com esses filtros.</p>
          )
        ) : (
          <>
            <section className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-x-7 gap-y-10">
              {folders.map(([name, list], i) => (
                <FolderCard key={name} name={name} note={styleNote(name)} docs={list} index={i} onOpen={() => enter(name)} />
              ))}
            </section>
            {recent.length ? (
              <section className="flex flex-col gap-4">
                <h2 className="text-[13px] font-medium">Editadas recentemente</h2>
                <div className={grid}>
                  {recent.map((d, i) => (
                    <PieceCard key={d.id} doc={d} index={i} picked={picked.includes(d.id)} onClick={pick(d)} />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>

      {selected.length ? (
        <div className="vm-bar fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-[color:color-mix(in_oklab,var(--border)_14%,transparent)] bg-[color:var(--popover,var(--background))] py-2 pr-2 pl-4 shadow-[0_20px_60px_-16px_rgb(0_0_0/0.7)]">
          <span className="text-[13px]">
            {selected.length} {selected.length === 1 ? "peça" : "peças"}
          </span>
          <select
            aria-label="Mudar estilo"
            value=""
            onChange={(e) => e.target.value && selected.forEach((d) => put({ ...d, style: e.target.value }))}
            className="h-8 cursor-pointer rounded-lg bg-[color:color-mix(in_oklab,var(--foreground)_6%,transparent)] px-2 text-[12.5px] outline-none [&>option]:bg-[color:var(--background)]"
          >
            <option value="">Mover pra pasta…</option>
            {STYLES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!joinable}
            title={joinable ? "Junta as peças marcadas, na ordem, num carrossel novo" : "Só entram peças 4:5 (posts e carrosséis)"}
            onClick={join}
            className="h-8 cursor-pointer rounded-lg bg-[color:var(--primary)] px-3 text-[12.5px] font-medium text-white transition-transform duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Montar carrossel
          </button>
          <button type="button" aria-label="Limpar seleção" onClick={() => setPicked([])} className="flex size-8 cursor-pointer items-center justify-center rounded-lg opacity-60 hover:opacity-100">
            <X className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
