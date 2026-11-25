import marinaPhoto from '@screens/../assets/people/doctors/mariana.jpg';

import { ana } from '@screens/fixtures/patient';

const names = ['Clínico Geral', 'Psicologia', 'Dermatologia', 'Pediatria', 'Cardiologia', 'Ginecologia', 'Nutrição', 'Ortopedia', 'Neurologia'];

export const specialtiesPage = {
  count: names.length,
  next: null,
  previous: null,
  results: names.map((name, index) => ({ id: `spec-${index + 1}`, name })),
};

const tomorrowAt14 = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(14, 0, 0, 0);
  return date;
};

const consultationDate = tomorrowAt14();

export const nextConsultation = {
  id: 'consultation-marina',
  patient: ana.profile.id,
  doctor: 'doctor-marina',
  doctor_name: 'Dra. Marina Costa',
  specialty_name: 'Psicologia',
  selected_specialty_name: 'Psicologia',
  consultation_date: consultationDate.toISOString(),
  consultation_type: 'online',
  consultation_channel: 'video',
  status: 'scheduled',
  status_payement: true,
  source: 'scheduled',
  price: '180.00',
  doctor_avatar_url: marinaPhoto as string,
  anamnese: { id: 'anamnese-marina', status: 'submitted', prefilled_from: null },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const homeVideoQueries = [
  { key: ['userProfile'], data: ana },
  { key: ['specialties'], data: specialtiesPage },
  { key: ['consultations', ana.profile.id], data: [nextConsultation] },
  { key: ['/notifications/unread-count/'], data: { count: 2 } },
];
