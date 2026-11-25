export type GuidedRole = 'doctor' | 'client';

const state = { role: null as GuidedRole | null, setRole: (_role: GuidedRole | null) => {} };

export const useGuidedStore = Object.assign(<T>(selector: (value: typeof state) => T) => selector(state), {
  getState: () => state,
  setState: () => {},
  subscribe: () => () => {},
});
