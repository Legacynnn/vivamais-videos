import * as React from "react";
import { ArrowsInSimple, Minus, Plus } from "@phosphor-icons/react";
import { CanvasDotPattern, PanelIconButton, PanelSurface } from "@/ui";
import { useViewport } from "./use-viewport";

export const ZoomContext = React.createContext(1);

export type Artboard = { width: number; height: number; label: string };

export function Workspace({
  artboard,
  children,
  panel,
  fitMode,
  bare,
  toolbar,
  onBackgroundPointerDown,
  leftPanel,
}: {
  leftPanel?: React.ReactNode;
  onBackgroundPointerDown?: () => void;
  artboard: Artboard;
  children: React.ReactNode;
  panel?: React.ReactNode;
  fitMode?: "contain" | "width";
  bare?: boolean;
  toolbar?: React.ReactNode;
}) {
  const container = React.useRef<HTMLDivElement>(null);
  const { viewport, fit, step } = useViewport(container, artboard, fitMode, artboard.label);
  const { zoom, x, y } = viewport;

  return (
    <div
      ref={container}
      className="absolute inset-0 overflow-hidden"
      data-slot="studio-canvas"
      onPointerDown={(event) => {
        if (!onBackgroundPointerDown || event.button !== 0 || container.current?.dataset.panning) return;
        if ((event.target as HTMLElement).closest("[data-panel-id], [data-workspace-overlay]")) return;
        onBackgroundPointerDown();
      }}
    >
      <CanvasDotPattern offset={{ x, y }} scale={zoom} />
      <ZoomContext.Provider value={zoom}>
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          width: artboard.width,
          height: artboard.height,
          transformOrigin: "top center",
          transform: `translate(calc(-50% + ${x}px), ${y}px) scale(${zoom})`,
        }}
      >
        {bare ? (
          children
        ) : (
        <>
        <div
          className="pointer-events-none absolute bottom-full left-0 flex w-full justify-between pb-2 font-mono text-[12px] text-[color:color-mix(in_oklab,var(--foreground)_55%,transparent)] tabular-nums"
          style={{ transform: `scale(${1 / zoom})`, transformOrigin: "bottom left", width: artboard.width * zoom }}
        >
          <span>{artboard.label}</span>
          <span>
            {artboard.width} × {artboard.height}
          </span>
        </div>
        <div className="size-full overflow-hidden shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_8%,transparent),0_24px_80px_-24px_rgb(0_0_0/0.6)]">
          {children}
        </div>
        </>
        )}
      </div>
      </ZoomContext.Provider>

      {toolbar ? (
        <div data-workspace-overlay className="pointer-events-none absolute top-2.5 left-1/2 -translate-x-1/2">{toolbar}</div>
      ) : null}

      {leftPanel ? (
        <div data-workspace-overlay className="pointer-events-none absolute top-2.5 bottom-2.5 left-2.5 flex flex-col items-start">{leftPanel}</div>
      ) : null}

      {panel ? (
        <div data-workspace-overlay className="pointer-events-none absolute top-2.5 right-2.5 bottom-2.5 flex flex-col items-end">{panel}</div>
      ) : null}

      <div data-workspace-overlay className="pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2">
        <PanelSurface className="pointer-events-auto flex items-center gap-1.5 rounded-lg p-1" data-panel-id="toolbar">
          <PanelIconButton label="Diminuir zoom" onClick={() => step(-1)}>
            <Minus />
          </PanelIconButton>
          <span
            className="inline-flex h-7 w-[5ch] items-center justify-center font-mono text-[12px] text-[color:color-mix(in_oklab,var(--foreground)_90%,transparent)] tabular-nums select-none"
            onDoubleClick={fit}
          >
            {Math.round(zoom * 100)}%
          </span>
          <PanelIconButton label="Aumentar zoom" onClick={() => step(1)}>
            <Plus />
          </PanelIconButton>
          <span className="block h-5 w-px rounded-full bg-[color:color-mix(in_oklab,var(--border)_8%,transparent)]" />
          <PanelIconButton label="Ajustar à tela (⇧1)" onClick={fit}>
            <ArrowsInSimple />
          </PanelIconButton>
        </PanelSurface>
      </div>
    </div>
  );
}
