import * as React from "react";
import { createRoot } from "react-dom/client";
import "../styles.css";
import { FORMAT_BY_ID, frameSize, sliceCount } from "./formats";
import type { Override, PostDoc } from "./model";
import { FrameView } from "./render";

declare global {
  interface Window {
    __postReady?: boolean;
  }
}

function RenderPage({ doc, formatId, frameId, layerIds }: { doc: PostDoc; formatId: string; frameId?: string; layerIds?: string[] }) {
  const format = FORMAT_BY_ID[formatId] ?? FORMAT_BY_ID[doc.format];
  const size = frameSize(format, doc.base);
  const overrides = format.id === doc.format ? undefined : (doc.overrides?.[format.id] as Record<string, Override> | undefined);
  const all = (doc.kind ?? "post") === "post" ? doc.frames.slice(0, 1) : doc.frames;
  const frames = layerIds
    ? all
        .filter((f) => f.id === frameId)
        .map((f) => ({ ...f, background: "transparent", layers: f.layers.filter((l) => layerIds.includes(l.id) || (l.type === "screen" && layerIds.includes(l.photo))) }))
    : all;

  React.useEffect(() => {
    const images = [...document.images].map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => undefined)));
    Promise.all([document.fonts.ready, ...images]).then(() => {
      window.__postReady = true;
    });
  }, []);

  return (
    <div className="flex flex-col items-start">
      {frames.map((frame) => (
        <div key={frame.id} data-frame={frame.id} data-slices={sliceCount(format, size.width)}>
          <FrameView frame={frame} width={size.width} height={size.height} base={doc.base} overrides={overrides} />
        </div>
      ))}
    </div>
  );
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id") ?? "";
const layerIds = params.get("layers")?.split(",").filter(Boolean);
if (layerIds) {
  document.documentElement.style.background = "transparent";
  document.body.style.background = "transparent";
}
const doc = (await fetch(`/api/posts/${encodeURIComponent(id)}`).then((r) => r.json())) as PostDoc;
createRoot(document.getElementById("root")!).render(<RenderPage doc={doc} formatId={params.get("format") ?? doc.format} frameId={params.get("frame") ?? undefined} layerIds={layerIds} />);
