import { PlantaoQueueScreen } from '~/components/plantao/PlantaoQueueScreen';

import { helena, helenaQueries } from '@screens/fixtures/helena';

export const meta = { title: 'Fila do plantão', route: '(client)/plantao/queue' };

const queue = (position: number) => ({
  user: helena,
  queries: helenaQueries,
  queue: { connectionStatus: 'connected', queueStatus: 'waiting', queueId: 'queue-helena', paymentId: 'pay-helena', position, hasAnamnese: true, estimatedWaitMinutes: position * 3, doctorsOnShift: 3 },
  props: { consultationId: '', paymentId: 'pay-helena' },
});

export const states = { 'position-4': queue(4), 'position-3': queue(3), 'position-1': queue(1) };

export default PlantaoQueueScreen;
