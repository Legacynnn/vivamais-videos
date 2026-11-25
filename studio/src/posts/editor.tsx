import * as React from "react";
import { ArrowLeft, Cards, DeviceMobile, Image as ImageIcon, Shapes, Square, TextT } from "@phosphor-icons/react";
import { Actions, Panel, PanelIconButton, PanelSection, PanelSurface, Select, Switch, TextInput } from "@/ui";
import { cn } from "@/ui/lib/utils";
import { Workspace } from "@/shell/workspace";
import { FRAME_GAP, PostCanvas, selectedIds, toggleSelection, type Selection } from "./canvas";
import { FORMATS, FORMAT_BY_ID, KIND_LABEL, frameSize, type Format } from "./formats";
import { BackgroundPicker, backgroundLayer } from "./background";
import { ContentFields, LayerDesign, LayerRow, MultiDesign, TYPE_LABEL } from "./inspector";
import { IconButton, MiniSelect } from "./props";
import { useFocusMode } from "@/shell/focus";
import { photos, screens } from "./library";
import { cloneWithIds, findLayer, isTopLevel, mapLayers, slugify, uid, walk, type Frame, type Kind, type Layer, type Override, type PostDoc } from "./model";
import { BENEFITS, benefitLayer } from "./presets";
import { STYLES, TOPICS, cloneFrame } from "./catalog";
import { place, type Placement } from "./render";
import { api, pickExportFolder, saveExport, type usePosts } from "./store";
import { referencesApi } from "@/references/store";

const PLACE_KEYS = new Set(["x", "y", "w", "h", "rotate", "hidden"]);

function readPref(key: string, fallback: string): string {
  try {
    return localStorage.getItem(`studio:posts:${key}`) ?? fallback;
  } catch {
    return fallback;
  }
}

function writePref(key: string, value: string) {
  try {
    localStorage.setItem(`studio:posts:${key}`, value);
  } catch {
    return;
  }
}

function newLayer(type: Layer["type"], size: { width: number; height: number }): Layer {
  const base = { id: uid(), x: Math.round(size.width * 0.1), y: Math.round(size.height * 0.4), anchor: "center" as const };
  switch (type) {
    case "text":
      return { ...base, type, name: "Texto", text: "Novo texto", font: "display", size: 72, color: "{white}", w: 800 };
    case "image":
      return { ...base, type, name: "Imagem", src: photos[0]?.value ?? "", w: 480, h: 600, radius: 24 };
    case "phone":
      return { ...base, type, name: "Celular", screen: screens[0]?.value ?? "client-home--default", w: 414 };
    case "logo":
      return { ...base, type, name: "Logo", variant: "lockupWhite", h: 40 };
    case "rect":
      return { ...base, type, name: "Forma", background: "{violet.500}", w: 400, h: 400, radius: 24 };
    default:
      return { ...base, type: "chip", name: "Cartão", variant: "pill", title: "Plantão 24h · ao vivo" };
  }
}

function FormatBar({ formats, current, onSelect, back }: { formats: Format[]; current?: string; onSelect: (id: string) => void; back?: () => void }) {
  return (
    <PanelSurface className="pointer-events-auto flex items-center gap-0.5 rounded-lg p-1" data-panel-id="formats">
      {back ? (
        <>
          <PanelIconButton label="Voltar aos modelos" onClick={back}>
            <ArrowLeft />
          </PanelIconButton>
          <span className="mx-1 block h-5 w-px bg-[color:color-mix(in_oklab,var(--border)_8%,transparent)]" />
        </>
      ) : null}
      {formats.map((f) => (
        <button
          key={f.id}
          type="button"
          title={f.note}
          onClick={() => onSelect(f.id)}
          className={cn(
            "flex h-7 items-center rounded-md px-2.5 text-[12.5px] font-medium whitespace-nowrap outline-none",
            "text-[color:color-mix(in_oklab,var(--foreground)_70%,transparent)] transition-colors duration-100",
            "hover:bg-[color:color-mix(in_oklab,var(--foreground)_6%,transparent)] hover:text-[color:var(--foreground)]",
            "focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]",
            current === f.id && "bg-[color:color-mix(in_oklab,var(--foreground)_10%,transparent)] text-[color:var(--foreground)]",
          )}
        >
          {f.label}
        </button>
      ))}
    </PanelSurface>
  );
}

export type PostsStore = ReturnType<typeof usePosts>;

export function TopicPicker({ value, onChange }: { value: string[]; onChange: (topics: string[]) => void }) {
  const all = [...new Set([...TOPICS, ...value])];
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] text-[color:color-mix(in_oklab,var(--foreground)_60%,transparent)]">Temas</span>
      <div className="flex flex-wrap gap-1">
        {all.map((t) => {
          const on = value.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(on ? value.filter((x) => x !== t) : [...value, t])}
              className={cn(
                "h-6 cursor-pointer rounded-full px-2.5 text-[11px] transition-colors duration-100",
                on
                  ? "bg-[color:color-mix(in_oklab,var(--accent)_22%,transparent)] text-[color:var(--foreground)]"
                  : "bg-[color:color-mix(in_oklab,var(--foreground)_5%,transparent)] text-[color:color-mix(in_oklab,var(--foreground)_60%,transparent)] hover:text-[color:var(--foreground)]",
              )}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PostsEditor({ store, doc, onOpen, onClose }: { store: PostsStore; doc: PostDoc; onOpen: (id: string) => void; onClose: () => void }) {
  const { docs, put, remove, save, flush } = store;
  const kind: Kind = doc.kind ?? "post";
  const formats =
    kind === "post"
      ? FORMATS.filter((f) => f.kind === "post")
      : doc.format === "carousel"
        ? [FORMAT_BY_ID.carousel, FORMAT_BY_ID.story, FORMAT_BY_ID.square]
        : [FORMAT_BY_ID[doc.format]];
  const prefKey = `${kind === "sequence" ? doc.format : kind}:format`;
  const [viewFormat, setViewFormat] = React.useState(() => readPref(prefKey, formats[0].id));
  const [selection, setSelection] = React.useState<Selection | null>(null);
  const [guides, setGuides] = React.useState(true);
  const [status, setStatus] = React.useState<string | null>(null);
  const [closed, setClosed] = React.useState<Record<string, boolean>>({ frame: true, insert: true });
  const history = React.useRef<{ undo: PostDoc[]; redo: PostDoc[] }>({ undo: [], redo: [] });

  const format = formats.find((f) => f.id === viewFormat) ?? formats[0];
  const size = frameSize(format, doc.base);
  const native = doc.format === format.id;

  const frame = doc?.frames.find((f) => f.id === selection?.frame) ?? doc?.frames[0];
  const layer = frame && selection?.layer ? findLayer(frame.layers, selection.layer) : undefined;
  const topLevel = !!(frame && layer && isTopLevel(frame, layer.id));
  const overrides = native ? undefined : doc?.overrides?.[format.id];
  const placement = frame && layer && topLevel && doc ? place(layer, size, doc.base, overrides?.[layer.id]) : undefined;

  React.useEffect(() => writePref(prefKey, format.id), [prefKey, format.id]);
  React.useEffect(() => {
    history.current = { undo: [], redo: [] };
    setSelection(null);
    setStatus(null);
  }, [doc?.id]);

  useFocusMode();
  const dragging = React.useRef<string | null>(null);
  const [dropHint, setDropHint] = React.useState<{ id: string; pos: "above" | "below" } | null>(null);
  const fold = (key: string) => ({ collapsible: true, collapsed: !!closed[key], onCollapsedChange: (value: boolean) => setClosed((c) => ({ ...c, [key]: value })) });

  const commit = React.useCallback(
    (next: PostDoc, record = true) => {
      if (!doc) return;
      if (record) {
        history.current.undo.push(doc);
        if (history.current.undo.length > 100) history.current.undo.shift();
        history.current.redo = [];
      }
      put(next);
    },
    [doc, put],
  );

  const updateFrame = React.useCallback(
    (frameId: string, fn: (frame: Frame) => Frame, record = true) => {
      if (!doc) return;
      commit({ ...doc, frames: doc.frames.map((f) => (f.id === frameId ? fn(f) : f)) }, record);
    },
    [doc, commit],
  );

  const patchDoc = React.useCallback(
    (d: PostDoc, frameId: string, layerId: string, patch: Partial<Layer> | Partial<Placement>): PostDoc => {
      const owner = d.frames.find((f) => f.id === frameId);
      const l = owner && findLayer(owner.layers, layerId);
      if (!l) return d;
      const keys = Object.keys(patch);
      if (!native && keys.length && keys.every((k) => PLACE_KEYS.has(k))) {
        const forFormat = { ...(d.overrides?.[format.id] ?? {}) };
        forFormat[layerId] = { ...place(l, size, d.base, forFormat[layerId]), ...(patch as Override) };
        return { ...d, overrides: { ...d.overrides, [format.id]: forFormat } };
      }
      return { ...d, frames: d.frames.map((f) => (f.id === frameId ? { ...f, layers: mapLayers(f.layers, (x) => (x.id === layerId ? ({ ...x, ...patch } as Layer) : x)) } : f)) };
    },
    [native, format.id, size],
  );

  const updateLayer = React.useCallback(
    (frameId: string, layerId: string, patch: Partial<Layer> | Partial<Placement>, record = true) => {
      if (!doc) return;
      const next = patchDoc(doc, frameId, layerId, patch);
      if (next !== doc) commit(next, record);
    },
    [doc, patchDoc, commit],
  );

  const updateLayers = React.useCallback(
    (frameId: string, patches: { id: string; patch: Partial<Layer> | Partial<Placement> }[], record = true) => {
      if (!doc || !patches.length) return;
      commit(patches.reduce((d, p) => patchDoc(d, frameId, p.id, p.patch), doc), record);
    },
    [doc, patchDoc, commit],
  );

  const removeLayers = (frameId: string, ids: string[]) =>
    updateFrame(frameId, (f) => ({ ...f, layers: mapLayers(f.layers, (l) => (ids.includes(l.id) ? null : l)) }));
  const removeLayer = (frameId: string, layerId: string) => removeLayers(frameId, [layerId]);

  function duplicateLayer(frameId: string, layerId: string, offset = 0): string | undefined {
    if (!doc) return;
    const target = doc.frames.find((f) => f.id === frameId);
    const source = target && target.layers.find((l) => l.id === layerId);
    if (!source) return;
    const copy = { ...cloneWithIds(source), name: `${source.name} cópia`, slot: undefined, x: source.x + offset, y: source.y + offset };
    const ov = doc.overrides?.[format.id]?.[source.id];
    const nextOverrides = !native && ov ? { ...doc.overrides, [format.id]: { ...doc.overrides?.[format.id], [copy.id]: ov } } : doc.overrides;
    const i = target.layers.indexOf(source);
    put({
      ...doc,
      overrides: nextOverrides,
      frames: doc.frames.map((f) => (f.id === frameId ? { ...f, layers: [...f.layers.slice(0, i + 1), copy, ...f.layers.slice(i + 1)] } : f)),
    });
    return copy.id;
  }

  function undo(direction: "undo" | "redo") {
    if (!doc) return;
    const from = history.current[direction];
    const to = history.current[direction === "undo" ? "redo" : "undo"];
    const target = from.pop();
    if (!target) return;
    to.push(doc);
    put(target);
  }

  function uniqueId(seed: string) {
    const taken = new Set((docs ?? []).map((d) => d.id));
    let id = slugify(seed);
    for (let n = 2; taken.has(id); n++) id = slugify(`${seed}-${n}`);
    return id;
  }

  function duplicateDoc() {
    if (!doc) return;
    const id = uniqueId(`${doc.id}-copia`);
    put({ ...structuredClone(doc), id, name: `${doc.name} (cópia)`, source: doc.id });
    onOpen(id);
  }

  async function exportDoc() {
    if (!doc) return;
    try {
      const picking = pickExportFolder();
      const dir = picking ? await picking : null;
      if (picking && !dir) return;
      setStatus("Exportando…");
      await flush();
      const { files } = await api.export(doc.id, format.id);
      const where = await saveExport(files, `${doc.id}-${format.id}`, dir);
      setStatus(`${files.length} PNG em ${where}`);
    } catch (error) {
      setStatus(`Falhou: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  function frameMetrics(layerId: string) {
    const el = document.querySelector<HTMLElement>(`[data-frame-view] > [data-layer="${layerId}"]`);
    const view = el?.closest<HTMLElement>("[data-frame-view]");
    if (!el || !view) return;
    const f = view.getBoundingClientRect();
    const zoom = f.width / view.offsetWidth || 1;
    const rectOf = (node: Element) => {
      const r = node.getBoundingClientRect();
      return { x: (r.left - f.left) / zoom, y: (r.top - f.top) / zoom, w: r.width / zoom, h: r.height / zoom };
    };
    return { el, rectOf };
  }

  function groupLayers(frameId: string, layerIds: string[]) {
    const target = doc.frames.find((f) => f.id === frameId);
    if (!target) return;
    const members = target.layers.filter((l) => layerIds.includes(l.id) && !l.fill && l.type !== "screen");
    if (members.length < 2) return;
    const rects = members.map((l) => {
      const m = frameMetrics(l.id);
      const p = placeOf(l);
      return { l, p, r: m ? m.rectOf(m.el) : { x: p.x, y: p.y, w: p.w ?? 0, h: p.h ?? 0 } };
    });
    const gx = Math.floor(Math.min(...rects.map((x) => x.r.x)));
    const gy = Math.floor(Math.min(...rects.map((x) => x.r.y)));
    const gw = Math.ceil(Math.max(...rects.map((x) => x.r.x + x.r.w)) - gx);
    const gh = Math.ceil(Math.max(...rects.map((x) => x.r.y + x.r.h)) - gy);
    const children: Layer[] = rects.map(({ l, p }) => {
      const style: Record<string, string | number> = { ...l.style, position: "absolute", left: Math.round(p.x - gx), top: Math.round(p.y - gy), transformOrigin: "0 0" };
      if (l.type === "text" && p.w !== undefined) style.width = p.w;
      return { ...l, x: 0, y: 0, w: p.w, h: p.h, rotate: p.rotate, anchor: undefined, style } as Layer;
    });
    const group: Layer = { id: uid(), type: "group", name: "Grupo", x: gx, y: gy, w: gw, h: gh, anchor: members[0].anchor, children };
    const top = Math.max(...members.map((l) => target.layers.indexOf(l)));
    const layers = target.layers.flatMap((l, i) => (i === top ? [group] : layerIds.includes(l.id) && members.includes(l) ? [] : [l]));
    const overrides = doc.overrides && Object.fromEntries(Object.entries(doc.overrides).map(([k, v]) => [k, Object.fromEntries(Object.entries(v).filter(([id]) => !layerIds.includes(id)))]));
    commit({ ...doc, overrides, frames: doc.frames.map((f) => (f.id === frameId ? { ...f, layers } : f)) });
    setSelection({ frame: frameId, layer: group.id });
  }

  const LAYOUT_KEYS = /^(position|left|top|right|bottom|width|height|minWidth|maxWidth|minHeight|maxHeight|margin.*|flex.*|alignSelf|justifySelf|order|gridArea|transformOrigin)$/;

  function ungroupLayer(frameId: string, groupId: string) {
    const target = doc.frames.find((f) => f.id === frameId);
    const group = target?.layers.find((l) => l.id === groupId);
    if (!target || !group || group.type !== "group") return;
    const gp = placeOf(group);
    const m = frameMetrics(groupId);
    const k = group.scale ?? 1;
    const fade = group.opacity ?? 1;
    const freed = group.children.map((c) => {
      const style = Object.fromEntries(Object.entries(c.style ?? {}).filter(([key]) => !LAYOUT_KEYS.test(key)));
      const absolute = c.style?.position === "absolute" && k === 1 && !group.rotate;
      const node = m?.el.querySelector(`[data-child="${c.id}"]`);
      const r = absolute
        ? { x: gp.x + Number(c.style?.left ?? 0), y: gp.y + Number(c.style?.top ?? 0), w: c.w ?? (Number.parseFloat(String(c.style?.width ?? "")) || undefined), h: c.h }
        : node && m
          ? m.rectOf(node)
          : { x: gp.x, y: gp.y, w: c.w, h: c.h };
      const base = { ...c, x: Math.round(r.x), y: Math.round(r.y), anchor: group.anchor, style: Object.keys(style).length ? style : undefined, opacity: fade * (c.opacity ?? 1) === 1 ? undefined : fade * (c.opacity ?? 1) };
      const w = r.w === undefined ? undefined : Math.round(r.w);
      const h = r.h === undefined ? undefined : Math.round(r.h);
      if (c.type === "text") return { ...base, w, size: Math.round(c.size * k * 100) / 100, leading: c.leading ? Math.round(c.leading * k * 100) / 100 : undefined } as Layer;
      if (c.type === "chip" || c.type === "group") return { ...base, scale: (c.scale ?? 1) * k === 1 ? undefined : (c.scale ?? 1) * k } as Layer;
      if (c.type === "logo") return { ...base, h } as Layer;
      if (c.type === "phone") return { ...base, w } as Layer;
      return { ...base, w, h } as Layer;
    });
    const layers = target.layers.flatMap((l) => (l.id === groupId ? freed : [l]));
    commit({ ...doc, frames: doc.frames.map((f) => (f.id === frameId ? { ...f, layers } : f)) });
    setSelection({ frame: frameId, layer: freed[0]?.id, extra: freed.length > 1 ? freed.slice(1).map((l) => l.id) : undefined });
  }

  async function exportLayers(frameId: string, layerIds: string[]) {
    try {
      const picking = pickExportFolder();
      const dir = picking ? await picking : null;
      if (picking && !dir) return;
      setStatus("Exportando camada…");
      await flush();
      const { files } = await api.exportLayers(doc.id, format.id, frameId, layerIds);
      const where = await saveExport(files, `${doc.id}-${format.id}-camadas`, dir);
      setStatus(`PNG transparente em ${where}`);
    } catch (error) {
      setStatus(`Falhou: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function saveReference() {
    if (!doc) return;
    setStatus("Salvando referência…");
    try {
      await flush();
      const { files } = await api.export(doc.id, format.id);
      await referencesApi.create({ kind: "post", fromFile: files[0], title: doc.name, source: "studio", tags: ["post"] });
      setStatus("Salvo em Referências");
    } catch (error) {
      setStatus(`Falhou: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async function copyRef(frameId: string, layerId?: string) {
    if (!doc) return;
    const ref = `vm:${doc.id}/${frameId}${layerId ? `/${layerId}` : ""}`;
    try {
      await navigator.clipboard.writeText(ref);
      setStatus(`Copiado ${ref}`);
    } catch {
      setStatus(ref);
    }
  }

  function addLayer(made: Layer) {
    if (!frame) return;
    updateFrame(frame.id, (f) => ({ ...f, layers: [...f.layers, made] }));
    setSelection({ frame: frame.id, layer: made.id });
  }

  function reorderLayer(fromId: string, toId: string, pos: "above" | "below") {
    if (!frame || fromId === toId) return;
    updateFrame(frame.id, (f) => {
      const moving = f.layers.find((l) => l.id === fromId);
      if (!moving) return f;
      const rest = f.layers.filter((l) => l.id !== fromId);
      const at = rest.findIndex((l) => l.id === toId);
      if (at < 0) return f;
      const index = pos === "above" ? at + 1 : at;
      return { ...f, layers: [...rest.slice(0, index), moving, ...rest.slice(index)] };
    });
  }

  function moveLayer(dir: 1 | -1) {
    if (!frame || !layer || !topLevel) return;
    const i = frame.layers.findIndex((l) => l.id === layer.id);
    const j = i + dir;
    if (j < 0 || j >= frame.layers.length) return;
    updateFrame(frame.id, (f) => {
      const layers = [...f.layers];
      [layers[i], layers[j]] = [layers[j], layers[i]];
      return { ...f, layers };
    });
  }

  function frameAction(action: string) {
    if (!doc || !frame) return;
    const i = doc.frames.findIndex((f) => f.id === frame.id);
    if (action === "add") {
      const copy = cloneFrame(frame, `Tela ${doc.frames.length + 1}`);
      commit({ ...doc, frames: [...doc.frames.slice(0, i + 1), copy, ...doc.frames.slice(i + 1)] });
      setSelection({ frame: copy.id });
    }
    if (action === "remove" && doc.frames.length > 1) {
      commit({ ...doc, frames: doc.frames.filter((f) => f.id !== frame.id) });
      setSelection(null);
    }
    if (action === "left" || action === "right") {
      const j = i + (action === "left" ? -1 : 1);
      if (j < 0 || j >= doc.frames.length) return;
      const frames = [...doc.frames];
      [frames[i], frames[j]] = [frames[j], frames[i]];
      commit({ ...doc, frames });
    }
    if (action === "wider" || action === "narrower") {
      const width = Math.max(2160, doc.base.width + (action === "wider" ? 1080 : -1080));
      commit({ ...doc, base: { ...doc.base, width } });
    }
  }

  const ids = selectedIds(selection);
  const placeOf = (l: Layer) => place(l, size, doc.base, overrides?.[l.id]);
  const keyState = React.useRef({ frame, layer, doc, placement, topLevel, ids });
  keyState.current = { frame, layer, doc, placement, topLevel, ids };

  React.useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (target.isContentEditable || target.closest("input, textarea, select")) return;
      const { frame, layer, doc, placement, topLevel, ids } = keyState.current;
      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undo(event.shiftKey ? "redo" : "undo");
        return;
      }
      if (mod && event.key.toLowerCase() === "c" && doc && frame && !window.getSelection()?.toString()) {
        event.preventDefault();
        void copyRef(frame.id, layer?.id);
        return;
      }
      if (!doc || !frame || !layer) {
        if (event.key === "Escape") setSelection(null);
        return;
      }
      if (event.key === "Escape") setSelection({ frame: frame.id });
      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        removeLayers(frame.id, ids);
        setSelection({ frame: frame.id });
      }
      if (mod && event.key.toLowerCase() === "g") {
        event.preventDefault();
        if (event.shiftKey) {
          if (layer.type === "group" && topLevel) ungroupLayer(frame.id, layer.id);
        } else groupLayers(frame.id, ids);
        return;
      }
      if (mod && event.key.toLowerCase() === "d" && topLevel && ids.length === 1) {
        event.preventDefault();
        const id = duplicateLayer(frame.id, layer.id, 24);
        if (id) setSelection({ frame: frame.id, layer: id });
      }
      const arrows: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      const step = arrows[event.key];
      if (step && placement) {
        event.preventDefault();
        const k = event.shiftKey ? 10 : 1;
        updateLayers(
          frame.id,
          ids.flatMap((id) => {
            const l = frame.layers.find((x) => x.id === id);
            if (!l || l.locked) return [];
            const p = placeOf(l);
            return [{ id, patch: { x: p.x + step[0] * k, y: p.y + step[1] * k } }];
          }),
        );
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const slots: Layer[] = [];
  const tree: { layer: Layer; depth: number }[] = [];
  if (frame) {
    const bgId = backgroundLayer(frame)?.id;
    walk(frame.layers, (l) => {
      if (l.slot && l.id !== bgId && !l.hidden) slots.push(l);
    });
    const visit = (layers: Layer[], depth: number) => {
      for (const l of [...layers].reverse()) {
        tree.push({ layer: l, depth });
        if (l.type === "group" && (depth > 0 || selection?.layer === l.id || (layer && findLayer(l.children, layer.id)))) visit(l.children, depth + 1);
      }
    };
    visit(frame.layers, 0);
  }

  const saveLabel = save === "saving" ? "Salvando…" : save === "error" ? "Erro ao salvar" : doc ? `posts/${doc.id}.json` : "";
  const insertAt = { x: Math.round(size.width * 0.12), y: Math.round(size.height * 0.45) };

  const docPanel = (
    <Panel title={KIND_LABEL[kind]} className="max-h-full w-[300px]">
      <PanelSection title={doc.name} description={doc.source ? `Base: ${doc.source}` : undefined} {...fold("doc")}>
        <TextInput name="Nome" value={doc.name} commitOnBlur onValueChange={(name) => commit({ ...doc, name })} />
        <Select
          name="Estilo"
          value={doc.style ?? ""}
          onValueChange={(style) => commit({ ...doc, style: style || undefined })}
          options={[{ label: "Sem estilo", value: "" }, ...STYLES.map((s) => ({ label: s.id, value: s.id }))]}
        />
        <TopicPicker value={doc.topics ?? []} onChange={(topics) => commit({ ...doc, topics })} />
        <Actions
          name="Ações"
          showLabel={false}
          buttonColumns={2}
          actions={[
            { value: "export", label: "Exportar" },
            { value: "duplicate", label: "Duplicar" },
            { value: "reference", label: "Referência" },
            { value: "delete", label: "Excluir" },
          ]}
          actionStates={{ export: { loading: status === "Exportando…" } }}
          onAction={(action) => {
            if (action === "export") void exportDoc();
            if (action === "duplicate") duplicateDoc();
            if (action === "reference") void saveReference();
            if (action === "delete" && window.confirm(`Excluir "${doc.name}"? Apaga posts/${doc.id}.json.`)) {
              void remove(doc.id);
              onClose();
            }
          }}
        />
        <p className="font-mono text-[10.5px] leading-4 text-[color:color-mix(in_oklab,var(--foreground)_50%,transparent)]">
          {status ?? saveLabel}
          {!native ? ` · ajustes de posição valem só em ${format.label}` : ""}
        </p>
        {format.safe || format.circle || format.slices ? <Switch name="Guias do formato" checked={guides} onCheckedChange={setGuides} /> : null}
      </PanelSection>

      {frame ? (
        <PanelSection title={doc.frames.length > 1 ? `Fundo · ${frame.name}` : "Fundo"} {...fold("background")}>
          <BackgroundPicker frame={frame} onChange={(next) => updateFrame(frame.id, () => next)} />
        </PanelSection>
      ) : null}

      {frame && slots.length ? (
        <PanelSection title={doc.frames.length > 1 ? `Conteúdo · ${frame.name}` : "Conteúdo"} {...fold("content")}>
          {slots.map((l) => (
            <ContentFields key={l.id} layer={l} onChange={(patch) => updateLayer(frame.id, l.id, patch)} />
          ))}
        </PanelSection>
      ) : null}

      {frame ? (
        <PanelSection title="Tela" {...fold("frame")}>
          <TextInput name="Nome" value={frame.name} commitOnBlur onValueChange={(name) => updateFrame(frame.id, (f) => ({ ...f, name }))} />
          <Actions name="Referência" showLabel={false} buttonColumns={1} actions={[{ value: "ref", label: "Copiar ID do quadro  ⌘C" }]} onAction={() => void copyRef(frame.id)} />
          <TextInput name="Fundo (CSS)" value={frame.background} commitOnBlur onValueChange={(background) => updateFrame(frame.id, (f) => ({ ...f, background }))} />
          {kind === "sequence" && doc.format === "carousel" ? (
            <Actions
              name="Telas"
              showLabel={false}
              buttonColumns={2}
              actions={[
                { value: "add", label: "Duplicar tela" },
                { value: "remove", label: "Remover tela" },
                { value: "left", label: "← Mover" },
                { value: "right", label: "Mover →" },
              ]}
              actionStates={{ remove: { disabled: doc.frames.length < 2 } }}
              onAction={frameAction}
            />
          ) : null}
          {format.slices ? (
            <Actions
              name="Largura"
              showLabel={false}
              buttonColumns={2}
              actions={[
                { value: "narrower", label: "− 1 tela" },
                { value: "wider", label: "+ 1 tela" },
              ]}
              onAction={frameAction}
            />
          ) : null}
        </PanelSection>
      ) : null}
    </Panel>
  );

  const statusLine = status ? (
    <p className="px-3 pt-2 font-mono text-[10.5px] leading-4 text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)]">{status}</p>
  ) : null;
  const multi = frame && ids.length > 1 ? ids.map((id) => frame.layers.find((l) => l.id === id)).filter((l): l is Layer => !!l) : [];
  const panel =
    frame && multi.length > 1 ? (
      <Panel title="Design" className="max-h-full w-[280px]">
        {statusLine}
        <MultiDesign
          items={multi.map((l) => ({ layer: l, placement: placeOf(l) }))}
          onPatch={(patches) => updateLayers(frame.id, patches)}
          onRemove={() => {
            removeLayers(frame.id, ids);
            setSelection({ frame: frame.id });
          }}
          onExport={() => void exportLayers(frame.id, ids)}
          onGroup={() => groupLayers(frame.id, ids)}
        />
      </Panel>
    ) : frame && layer ? (
      <Panel title="Design" className="max-h-full w-[280px]">
        {statusLine}
        <LayerDesign
          key={layer.id}
          layer={layer}
          placement={placement}
          nested={!topLevel}
          size={size}
          onChange={(patch) => updateLayer(frame.id, layer.id, patch)}
          onPlace={(patch) => updateLayer(frame.id, layer.id, patch)}
          actions={{
            forward: topLevel ? () => moveLayer(1) : undefined,
            backward: topLevel ? () => moveLayer(-1) : undefined,
            duplicate: topLevel
              ? () => {
                  const id = duplicateLayer(frame.id, layer.id, 24);
                  if (id) setSelection({ frame: frame.id, layer: id });
                }
              : undefined,
            remove: () => {
              removeLayer(frame.id, layer.id);
              setSelection({ frame: frame.id });
            },
            copyRef: () => void copyRef(frame.id, layer.id),
            exportPng: topLevel ? () => void exportLayers(frame.id, [layer.id]) : undefined,
            ungroup: topLevel && layer.type === "group" ? () => ungroupLayer(frame.id, layer.id) : undefined,
          }}
        />
      </Panel>
    ) : (
      docPanel
    );

  const INSERT: { type: Layer["type"]; icon: React.ReactNode }[] = [
    { type: "text", icon: <TextT /> },
    { type: "image", icon: <ImageIcon /> },
    { type: "rect", icon: <Square /> },
    { type: "phone", icon: <DeviceMobile /> },
    { type: "chip", icon: <Cards /> },
    { type: "logo", icon: <Shapes /> },
  ];

  const leftPanel = frame ? (
    <Panel title={doc.frames.length > 1 ? `Camadas · ${frame.name}` : "Camadas"} className="max-h-full w-[240px]">
      <div className="flex flex-col gap-2 px-2 pt-1 pb-2">
        <div className="flex items-center justify-between">
          {INSERT.map((t) => (
            <IconButton key={t.type} label={`Inserir ${TYPE_LABEL[t.type].toLowerCase()}`} onClick={() => addLayer(newLayer(t.type, size))}>
              {t.icon}
            </IconButton>
          ))}
        </div>
        <MiniSelect
          label="Inserir benefício flutuante"
          value=""
          onChange={(label) => {
            const b = BENEFITS.find((x) => x.label === label);
            if (b) addLayer(benefitLayer(b, insertAt.x, insertAt.y));
          }}
          options={[{ label: "+ Benefício flutuante…", value: "" }, ...BENEFITS.map((b) => ({ label: b.label, value: b.label }))]}
        />
      </div>
      <div
        className="flex min-h-0 flex-col gap-px overflow-y-auto border-t border-[color:color-mix(in_oklab,var(--border)_8%,transparent)] px-1.5 py-1.5"
        onDragEnd={() => {
          dragging.current = null;
          setDropHint(null);
        }}
      >
        {tree.map(({ layer: l, depth }) => (
          <LayerRow
            key={l.id}
            layer={l}
            depth={depth}
            active={ids.includes(l.id)}
            onSelect={(shift) => setSelection(shift && depth === 0 && isTopLevel(frame, selection?.layer ?? "") ? toggleSelection(selection, frame.id, l.id) : { frame: frame.id, layer: l.id })}
            onToggle={(key) => updateLayer(frame.id, l.id, { [key]: !l[key] || undefined })}
            drop={depth === 0 && dropHint?.id === l.id ? dropHint.pos : undefined}
            onDragStart={depth === 0 ? () => (dragging.current = l.id) : undefined}
            onDragOver={depth === 0 ? (pos) => dragging.current && setDropHint((h) => (h?.id === l.id && h.pos === pos ? h : { id: l.id, pos })) : undefined}
            onDrop={() => {
              if (dragging.current && dropHint) reorderLayer(dragging.current, dropHint.id, dropHint.pos);
              dragging.current = null;
              setDropHint(null);
            }}
          />
        ))}
      </div>
    </Panel>
  ) : null;

  const frames = kind === "post" ? doc.frames.slice(0, 1) : doc.frames;
  const artboard = { width: size.width * frames.length + FRAME_GAP * (frames.length - 1), height: size.height, label: `${doc.id}-${format.id}-${frames.length}-${size.width}` };

  return (
    <Workspace
      artboard={artboard}
      panel={panel}
      bare
      leftPanel={leftPanel}
      fitMode="contain"
      onBackgroundPointerDown={() => setSelection(null)}
      toolbar={<FormatBar formats={formats} current={format.id} onSelect={(id) => setViewFormat(id)} back={onClose} />}
    >
      <PostCanvas
          doc={{ ...doc, frames }}
          format={format}
          size={size}
          selection={selection}
          guides={guides}
          onSelect={setSelection}
          onMoveStart={() => {
            history.current.undo.push(doc);
            history.current.redo = [];
          }}
          onMove={(f, moves) => updateLayers(f, moves.map((m) => ({ id: m.id, patch: { x: m.x, y: m.y } })), false)}
          onDuplicate={(f, l) => duplicateLayer(f, l)}
          onEdit={(f, l, patch) => updateLayer(f, l, patch)}
          onTransform={(f, l, patch) => updateLayer(f, l, patch, false)}
        />
    </Workspace>
  );
}
