import { PlantaoSuccessScreen } from '~/components/plantao/PlantaoSuccessScreen';

import { ana, patientQueries } from '@screens/fixtures/patient';

export const meta = { title: 'Plantão confirmado', route: '(client)/plantao/success' };

export const states = {
  default: { user: ana, queries: patientQueries, props: { channel: 'video', paymentId: 'pay-ana', consultationId: 'consult-ana' } },
};

export default PlantaoSuccessScreen;
