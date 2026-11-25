import * as React from "react";

export type Viewport = { zoom: number; x: number; y: number };

const MIN_ZOOM = 0.05;
const MAX_ZOOM = 8;
const STEPS = [0.05, 0.1, 0.15, 0.2, 0.25, 0.33, 0.5, 0.67, 0.75, 1, 1.5, 2, 3, 4, 6, 8];

function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

export function useViewport(
  container: React.RefObject<HTMLDivElement | null>,
  artboard: { width: number; height: number },
  fitMode: "contain" | "width" = "contain",
  fitKey?: string,
) {
  const [viewport, setViewport] = React.useState<Viewport>({ zoom: 1, x: 0, y: 0 });
  const spaceDown = React.useRef(false);
  const drag = React.useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const current = React.useRef(viewport);
  current.current = viewport;

  const size = React.useRef(artboard);
  size.current = artboard;

  const fit = React.useCallback(() => {
    const el = container.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    const board = size.current;
    if (fitMode === "width") {
      const zoom = Math.max(clampZoom(Math.min(1, (width - 720) / board.width)), 0.1);
      setViewport({ zoom, x: 0, y: 64 - height / 2 });
      return;
    }
    const zoom = Math.max(clampZoom(Math.min((width - 720) / board.width, (height - 160) / board.height)), 0.1);
    setViewport({ zoom, x: 0, y: (-board.height * zoom) / 2 });
  }, [container, fitMode]);

  const heightKey = fitMode === "width" ? 0 : artboard.height;
  React.useLayoutEffect(fit, [fit, artboard.width, heightKey, fitKey]);

  const zoomAt = React.useCallback((next: number, cx = 0, cy = 0) => {
    setViewport((v) => {
      const zoom = clampZoom(next);
      const k = zoom / v.zoom;
      return { zoom, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
    });
  }, []);

  const step = React.useCallback(
    (direction: 1 | -1) => {
      setViewport((v) => {
        const next =
          direction > 0
            ? (STEPS.find((s) => s > v.zoom + 0.001) ?? MAX_ZOOM)
            : ([...STEPS].reverse().find((s) => s < v.zoom - 0.001) ?? MIN_ZOOM);
        const k = next / v.zoom;
        return { zoom: next, x: v.x * k, y: v.y * k };
      });
    },
    [],
  );

  React.useEffect(() => {
    const el = container.current;
    if (!el) return;

    function centerOffset(event: { clientX: number; clientY: number }) {
      const rect = el!.getBoundingClientRect();
      return { cx: event.clientX - rect.left - rect.width / 2, cy: event.clientY - rect.top - rect.height / 2 };
    }

    function onWheel(event: WheelEvent) {
      if ((event.target as HTMLElement).closest("[data-panel-id]")) return;
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        const { cx, cy } = centerOffset(event);
        setViewport((v) => {
          const zoom = clampZoom(v.zoom * Math.exp(-event.deltaY * 0.01));
          const k = zoom / v.zoom;
          return { zoom, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
        });
      } else {
        setViewport((v) => ({ ...v, x: v.x - event.deltaX, y: v.y - event.deltaY }));
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      const typing = (event.target as HTMLElement).closest("input, textarea, [contenteditable]");
      if (event.code === "Space" && !typing) {
        spaceDown.current = true;
        el!.dataset.panning = "ready";
        event.preventDefault();
      }
      if (typing) return;
      if ((event.metaKey || event.ctrlKey) && (event.key === "=" || event.key === "+")) {
        event.preventDefault();
        step(1);
      }
      if ((event.metaKey || event.ctrlKey) && event.key === "-") {
        event.preventDefault();
        step(-1);
      }
      if (event.shiftKey && event.key === "!") fit();
      if ((event.metaKey || event.ctrlKey) && event.key === "0") {
        event.preventDefault();
        zoomAt(1);
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.code === "Space") {
        spaceDown.current = false;
        delete el!.dataset.panning;
      }
    }

    function onPointerDown(event: PointerEvent) {
      if ((event.target as HTMLElement).closest("[data-panel-id]")) return;
      if (!(spaceDown.current || event.button === 1)) return;
      event.preventDefault();
      el!.setPointerCapture(event.pointerId);
      el!.dataset.panning = "active";
      drag.current = { x: event.clientX, y: event.clientY, vx: current.current.x, vy: current.current.y };
    }

    function onPointerMove(event: PointerEvent) {
      const d = drag.current;
      if (!d) return;
      setViewport((v) => ({ ...v, x: d.vx + event.clientX - d.x, y: d.vy + event.clientY - d.y }));
    }

    function onPointerUp() {
      drag.current = null;
      if (el!.dataset.panning === "active") el!.dataset.panning = spaceDown.current ? "ready" : "";
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [container, fit, step, zoomAt]);

  return { viewport, fit, step, zoomAt, container };
}
