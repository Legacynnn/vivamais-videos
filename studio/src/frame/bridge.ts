import * as React from "react";
import { postToParent, type CatalogItem, type FrameState } from "./protocol";

export function readInitial(): FrameState {
  const params = new URLSearchParams(window.location.search);
  return {
    platform: params.get("platform") === "mobile" ? "mobile" : "web",
    mode: params.get("mode") === "dark" ? "dark" : "light",
    group: params.get("group") ?? "",
    entry: params.get("entry") ?? "",
  };
}

export function useFrameBridge(catalog: CatalogItem[]) {
  const [state, setState] = React.useState<FrameState>(readInitial);

  React.useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.source !== window.parent || event.data?.type !== "frame:set") return;
      setState((s) => ({ ...s, ...event.data.state }));
    }
    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const { deltaX, deltaY, ctrlKey, metaKey, clientX, clientY } = event;
      postToParent({ type: "frame:wheel", deltaX, deltaY, ctrlKey, metaKey, clientX, clientY });
    }
    window.addEventListener("message", onMessage);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  React.useEffect(() => {
    postToParent({ type: "frame:catalog", entries: catalog });
  }, [catalog]);

  React.useLayoutEffect(() => {
    const report = () => postToParent({ type: "frame:size", height: document.body.scrollHeight });
    const observer = new ResizeObserver(report);
    observer.observe(document.body);
    report();
    return () => observer.disconnect();
  }, []);

  return state;
}

export function matches(state: FrameState, entry: { id: string; group: string }): boolean {
  return state.entry ? entry.id === state.entry : !state.group || entry.group === state.group;
}
