import { PlantaoPayScreen } from '~/components/plantao/PlantaoPayScreen';

import { states as checkout } from '@screens/mobile/plantao-checkout.screen';

export const meta = { title: 'Pagamento do plantão', route: '(client)/plantao/pay' };

const { user, queries } = checkout.default;

export const states = {
  credit: { user, queries, props: { channel: 'video', method: 'company_credit' } },
};

export default PlantaoPayScreen;
