import * as React from "react";
import { FocusContext } from "./shell/focus";
import {
  Browser,
  Cards,
  DeviceMobile,
  FilmSlate,
  BookmarksSimple,
  Palette,
  PresentationChart,
  Shapes,
  SquaresFour,
} from "@phosphor-icons/react";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle, TooltipProvider } from "@/ui";
import { NavPanel, type NavGroup } from "@/shell/nav-panel";
import { MobileKitPage, WebKitPage } from "@/pages/kit";
import { LibraryPage } from "@/posts/library-page";
import { ReferencesPage } from "@/references/page";
import { TokensPage } from "@/pages/tokens";

const GROUPS: NavGroup[] = [
  { label: "Marca", items: [{ id: "showcase", label: "Showcase", icon: <Shapes /> }] },
  {
    label: "Design system",
    items: [
      { id: "tokens", label: "Tokens", icon: <Palette />, ready: true },
      { id: "web", label: "UI web", icon: <Browser />, ready: true },
      { id: "mobile", label: "UI mobile", icon: <DeviceMobile />, ready: true },
    ],
  },
  {
    label: "Peças",
    items: [
      { id: "library", label: "Biblioteca", icon: <SquaresFour />, ready: true },
      { id: "cards", label: "Brand cards", icon: <Cards /> },
      { id: "deck", label: "Pitch deck", icon: <PresentationChart /> },
    ],
  },
  { label: "Inspiração", items: [{ id: "references", label: "Referências", icon: <BookmarksSimple />, ready: true }] },
  { label: "Motion", items: [{ id: "videos", label: "Vídeos", icon: <FilmSlate /> }] },
];

const PAGES: Record<string, () => React.JSX.Element> = {
  tokens: TokensPage,
  web: WebKitPage,
  mobile: MobileKitPage,
  library: LibraryPage,
  references: ReferencesPage,
};

function readHash(): string {
  const id = window.location.hash.replace(/^#\/?/, "") || "tokens";
  return ["posts", "sequences", "covers"].includes(id) ? "library" : id;
}

export function App() {
  const [current, setCurrent] = React.useState(readHash);
  const [focus, setFocus] = React.useState(false);

  React.useEffect(() => {
    const onHash = () => setCurrent(readHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const Page = PAGES[current];
  const label = GROUPS.flatMap((g) => g.items).find((i) => i.id === current)?.label ?? current;

  return (
    <TooltipProvider>
      <FocusContext.Provider value={setFocus}>
      <div className="relative h-full">
        {Page ? (
          <Page key={current} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>{label}</EmptyTitle>
                <EmptyDescription>Ainda não construído. Próximos marcos do Studio.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}
        {focus ? null : (
          <div className="pointer-events-none absolute top-2.5 left-2.5">
            <NavPanel groups={GROUPS} current={current} onSelect={(id) => (window.location.hash = `/${id}`)} />
          </div>
        )}
      </div>
      </FocusContext.Provider>
    </TooltipProvider>
  );
}
