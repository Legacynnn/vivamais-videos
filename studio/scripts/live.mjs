import { existsSync, mkdirSync, readFileSync, watch } from "node:fs";
import { basename, dirname, join } from "node:path";

function watchDir(server, dir, filter, onChange) {
  mkdirSync(dir, { recursive: true });
  const timers = new Map();
  const watcher = watch(dir, (_, name) => {
    if (!name || !filter(name)) return;
    clearTimeout(timers.get(name));
    timers.set(
      name,
      setTimeout(() => {
        timers.delete(name);
        const file = join(dir, name);
        let text = null;
        try {
          if (existsSync(file)) text = readFileSync(file, "utf8");
        } catch {
          return;
        }
        onChange(name, text);
      }, 120),
    );
  });
  server.httpServer?.once("close", () => watcher.close());
}

function broadcast(server, event, data) {
  if (data !== undefined) server.ws.send({ type: "custom", event, data });
}

export function watchFile(server, file, event, toData) {
  watchDir(server, dirname(file), (name) => name === basename(file), (_, text) => {
    if (text === null) return;
    try {
      broadcast(server, event, toData(text));
    } catch {
      return;
    }
  });
}

export function watchJsonDir(server, dir, event, toData) {
  watchDir(server, dir, (name) => name.endsWith(".json"), (name, text) => {
    try {
      broadcast(server, event, toData(name.slice(0, -5), text));
    } catch {
      return;
    }
  });
}
