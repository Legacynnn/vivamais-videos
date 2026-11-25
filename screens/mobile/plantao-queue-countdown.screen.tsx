import { PlantaoQueueScreen } from '~/components/plantao/PlantaoQueueScreen';

import { states as queue } from '@screens/mobile/plantao-queue.screen';

export const meta = { title: 'Fila do plantão · 2º', route: '(client)/plantao/queue' };

const base = queue['position-3'];

export const states = {
  'position-2': { ...base, queue: { ...base.queue, position: 2, estimatedWaitMinutes: 6 } },
};

export default PlantaoQueueScreen;
