import * as React from "react";
import { ThemeProvider } from "@vivamais/web-ui/theme";
import { catalog, type Entry } from "./stories";
import { matches, useFrameBridge } from "./bridge";
import "./frame.css";

class Boundary extends React.Component<{ children: React.ReactNode }, { error?: Error }> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return <div className="text-[12px] text-red-500">Erro ao renderizar: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

const items = catalog.map(({ id, name, group, stories }) => ({ id, name, group, count: stories.length }));

function EntryBlock({ entry, mode }: { entry: Entry; mode: string }) {
  return (
    <section className="flex flex-col gap-4" id={entry.id}>
      <header className="flex items-baseline gap-3">
        <h2 className="m-0 font-display text-[22px] font-medium tracking-[-0.01em] text-foreground">{entry.name}</h2>
        <span className="font-mono text-[12px] text-muted-foreground">{entry.title}</span>
      </header>
      <div className="grid grid-cols-2 gap-4">
        {entry.stories.map((story) => (
          <div key={story.id} className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-card ring-1 ring-border">
            <div className="flex h-9 items-center border-b border-border px-4 text-[12px] font-medium text-muted-foreground">
              {story.name}
            </div>
            <div className="flex min-h-40 flex-1 items-center justify-center overflow-auto p-8">
              <Boundary>{story.render(mode)}</Boundary>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function WebFrame() {
  const state = useFrameBridge(items);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", state.mode === "dark");
  }, [state.mode]);

  return (
    <ThemeProvider mode={state.mode}>
      <div className={state.mode === "dark" ? "dark" : undefined}>
        <main className="flex flex-col gap-14 bg-background p-14">
          {catalog
            .filter((entry) => matches(state, entry))
            .map((entry) => (
              <EntryBlock key={entry.id} entry={entry} mode={state.mode} />
            ))}
        </main>
      </div>
    </ThemeProvider>
  );
}
