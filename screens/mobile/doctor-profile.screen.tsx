import { DoctorPublicProfileScreen } from '~/components/doctor/DoctorPublicProfileScreen';
import { shiftDay } from '~/lib/format/date';

import { anaCompany, profileQueries, profileQueries99, tomorrow, today } from '@screens/fixtures/agendamento';

export const meta = { title: 'Perfil do médico', route: '(client)/doctor/[id]' };

const base = { user: anaCompany, queries: profileQueries, props: { id: 'doc-rafael', specialtyParam: 'Cardiologia', dateParam: shiftDay(today, 2) } };
const day = String(Number(tomorrow.slice(8)));

export const states = {
  default: base,
  day: { ...base, press: [day] },
  'day-tarde': { ...base, press: [day, 'Tarde, 5 horários'] },
  slot: { ...base, press: [day, 'Tarde, 5 horários', '14:30'] },
  'preco-default': { ...base, queries: profileQueries99 },
  'preco-day': { ...base, queries: profileQueries99, press: [day] },
  'preco-day-tarde': { ...base, queries: profileQueries99, press: [day, 'Tarde, 5 horários'] },
  'preco-slot': { ...base, queries: profileQueries99, press: [day, 'Tarde, 5 horários', '14:30'] },
};

export default DoctorPublicProfileScreen;
