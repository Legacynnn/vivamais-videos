import { ana, patientQueries } from '@screens/fixtures/patient';

const specialties = (names: string[]) => names.map((name, i) => ({ id: `spec-${i + 1}`, name }));

const benefit = (id: string, type: string, extra: Record<string, unknown>) => ({
  id,
  benefit_id: id,
  name: '',
  type,
  unlimited: false,
  specialties: [],
  free_consultation: false,
  consultation_price: null,
  discount_value: null,
  available_quantity: 0,
  used_quantity: 0,
  description: '',
  can_use: true,
  ...extra,
});

const benefits = [
  benefit('b-especialistas', 'DISCOUNT_CONSULTATIONS', { name: 'Especialistas', discount_value: '25', unlimited: true, specialties: specialties(['Cardiologia', 'Dermatologia', 'Pediatria', 'Ginecologia', 'Ortopedia', 'Psicologia']) }),
  benefit('b-ia', 'AI_CHAT_MESSAGING', { unlimited: true }),
  benefit('b-farmacia', 'DISCOUNT_PHARMACIES', { discount_value: '35', unlimited: true }),
];

const plan = { id: 'plan-empresarial', title: 'Viva+ Empresarial', type: 'COMPANY', features: [] };

export const anaCompany = {
  ...ana,
  profile: {
    ...ana.profile,
    is_company_employee: true,
    company_plan: { plan, status: 'ACTIVE', start_date: '2026-09-29', end_date: null, beneficiary: 'Ana Souza', scheduled_change: null },
    credit: { is_active: true, monthly_limit: '300.00', used_amount: '0.00', employee_full_name: null },
    signature: {
      id: 'sig-empresarial',
      is_active: true,
      status: 'ACTIVE',
      canceled: false,
      cancellation_requested: false,
      payment_date: '2026-10-29',
      expiration_date: null,
      signature_type: { id: 'plan-empresarial', title: 'Viva+ Empresarial', audience: 'COMPANY', is_free: false, benefits },
    },
  },
};

export const anaCompanyQueries = [{ key: ['userProfile'], data: anaCompany }, ...patientQueries.slice(1)];
