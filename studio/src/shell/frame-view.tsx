import * as React from "react";
import type { CatalogItem, FrameMessage, FrameState } from "@/frame/protocol";
import { ZoomContext } from "./workspace";

export function FrameView({
  state,
  onCatalog,
  onHeight,
}: {
  state: FrameState;
  onCatalog?: (entries: CatalogItem[]) => void;
  onHeight?: (height: number) => void;
}) {
  const iframe = React.useRef<HTMLIFrameElement>(null);
  const zoom = React.useContext(ZoomContext);
  const zoomRef = React.useRef(zoom);
  zoomRef.current = zoom;
  const initial = React.useRef(state);
  const callbacks = React.useRef({ onCatalog, onHeight });
  callbacks.current = { onCatalog, onHeight };

  const src = React.useMemo(() => {
    const params = new URLSearchParams(initial.current as Record<string, string>);
    return `${import.meta.env.BASE_URL}frame.html?${params}`;
  }, []);

  React.useEffect(() => {
    iframe.current?.contentWindow?.postMessage({ type: "frame:set", state }, window.location.origin);
  }, [state]);

  React.useEffect(() => {
    function onMessage(event: MessageEvent<FrameMessage>) {
      const el = iframe.current;
      if (!el || event.source !== el.contentWindow) return;
      const message = event.data;
      if (message.type === "frame:catalog") callbacks.current.onCatalog?.(message.entries);
      if (message.type === "frame:size") callbacks.current.onHeight?.(message.height);
      if (message.type === "frame:wheel") {
        const rect = el.getBoundingClientRect();
        el.dispatchEvent(
          new WheelEvent("wheel", {
            bubbles: true,
            cancelable: true,
            deltaX: message.deltaX,
            deltaY: message.deltaY,
            ctrlKey: message.ctrlKey,
            metaKey: message.metaKey,
            clientX: rect.left + message.clientX * zoomRef.current,
            clientY: rect.top + message.clientY * zoomRef.current,
          }),
        );
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return <iframe ref={iframe} src={src} title="Viva Mais UI" className="block size-full border-0" />;
}
