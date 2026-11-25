export type Platform = "web" | "mobile";

export type FrameState = { platform: Platform; mode: "light" | "dark"; group: string; entry: string };

export type CatalogItem = { id: string; name: string; group: string; count: number };

export type FrameMessage =
  | { type: "frame:catalog"; entries: CatalogItem[] }
  | { type: "frame:size"; height: number }
  | {
      type: "frame:wheel";
      deltaX: number;
      deltaY: number;
      ctrlKey: boolean;
      metaKey: boolean;
      clientX: number;
      clientY: number;
    };

export function postToParent(message: FrameMessage) {
  window.parent.postMessage(message, window.location.origin);
}
