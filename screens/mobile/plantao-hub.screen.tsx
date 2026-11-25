import { PlantaoTabScreen } from '~/components/plantao/PlantaoTabScreen';

import { helena, helenaQueries } from '@screens/fixtures/helena';

export const meta = { title: 'Plantão', route: '(client)/(tabs)/plantao' };

export const states = {
  video: { user: helena, queries: helenaQueries },
  chat: { user: helena, queries: helenaQueries, press: ['Chat'] },
};

export default PlantaoTabScreen;
