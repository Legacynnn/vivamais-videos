import * as React from "react";

export type Reference = {
  id: string;
  kind: "image" | "link" | "post" | "carousel" | "video";
  title: string;
  note: string;
  tags: string[];
  src?: string;
  media?: string[];
  url?: string;
  source?: string;
  createdAt: string;
};

export type NewReference = {
  kind?: Reference["kind"];
  title?: string;
  note?: string;
  tags?: string[];
  data?: string;
  media?: string[];
  url?: string;
  source?: string;
  fromFile?: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/references${path}`, { headers: { "Content-Type": "application/json" }, ...init });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? res.statusText);
  return body as T;
}

export const referencesApi = {
  list: () => request<Reference[]>(""),
  create: (item: NewReference) => request<Reference>("", { method: "POST", body: JSON.stringify(item) }),
  update: (id: string, patch: Partial<Pick<Reference, "title" | "note" | "tags" | "url">>) =>
    request<Reference>(`/${id}`, { method: "PUT", body: JSON.stringify(patch) }),
  remove: (id: string) => request<{ ok: true }>(`/${id}`, { method: "DELETE" }),
};

export const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

export const mediaOf = (item: Reference) => item.media ?? (item.src ? [item.src] : []);

export const mediaUrl = (src: string) => `/references-media/${src.replace(/^references\/media\//, "")}`;

export const STARTER_TAGS = ["carrossel", "post", "story", "foto", "tipografia", "cor", "layout", "ilustração", "motion", "concorrente"];

export function useReferences() {
  const [items, setItems] = React.useState<Reference[] | null>(null);
  const [busy, setBusy] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    referencesApi
      .list()
      .then(setItems)
      .catch((e) => {
        setItems([]);
        setError(e instanceof Error ? e.message : String(e));
      });
  }, []);

  React.useEffect(() => {
    const hot = import.meta.hot;
    if (!hot) return;
    const onChange = ({ items: next }: { items: Reference[] }) => setItems(next);
    hot.on("studio:references", onChange);
    return () => hot.off("studio:references", onChange);
  }, []);

  const add = React.useCallback(async (input: NewReference) => {
    setBusy((n) => n + 1);
    setError(null);
    try {
      const made = await referencesApi.create(input);
      setItems((list) => [made, ...(list ?? [])]);
      return made;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return undefined;
    } finally {
      setBusy((n) => n - 1);
    }
  }, []);

  const update = React.useCallback(async (id: string, patch: Partial<Pick<Reference, "title" | "note" | "tags" | "url">>) => {
    setItems((list) => (list ?? []).map((i) => (i.id === id ? { ...i, ...patch } : i)));
    try {
      await referencesApi.update(id, patch);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const remove = React.useCallback(async (id: string) => {
    setItems((list) => (list ?? []).filter((i) => i.id !== id));
    try {
      await referencesApi.remove(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  return { items, add, update, remove, busy: busy > 0, error };
}
