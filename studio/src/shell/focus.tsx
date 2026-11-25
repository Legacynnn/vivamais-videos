import * as React from "react";

export const FocusContext = React.createContext<(on: boolean) => void>(() => undefined);

export function useFocusMode() {
  const set = React.useContext(FocusContext);
  React.useEffect(() => {
    set(true);
    return () => set(false);
  }, [set]);
}
