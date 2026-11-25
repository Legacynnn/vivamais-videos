import { createRoot } from "react-dom/client";
import { readInitial } from "./bridge";

const root = createRoot(document.getElementById("root")!);

if (readInitial().platform === "mobile") {
  const { MobileFrame } = await import("./mobile");
  root.render(<MobileFrame />);
} else {
  const { WebFrame } = await import("./web");
  root.render(<WebFrame />);
}
