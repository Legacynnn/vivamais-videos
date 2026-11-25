import { HealthProfileScreen } from '~/components/profile/HealthProfileScreen';

import { anaCompany, anaCompanyQueries } from '@screens/fixtures/ana-company';

export const meta = { title: 'Ficha de saúde', route: '(client)/health-profile' };

const ficha = {
  id: 'ficha-ana',
  client: 'profile-ana',
  weight: '61',
  height: '1.66',
  current_step: 4,
  is_completed: true,
  updated_at: '2026-10-02T09:00:00-03:00',
  created_at: '2026-09-30T09:00:00-03:00',
};

const page = (results: unknown[]) => ({ count: results.length, next: null, previous: null, results });

export const states = {
  default: {
    user: anaCompany,
    queries: [...anaCompanyQueries, { key: ['/patient-profile/health-profiles/'], data: page([ficha]) }, { key: ['/consultations/anamnese-responses/'], data: page([]) }, { key: ['/consultations/tracked-field-values/'], data: page([]) }],
  },
};

export default HealthProfileScreen;
