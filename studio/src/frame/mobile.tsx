import * as React from "react";
import { matches, useFrameBridge } from "./bridge";
import type { CatalogItem } from "./protocol";

type ManifestEntry = { title: string; route: string; states: string[] };

const manifests = import.meta.glob<Record<string, ManifestEntry>>("../../../screens/dist/manifest.json", {
  eager: true,
  import: "default",
});
const markup = import.meta.glob<string>("../../../screens/dist/assets/screens/html/*.html", {
  query: "?raw",
  import: "default",
});

const manifest = Object.values(manifests)[0] ?? {};
const isKit = (id: string) => id.startsWith("kit-");

const items: CatalogItem[] = Object.entries(manifest)
  .map(([id, entry]) => ({
    id,
    name: entry.title.replace(/^Kit · /, ""),
    group: isKit(id) ? "Componentes" : "Telas",
    count: entry.states.length,
  }))
  .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));

function loadMarkup(id: string, state: string, index: number): Promise<string> | undefined {
  const key = Object.keys(markup).find((path) => path.endsWith(`/${id}--${state}.html`));
  return key
    ? markup[key]().then((html) => html.replace(/\bid="([^"]+)"/g, (_, value) => `id="s${index}-${value}"`).replace(/url\(#/g, `url(#s${index}-`).replace(/href="#/g, `href="#s${index}-`))
    : undefined;
}

function Screen({ id, state, index, kit }: { id: string; state: string; index: number; kit: boolean }) {
  const [html, setHtml] = React.useState("");
  React.useEffect(() => {
    void loadMarkup(id, state, index)?.then(setHtml);
  }, [id, state, index]);
  return (
    <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 12, width: 402 }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#fff",
          width: 402,
          height: kit ? undefined : 874,
          minHeight: kit ? 200 : undefined,
          borderRadius: kit ? 28 : 54,
          boxShadow: "0 20px 50px rgba(53,14,111,.14), 0 0 0 1px rgba(23,21,30,.06)",
        }}
        data-kit={kit || undefined}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <figcaption style={{ fontSize: 13, lineHeight: "18px", color: "#726F80" }}>
        <b style={{ fontWeight: 500, color: "#17151E" }}>{manifest[id]?.title}</b> · {state}
      </figcaption>
    </figure>
  );
}

export function MobileFrame() {
  const state = useFrameBridge(items);

  React.useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "assets/screens/screens.css";
    const style = document.createElement("style");
    style.textContent = "[data-kit] > .vms { position: relative; inset: auto; }";
    document.head.append(link, style);
    document.body.style.cssText = "margin:0;background:#F3F4FA;font-family:'DM Sans',system-ui,sans-serif";
    return () => {
      link.remove();
      style.remove();
    };
  }, []);

  if (!items.length) {
    return (
      <main style={{ padding: 56, color: "#55525F", fontSize: 16 }}>
        Nenhuma tela gerada. Rode <code>pnpm run screens</code> na raiz do repo.
      </main>
    );
  }

  let index = 0;
  const visible = items.filter((entry) => matches(state, entry));
  return (
    <main style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 48, padding: 56 }}>
      {visible.flatMap((entry) =>
        manifest[entry.id].states.map((s) => (
          <Screen key={`${entry.id}--${s}`} id={entry.id} state={s} index={index++} kit={isKit(entry.id)} />
        )),
      )}
    </main>
  );
}
