import type { AnamneseResponse } from '@vivamais/sdk/core/model';

import { fixture } from '@screens/fixture';

export type PlantaoAnamnesePhase = 'waiting' | 'timeout' | 'starting' | 'error' | 'ready';

export function usePlantaoAnamnese() {
  const response = (fixture().anamnese as AnamneseResponse | undefined) ?? null;
  const phase: PlantaoAnamnesePhase = response ? 'ready' : 'waiting';
  return { phase, queueId: 'queue-helena', response, error: null, retry: () => {} };
}
