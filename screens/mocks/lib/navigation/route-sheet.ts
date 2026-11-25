import { useEffect, useSyncExternalStore } from 'react';

interface RouteSheetRequest {
  onClose: () => void;
}

export function createRouteSheet<Request extends RouteSheetRequest>(_href: unknown) {
  let request: Request | null = null;
  const subscribers = new Set<() => void>();
  const set = (next: Request | null) => {
    request = next;
    subscribers.forEach((notify) => notify());
  };

  const close = () => {
    const last = request;
    if (!last) return;
    set(null);
    last.onClose();
  };

  function useOpener(visible: boolean, next: Request) {
    useEffect(() => {
      if (!visible) {
        if (request) set(null);
        return;
      }
      const onApply = (next as unknown as { onApply?: (...args: unknown[]) => void }).onApply;
      const wasOpen = request !== null;
      const value = {
        ...next,
        ...(onApply ? { onApply: (...args: unknown[]) => { onApply(...args); close(); } } : {}),
      };
      if (wasOpen) Object.assign(request as Request, value);
      else set(value as Request);
    });
  }

  function useRequest(): Request | null {
    return useSyncExternalStore(
      (notify) => {
        subscribers.add(notify);
        return () => subscribers.delete(notify);
      },
      () => request,
    );
  }

  return { useOpener, useRequest, closeQuietly: () => set(null) };
}
