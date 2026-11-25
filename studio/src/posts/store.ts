import * as React from "react";
import type { PostDoc } from "./model";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/posts${path}`, { headers: { "Content-Type": "application/json" }, ...init });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? res.statusText);
  return body as T;
}

export const api = {
  list: () => request<PostDoc[]>(""),
  save: (doc: PostDoc) => request<{ ok: true }>(`/${doc.id}`, { method: "PUT", body: JSON.stringify(doc) }),
  remove: (id: string) => request<{ ok: true }>(`/${id}`, { method: "DELETE" }),
  export: (id: string, format: string) => request<{ files: string[] }>(`/${id}/export?format=${encodeURIComponent(format)}`, { method: "POST" }),
  exportLayers: (id: string, format: string, frame: string, layers: string[]) =>
    request<{ files: string[] }>(`/${id}/export?format=${encodeURIComponent(format)}&frame=${encodeURIComponent(frame)}&layers=${encodeURIComponent(layers.join(","))}`, { method: "POST" }),
};

type DirHandle = {
  name: string;
  getDirectoryHandle: (name: string, opts: { create: boolean }) => Promise<DirHandle>;
  getFileHandle: (name: string, opts: { create: boolean }) => Promise<{ createWritable: () => Promise<{ write: (data: Blob) => Promise<void>; close: () => Promise<void> }> }>;
};

type DirPicker = (opts: { id?: string; mode?: "readwrite" }) => Promise<DirHandle>;

export function pickExportFolder(): Promise<DirHandle | null> | null {
  const picker = (window as unknown as { showDirectoryPicker?: DirPicker }).showDirectoryPicker;
  if (!picker) return null;
  return picker({ id: "vm-posts-export", mode: "readwrite" }).catch((error: unknown) => {
    if (error instanceof DOMException && error.name === "AbortError") return null;
    throw error;
  });
}

async function fetchExport(file: string): Promise<Blob> {
  const res = await fetch(`/repo-export/${file.replace(/^\/?posts\/export\//, "")}`);
  if (!res.ok) throw new Error(`não achei ${file}`);
  return res.blob();
}

export async function saveExport(files: string[], folder: string, dir: DirHandle | null): Promise<string> {
  if (dir) {
    const sub = await dir.getDirectoryHandle(folder, { create: true });
    for (const file of files) {
      const handle = await sub.getFileHandle(file.split("/").pop()!, { create: true });
      const out = await handle.createWritable();
      await out.write(await fetchExport(file));
      await out.close();
    }
    return `${dir.name}/${folder}`;
  }
  for (const file of files) {
    const url = URL.createObjectURL(await fetchExport(file));
    const a = Object.assign(document.createElement("a"), { href: url, download: `${folder}-${file.split("/").pop()}` });
    a.click();
    URL.revokeObjectURL(url);
  }
  return "Downloads";
}

export type SaveState = "idle" | "saving" | "saved" | "error";

export function usePosts() {
  const [docs, setDocs] = React.useState<PostDoc[] | null>(null);
  const [save, setSave] = React.useState<SaveState>("idle");
  const pending = React.useRef(new Map<string, PostDoc>());
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    api
      .list()
      .then(setDocs)
      .catch(() => setDocs([]));
  }, []);

  React.useEffect(() => {
    const hot = import.meta.hot;
    if (!hot) return;
    const onChange = ({ id, doc }: { id: string; doc: PostDoc | null }) => {
      pending.current.delete(id);
      setDocs((list) => {
        const rest = (list ?? []).filter((d) => d.id !== id);
        return doc ? [...rest, doc] : rest;
      });
    };
    hot.on("studio:post", onChange);
    return () => hot.off("studio:post", onChange);
  }, []);

  const flush = React.useCallback(async () => {
    const batch = [...pending.current.values()];
    pending.current.clear();
    if (!batch.length) return;
    setSave("saving");
    try {
      await Promise.all(batch.map(api.save));
      setSave("saved");
    } catch {
      setSave("error");
    }
  }, []);

  const put = React.useCallback(
    (doc: PostDoc) => {
      const next = { ...doc, updatedAt: new Date().toISOString() };
      setDocs((list) => {
        const rest = (list ?? []).filter((d) => d.id !== next.id);
        return [...rest, next];
      });
      pending.current.set(next.id, next);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, 500);
    },
    [flush],
  );

  const remove = React.useCallback(async (id: string) => {
    pending.current.delete(id);
    setDocs((list) => (list ?? []).filter((d) => d.id !== id));
    await api.remove(id);
  }, []);

  React.useEffect(() => () => void flush(), [flush]);

  return { docs, put, remove, save, flush };
}
