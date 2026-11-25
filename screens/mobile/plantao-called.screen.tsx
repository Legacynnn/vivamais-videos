import { PlantaoQueueScreen } from '~/components/plantao/PlantaoQueueScreen';

import { camila, helena, helenaQueries } from '@screens/fixtures/helena';

export const meta = { title: 'Médico chamou', route: '(client)/plantao/queue' };

const doctor = { name: camila.name, avatarUrl: camila.photo, crm: camila.crm, specialty: camila.specialty };

const called = (queueStatus: 'matched' | 'in_progress') => ({
  user: helena,
  queries: helenaQueries,
  devicesTested: true,
  queue: { connectionStatus: 'connected', queueStatus, queueId: 'queue-helena', paymentId: 'pay-helena', consultationId: 'consult-helena', hasAnamnese: true, matchedDoctor: doctor, matchedDoctorName: doctor.name, doctorsOnShift: 3 },
  props: { consultationId: 'consult-helena', paymentId: 'pay-helena' },
});

export const states = { reading: called('matched'), calling: called('in_progress') };

export default PlantaoQueueScreen;
