import * as React from "react";
import { Panel, PanelSection, Segmented, Select } from "@/ui";
import type { CatalogItem, FrameState, Platform } from "@/frame/protocol";
import { FrameView } from "@/shell/frame-view";
import { Workspace } from "@/shell/workspace";

const GROUP_LABELS: Record<string, string> = {
  Actions: "Ações",
  Charts: "Gráficos",
  Content: "Conteúdo",
  Data: "Dados",
  Editor: "Editor",
  Feedback: "Feedback",
  Forms: "Formulários",
  Layout: "Layout",
  Navigation: "Navegação",
  Overlays: "Sobreposições",
};

const SETUP: Record<Platform, { title: string; source: string; defaults: FrameState }> = {
  web: {
    title: "UI web",
    source: "@vivamais/web-ui (apps/web, apps/admin)",
    defaults: { platform: "web", mode: "light", group: "Actions", entry: "" },
  },
  mobile: {
    title: "UI mobile",
    source: "apps/mobile/src/components (via screens/)",
    defaults: { platform: "mobile", mode: "light", group: "Componentes", entry: "" },
  },
};

function KitPage({ platform }: { platform: Platform }) {
  const setup = SETUP[platform];
  const [state, setState] = React.useState<FrameState>(setup.defaults);
  const [catalog, setCatalog] = React.useState<CatalogItem[]>([]);
  const [height, setHeight] = React.useState(1200);

  const groups = [...new Set(catalog.map((e) => e.group))];
  const inGroup = catalog.filter((e) => e.group === state.group);
  const current = catalog.find((e) => e.id === state.entry);
  const unit = platform === "web" ? "componentes" : "itens";
  const label = `${setup.title} · ${current ? current.name : (GROUP_LABELS[state.group] ?? state.group)}`;

  const panel = (
    <Panel title={setup.title} onResetControls={() => setState(setup.defaults)} className="max-h-full">
      {platform === "web" ? (
        <PanelSection title="Tema">
          <Segmented
            name="Modo"
            value={state.mode}
            onValueChange={(mode) => setState((s) => ({ ...s, mode: mode as FrameState["mode"] }))}
            options={[
              { label: "Claro", value: "light" },
              { label: "Escuro", value: "dark" },
            ]}
          />
        </PanelSection>
      ) : null}
      <PanelSection title="Catálogo" description={`${catalog.length} ${unit} de ${setup.source}`}>
        <Select
          name="Categoria"
          value={state.group}
          onValueChange={(group) => setState((s) => ({ ...s, group, entry: "" }))}
          options={groups.map((g) => ({ label: GROUP_LABELS[g] ?? g, value: g }))}
        />
        <Select
          name={platform === "web" ? "Componente" : "Item"}
          value={state.entry || "all"}
          onValueChange={(entry) => setState((s) => ({ ...s, entry: entry === "all" ? "" : entry }))}
          options={[
            { label: `Todos (${inGroup.length})`, value: "all" },
            ...inGroup.map((e) => ({ label: `${e.name} · ${e.count}`, value: e.id })),
          ]}
        />
      </PanelSection>
    </Panel>
  );

  return (
    <Workspace artboard={{ width: 1440, height, label }} panel={panel} fitMode="width">
      <FrameView state={state} onCatalog={setCatalog} onHeight={setHeight} />
    </Workspace>
  );
}

export function WebKitPage() {
  return <KitPage platform="web" />;
}

export function MobileKitPage() {
  return <KitPage platform="mobile" />;
}
