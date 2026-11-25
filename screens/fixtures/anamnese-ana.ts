import { plantaoAnamnese } from '@screens/fixtures/helena';
import { anaCompany, anaCompanyQueries } from '@screens/fixtures/ana-company';

const consultation = {
  id: 'consult-ana',
  status: 'scheduled',
  source: 'scheduled',
  consultation_type: 'online',
  consultation_channel: 'online_room',
  status_payement: true,
  is_reconsulta: false,
  medical_record: null,
  consultation_date: '2026-11-24T14:30:00-03:00',
  doctor: 'doc-rafael',
  doctor_name: 'Dr. Rafael Menezes',
  doctor_register_label: 'CRM',
  specialty_name: 'Cardiologia',
  patient: 'profile-ana',
  patient_name: 'Ana Souza',
};

export const anaAnamnese = {
  ...plantaoAnamnese,
  id: 'resp-ana',
  consultation: 'consult-ana',
  patient_queue: null,
  form: { id: 'form-pre', title: 'Anamnese' },
  form_version: 'form-pre-v1',
  answers: { ...plantaoAnamnese.answers, dor: { ...plantaoAnamnese.answers.dor, level: 4 }, alergias: false, remedios: false },
};

export const anamneseQueries = [
  { key: ['/consultations/anamnese-responses/resp-ana/'], data: anaAnamnese },
  { key: ['/consultations/anamnese-responses/'], data: { count: 0, next: null, previous: null, results: [] } },
  { key: ['/consultations/consultations/consult-ana/'], data: consultation },
  ...anaCompanyQueries,
];

export { anaCompany };
