import { PlantaoCheckoutScreen } from '~/components/plantao/PlantaoCheckoutScreen';

import { ana, patientQueries } from '@screens/fixtures/patient';

export const meta = { title: 'Checkout do plantão', route: '(client)/plantao/checkout' };

const user = { ...ana, profile: { ...ana.profile, credit: { is_active: true, monthly_limit: '300.00', used_amount: '0.00' } } };

const quote = {
  base_amount: 79.9,
  price: 79.9,
  plan_price: 59.9,
  discount_source: 'benefit',
  discount_label: 'Desconto do plano Viva+',
  discount_amount: 20,
  subtotal_after_discount: 59.9,
  wallet_amount_applied: 0,
  remaining_amount: 59.9,
  applied_coupon: null,
  applied_benefit: null,
  messages: [],
};

const checkout = (press: string[] = []) => ({
  user,
  queries: [{ key: ['userProfile'], data: user }, ...patientQueries.slice(1), { key: ['checkout-quote', 'consultation'], data: quote }],
  props: { channel: 'video' },
  press,
});

export const states = { default: checkout(), credit: checkout(['Crédito da empresa']) };

export default PlantaoCheckoutScreen;
