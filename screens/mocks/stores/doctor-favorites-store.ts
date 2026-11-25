const state = { ids: new Set<string>(), toggle: (_id: string) => {}, hydrate: async () => {} };

export const useDoctorFavoritesStore = Object.assign(<T>(selector: (value: typeof state) => T) => selector(state), {
  getState: () => state,
  setState: () => {},
  subscribe: () => () => {},
});
