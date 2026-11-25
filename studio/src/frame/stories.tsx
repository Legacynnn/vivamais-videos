import * as React from "react";

type Args = Record<string, unknown>;
type Ctx = { args: Args; globals: { mode: string }; parameters: Record<string, unknown> };
type StoryFn = (args: Args, ctx: Ctx) => React.ReactNode;
type Decorator = (Story: React.ComponentType, ctx: Ctx) => React.ReactNode;
type StoryObj = { name?: string; args?: Args; render?: StoryFn; decorators?: Decorator[]; parameters?: Record<string, unknown> };
type Meta = { title?: string; component?: React.ComponentType<Args>; args?: Args; render?: StoryFn; decorators?: Decorator[]; parameters?: Record<string, unknown> };
type StoryModule = { default: Meta } & Record<string, unknown>;

export type Story = { id: string; name: string; render: (mode: string) => React.ReactNode };
export type Entry = { id: string; title: string; group: string; name: string; stories: Story[] };

const modules = import.meta.glob<StoryModule>(
  [
    "../../../.monorepo/packages/web-ui/src/primitives/*.stories.tsx",
    "../../../.monorepo/packages/web-ui/src/foundations/{SampleScreen,Surfaces}.stories.tsx",
  ],
  { eager: true },
);

const FIRST = ["Primary", "Default", "Playground", "Basic", "Overview"];

function rank(key: string): number {
  const index = FIRST.indexOf(key);
  return index === -1 ? FIRST.length : index;
}

function storyName(key: string, story: StoryObj): string {
  if (story.name) return story.name;
  return key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

function toStory(meta: Meta, key: string, raw: unknown, entryId: string): Story {
  const story: StoryObj = typeof raw === "function" ? { render: raw as StoryFn } : (raw as StoryObj);
  const args = { ...meta.args, ...story.args };
  const parameters = { ...meta.parameters, ...story.parameters };
  const render = story.render ?? meta.render ?? ((a: Args) => (meta.component ? <meta.component {...a} /> : null));
  const decorators = [...(story.decorators ?? []), ...(meta.decorators ?? [])];

  return {
    id: `${entryId}--${key}`,
    name: storyName(key, story),
    render: (mode) => {
      const ctx: Ctx = { args, globals: { mode }, parameters };
      const Base = () => <>{render(args, ctx)}</>;
      const Wrapped = decorators.reduce<React.ComponentType>(
        (Inner, decorator) => () => <>{decorator(Inner, ctx)}</>,
        Base,
      );
      return <Wrapped />;
    },
  };
}

export const catalog: Entry[] = Object.entries(modules)
  .map(([path, mod]) => {
    const meta = mod.default ?? {};
    const title = meta.title ?? path.split("/").pop()!.replace(".stories.tsx", "");
    const parts = title.split("/");
    const name = parts[parts.length - 1];
    const group = parts[0] === "Foundations" ? "Padrões" : parts.length > 2 ? parts[1] : "Actions";
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const stories = Object.entries(mod)
      .filter(([key]) => key !== "default" && key !== "__namedExportsOrder")
      .sort(([a], [b]) => rank(a) - rank(b))
      .map(([key, raw]) => toStory(meta, key, raw, id));
    return { id, title, group, name, stories };
  })
  .sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));
