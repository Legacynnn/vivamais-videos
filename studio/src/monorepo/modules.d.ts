declare module "@vivamais/web-ui/theme" {
  import type { ReactNode, JSX } from "react";
  export function ThemeProvider(props: { mode?: "light" | "dark" | "system"; children: ReactNode }): JSX.Element;
}
