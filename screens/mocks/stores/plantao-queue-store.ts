import { initialState, type ClientQueueState } from '~/lib/plantao/client-queue/types';

import { fixture } from '@screens/fixture';

const idle = async () => {};
const noop = () => {};

function state(): ClientQueueState {
  const data = { ...initialState, ...((fixture().queue as Partial<ClientQueueState> | undefined) ?? {}) };
  return new Proxy(data, {
    get: (target, key) => (key in target ? target[key as keyof typeof target] : typeof key === 'string' && /^(connect|check|rejoin|refund|convert|cancel|hydrate)/.test(key) ? idle : noop),
  }) as ClientQueueState;
}

export const usePlantaoQueueStore = Object.assign(<T>(selector: (value: ClientQueueState) => T) => selector(state()), {
  getState: state,
  setState: noop,
  subscribe: () => noop,
});
