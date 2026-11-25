import * as React from "react";
import { ArrowSquareOut, Link as LinkIcon } from "@phosphor-icons/react";
import { Actions, CanvasDotPattern, Field, Input, Panel, PanelSection, Textarea, TextInput } from "@/ui";
import { cn } from "@/ui/lib/utils";
import { STARTER_TAGS, isVideo, mediaOf, mediaUrl, useReferences, type Reference } from "./store";

const URL_RE = /^https?:\/\/\S+$/i;

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const isMedia = (f: File) => f.type.startsWith("image/") || f.type.startsWith("video/");

function Media({ src, controls, className }: { src: string; controls?: boolean; className?: string }) {
  return isVideo(src) ? (
    <video src={mediaUrl(src)} muted={!controls} loop autoPlay={!controls} playsInline controls={controls} preload="metadata" className={className} />
  ) : (
    <img alt="" src={mediaUrl(src)} loading="lazy" draggable={false} className={className} />
  );
}

const isEditable = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);

function Chip({ label, count, active, onClick }: { label: string; count?: number; active?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-6 cursor-pointer rounded-full border px-2.5 text-[11px] transition-colors",
        active
          ? "border-[color:var(--link)] bg-[color:color-mix(in_oklab,var(--link)_14%,transparent)] text-[color:var(--foreground)]"
          : "border-[color:color-mix(in_oklab,var(--border)_14%,transparent)] text-[color:color-mix(in_oklab,var(--foreground)_65%,transparent)] hover:text-[color:var(--foreground)]",
      )}
    >
      {label}
      {count !== undefined ? <span className="ml-1 font-mono opacity-60">{count}</span> : null}
    </button>
  );
}

function Card({ item, selected, onOpen }: { item: Reference; selected: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "mb-3 block w-full cursor-pointer break-inside-avoid overflow-hidden rounded-lg border bg-[color:var(--card,var(--muted))] text-left outline-none",
        selected
          ? "border-[color:var(--link)] shadow-[0_0_0_2px_color-mix(in_oklab,var(--link)_40%,transparent)]"
          : "border-[color:color-mix(in_oklab,var(--border)_10%,transparent)] hover:border-[color:color-mix(in_oklab,var(--border)_30%,transparent)]",
      )}
    >
      {item.src ? (
        <span className="relative block">
          <Media src={item.src} className="block w-full" />
          {mediaOf(item).length > 1 ? (
            <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 font-mono text-[10px] leading-5 text-white">1/{mediaOf(item).length}</span>
          ) : isVideo(item.src) ? (
            <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 font-mono text-[10px] leading-5 text-white">vídeo</span>
          ) : null}
        </span>
      ) : (
        <span className="flex aspect-[4/3] w-full items-center justify-center bg-[color:color-mix(in_oklab,var(--foreground)_5%,transparent)] text-[color:color-mix(in_oklab,var(--foreground)_40%,transparent)]">
          <LinkIcon size={28} />
        </span>
      )}
      <span className="flex flex-col gap-1.5 p-2.5">
        <span className="line-clamp-2 text-[12.5px] leading-4 font-medium text-[color:var(--foreground)]">{item.title}</span>
        <span className="flex flex-wrap items-center gap-1">
          {item.source ? <span className="font-mono text-[10px] text-[color:color-mix(in_oklab,var(--foreground)_50%,transparent)]">{item.source}</span> : null}
          {item.tags.map((t) => (
            <span key={t} className="rounded-full bg-[color:color-mix(in_oklab,var(--foreground)_8%,transparent)] px-1.5 text-[10px] leading-4 text-[color:color-mix(in_oklab,var(--foreground)_70%,transparent)]">
              {t}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}

function AddPanel({ busy, error, onLink, onFiles }: { busy: boolean; error: string | null; onLink: (url: string) => void; onFiles: (files: File[]) => void }) {
  const [url, setUrl] = React.useState("");
  const picker = React.useRef<HTMLInputElement>(null);
  const submit = () => {
    if (!URL_RE.test(url.trim())) return;
    onLink(url.trim());
    setUrl("");
  };
  return (
    <Panel title="Adicionar" className="w-[300px]">
      <PanelSection title="Nova referência" description="Cole uma imagem ou link em qualquer lugar da página, ou arraste arquivos para cá.">
        <div
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        >
          <TextInput name="Link" value={url} onValueChange={setUrl} />
        </div>
        <Actions
          name="Adicionar"
          showLabel={false}
          buttonColumns={2}
          actions={[
            { value: "link", label: "Adicionar link" },
            { value: "file", label: "Imagens ou vídeo" },
          ]}
          actionStates={{ link: { loading: busy } }}
          onAction={(action) => {
            if (action === "link") submit();
            if (action === "file") picker.current?.click();
          }}
        />
        <input
          ref={picker}
          type="file"
          accept="image/*,video/mp4,video/webm,video/quicktime"
          multiple
          hidden
          onChange={(e) => {
            onFiles([...(e.target.files ?? [])]);
            e.target.value = "";
          }}
        />
        <p className="font-mono text-[10.5px] leading-4 text-[color:color-mix(in_oklab,var(--foreground)_50%,transparent)]">
          {error ? `Falhou: ${error}` : busy ? "Salvando…" : "Várias imagens de uma vez viram um carrossel. Vídeos mp4, webm ou mov."}
        </p>
      </PanelSection>
    </Panel>
  );
}

function DetailPanel({
  item,
  all,
  onUpdate,
  onRemove,
  onClose,
}: {
  item: Reference;
  all: Reference[];
  onUpdate: (patch: Partial<Pick<Reference, "title" | "note" | "tags" | "url">>) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  const [note, setNote] = React.useState(item.note);
  const [tag, setTag] = React.useState("");
  React.useEffect(() => setNote(item.note), [item.id, item.note]);
  const used = React.useMemo(() => [...new Set(all.flatMap((i) => i.tags))].filter((t) => !STARTER_TAGS.includes(t)), [all]);
  const suggestions = [...STARTER_TAGS, ...used].filter((t) => !item.tags.includes(t));
  const addTag = (raw: string) => {
    const t = raw.trim().toLowerCase();
    if (t && !item.tags.includes(t)) onUpdate({ tags: [...item.tags, t] });
    setTag("");
  };
  return (
    <Panel title="Referência" className="max-h-full w-[300px]">
      <PanelSection title={item.source ?? item.kind}>
        {mediaOf(item).length ? (
          <div className="flex max-h-[420px] flex-col gap-2 overflow-y-auto">
            {mediaOf(item).map((src, i) => (
              <div key={src} className="relative">
                <Media src={src} controls className="max-h-[360px] w-full rounded-md bg-[color:var(--muted)] object-contain" />
                {mediaOf(item).length > 1 ? (
                  <span className="absolute top-1.5 left-1.5 rounded-full bg-black/60 px-1.5 font-mono text-[10px] leading-4 text-white">{i + 1}</span>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
        <TextInput name="Título" value={item.title} commitOnBlur onValueChange={(title) => onUpdate({ title })} />
        <Field className="min-w-0 !gap-[6px]">
          <span className="text-[11px] text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)]">Nota</span>
          <Textarea
            value={note}
            placeholder="Por que isto é bom? O que aproveitar?"
            onChange={(e) => setNote(e.target.value)}
            onBlur={() => note !== item.note && onUpdate({ note })}
            className="min-h-20"
          />
        </Field>
        <Field className="min-w-0 !gap-[8px]">
          <span className="text-[11px] text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)]">Tags</span>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <Chip key={t} label={`${t} ×`} active onClick={() => onUpdate({ tags: item.tags.filter((x) => x !== t) })} />
            ))}
          </div>
          <Input
            value={tag}
            placeholder="Nova tag e Enter"
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTag(tag);
            }}
          />
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((t) => (
              <Chip key={t} label={`+ ${t}`} onClick={() => addTag(t)} />
            ))}
          </div>
        </Field>
        {item.kind !== "link" ? <TextInput name="Link original" value={item.url ?? ""} commitOnBlur onValueChange={(url) => onUpdate({ url: url.trim() })} /> : null}
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 truncate text-[12px] text-[color:var(--link)] hover:underline"
          >
            <ArrowSquareOut size={14} className="shrink-0" />
            <span className="truncate">{item.url}</span>
          </a>
        ) : null}
        {item.src ? <p className="font-mono text-[10.5px] leading-4 break-all text-[color:color-mix(in_oklab,var(--foreground)_50%,transparent)]">{item.src}</p> : null}
        <Actions
          name="Ações"
          showLabel={false}
          buttonColumns={2}
          actions={[
            { value: "close", label: "Fechar" },
            { value: "delete", label: "Excluir" },
          ]}
          onAction={(action) => {
            if (action === "close") onClose();
            if (action === "delete" && window.confirm(`Excluir "${item.title}"?`)) onRemove();
          }}
        />
      </PanelSection>
    </Panel>
  );
}

export function ReferencesPage() {
  const { items, add, update, remove, busy, error } = useReferences();
  const [query, setQuery] = React.useState("");
  const [tag, setTag] = React.useState<string | null>(null);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [dragging, setDragging] = React.useState(false);

  const addFiles = React.useCallback(
    async (files: File[]) => {
      const picked = files.filter(isMedia);
      if (!picked.length) return;
      const media = await Promise.all(picked.map(readFile));
      const made = await add({ media, title: picked[0].name.replace(/\.[^.]+$/, ""), tags: picked.length > 1 ? ["carrossel"] : picked[0].type.startsWith("video/") ? ["motion"] : [] });
      if (made) setOpenId(made.id);
    },
    [add],
  );

  const addLink = React.useCallback(
    async (url: string) => {
      const made = await add({ kind: "link", url });
      if (made) setOpenId(made.id);
    },
    [add],
  );

  React.useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = [...(e.clipboardData?.files ?? [])].filter(isMedia);
      if (files.length) {
        e.preventDefault();
        void addFiles(files);
        return;
      }
      if (isEditable(e.target)) return;
      const text = e.clipboardData?.getData("text/plain").trim() ?? "";
      if (URL_RE.test(text)) {
        e.preventDefault();
        void addLink(text);
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addFiles, addLink]);

  const all = items ?? [];
  const counts = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const i of all) for (const t of i.tags) map.set(t, (map.get(t) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [all]);

  const shown = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter(
      (i) =>
        (!tag || i.tags.includes(tag)) &&
        (!q || [i.title, i.note, i.source ?? "", i.tags.join(" ")].join(" ").toLowerCase().includes(q)),
    );
  }, [all, query, tag]);

  const open = all.find((i) => i.id === openId);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("Files")) {
          e.preventDefault();
          setDragging(true);
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void addFiles([...e.dataTransfer.files]);
      }}
    >
      <CanvasDotPattern offset={{ x: 0, y: 0 }} scale={1} />
      <div className="absolute inset-0 overflow-y-auto py-3 pr-[330px] pl-[250px]">
        <div className="sticky top-0 z-10 -mx-2 mb-4 flex flex-col gap-2.5 px-2 pt-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-[320px]">
              <Input value={query} placeholder="Buscar por título, nota ou tag" onChange={(e) => setQuery(e.target.value)} />
            </div>
            <span className="font-mono text-[11px] text-[color:color-mix(in_oklab,var(--foreground)_50%,transparent)]">
              {shown.length} de {all.length}
            </span>
            <button
              type="button"
              onClick={() => setOpenId(null)}
              className="ml-auto h-7 cursor-pointer rounded-md bg-[color:var(--primary)] px-3 text-[12px] font-medium text-[color:var(--primary-foreground,#fff)]"
            >
              Adicionar
            </button>
          </div>
          {counts.length ? (
            <div className="flex flex-wrap gap-1.5">
              <Chip label="Todas" count={all.length} active={tag === null} onClick={() => setTag(null)} />
              {counts.map(([t, n]) => (
                <Chip key={t} label={t} count={n} active={tag === t} onClick={() => setTag(tag === t ? null : t)} />
              ))}
            </div>
          ) : null}
        </div>

        {items === null ? null : shown.length ? (
          <div className="columns-[190px] gap-3">
            {shown.map((i) => (
              <Card key={i.id} item={i} selected={i.id === openId} onOpen={() => setOpenId(i.id === openId ? null : i.id)} />
            ))}
          </div>
        ) : (
          <div className="flex h-[50vh] flex-col items-center justify-center gap-1 text-center text-[13px] text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)]">
            <span className="font-medium text-[color:var(--foreground)]">{all.length ? "Nada encontrado" : "Biblioteca vazia"}</span>
            <span>{all.length ? "Ajuste a busca ou as tags." : "Cole uma imagem ou link aqui, ou arraste arquivos."}</span>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute top-2.5 right-2.5 bottom-2.5 flex flex-col items-end">
        <div className="pointer-events-auto flex max-h-full flex-col">
          {open ? (
            <DetailPanel
              item={open}
              all={all}
              onUpdate={(patch) => void update(open.id, patch)}
              onRemove={() => {
                setOpenId(null);
                void remove(open.id);
              }}
              onClose={() => setOpenId(null)}
            />
          ) : (
            <AddPanel busy={busy} error={error} onLink={(u) => void addLink(u)} onFiles={(f) => void addFiles(f)} />
          )}
        </div>
      </div>

      {dragging ? (
        <div className="pointer-events-none absolute inset-2 z-20 flex items-center justify-center rounded-xl border-2 border-dashed border-[color:var(--link)] bg-[color:color-mix(in_oklab,var(--link)_10%,transparent)] text-[14px] font-medium">
          Solte para adicionar
        </div>
      ) : null}
    </div>
  );
}
