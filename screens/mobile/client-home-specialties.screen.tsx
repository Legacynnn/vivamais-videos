import { HomeScreen } from '~/components/home/HomeScreen';

import { specialtyList } from '@screens/fixtures/agendamento';
import { patientQueries } from '@screens/fixtures/patient';

export const meta = { title: 'Início com especialidades', route: '(client)/(tabs)/index' };

const queries = [{ key: ['specialties'], data: specialtyList }, ...patientQueries.filter((entry) => entry.key[0] !== 'specialties')];

export const states = {
  default: { user: patientQueries[0].data, queries },
};

export default HomeScreen;
