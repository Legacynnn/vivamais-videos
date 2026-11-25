import { HomeScreen } from '~/components/home/HomeScreen';

import { homeVideoQueries } from '@screens/fixtures/home-video';
import { helena } from '@screens/fixtures/helena';
import { patientQueries } from '@screens/fixtures/patient';

export const meta = { title: 'Início do paciente', route: '(client)/(tabs)/index' };

export const states = {
  default: { user: patientQueries[0].data, queries: patientQueries },
  video: { user: patientQueries[0].data, queries: homeVideoQueries },
  helena: { user: helena, queries: [{ key: ['userProfile'], data: helena }, ...patientQueries.slice(1)] },
  empty: {},
};

export default HomeScreen;
