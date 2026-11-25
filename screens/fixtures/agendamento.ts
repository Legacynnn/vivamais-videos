import { shiftDay, toLocalISOString } from '~/lib/format/date';

import clinicaPhoto from '@screens/../assets/people/doctors/camila-rocha.jpg';
import beatrizPhoto from '@screens/../assets/people/doctors/camila.jpg';
import marianaPhoto from '@screens/../assets/people/doctors/mariana.jpg';
import rafaelPhoto from '@screens/../assets/people/doctors/rafael-hd.jpg';
import juliaPhoto from '@screens/../assets/people/doctors/julia.jpg';
import marcosPhoto from '@screens/../assets/people/doctors/d1.jpeg';

import { anaCompany, anaCompanyQueries } from '@screens/fixtures/ana-company';

export const today = toLocalISOString(new Date());
export const tomorrow = shiftDay(today, 1);

const stamp = '2026-01-10T10:00:00-03:00';

const catalog = {
  clinica: { id: 'cat-clinica', name: 'Clínica geral', icon: 'clinica-geral', council_acronym: 'CRM', description: '', can_prescribe: true, can_issue_certificate: true },
  cardio: { id: 'cat-cardio', name: 'Cardiologia', icon: 'cardiologia', council_acronym: 'CRM', description: '', can_prescribe: true, can_issue_certificate: true },
};

const brl = (value: number) => value.toFixed(2);

const specialty = (doctorId: string, kind: keyof typeof catalog, price: number, discount: boolean, rqe = '') => ({
  id: `ps-${doctorId}-${kind}`,
  partner: doctorId,
  specialty: catalog[kind],
  name: catalog[kind].name,
  rqe,
  categories: kind === 'cardio' ? [{ id: 'c1', name: 'Hipertensão' }, { id: 'c2', name: 'Check-up cardiológico' }] : [],
  has_custom_price: true,
  price: brl(price),
  plan_price: brl(discount ? price * 0.75 : price),
  vivamais_price: brl(price),
  vivamais_plan_price: brl(price),
  has_negotiated_vivamais_price: false,
  max_duration: '00:30:00',
  created_at: stamp,
  updated_at: stamp,
});

const slot = (date: string, time: string) => ({ start: `${date}T${time}:00-03:00`, date, time, specialty_id: '', partner_specialty_id: '', channel: 'online_room' });

interface DoctorSeed {
  id: string;
  name: string;
  kind: keyof typeof catalog;
  price: number;
  photo: string;
  register: string;
  rqe?: string;
  rating: number;
  count: number;
  next: { date: string; time: string };
  bio: string;
}

const seeds: DoctorSeed[] = [
  { id: 'doc-rafael', name: 'Dr. Rafael Menezes', kind: 'cardio', price: 320, photo: rafaelPhoto as string, register: 'CRM-SP 118204', rqe: '48213', rating: 4.9, count: 186, next: { date: tomorrow, time: '09:00' }, bio: 'Cardiologista com 14 anos de prática clínica. Atende hipertensão, arritmias, dor no peito e check-up cardiológico. Acompanha cada paciente com plano claro e retorno combinado.' },
  { id: 'doc-julia', name: 'Dra. Júlia Andrade', kind: 'cardio', price: 300, photo: juliaPhoto as string, register: 'CRM-SP 126771', rqe: '51877', rating: 4.8, count: 142, next: { date: tomorrow, time: '10:30' }, bio: 'Cardiologista focada em prevenção e saúde da mulher.' },
  { id: 'doc-marcos', name: 'Dr. Marcos Teixeira', kind: 'cardio', price: 360, photo: marcosPhoto as string, register: 'CRM-RJ 90412', rqe: '39920', rating: 4.7, count: 98, next: { date: tomorrow, time: '14:30' }, bio: 'Cardiologista com experiência em reabilitação e medicina do esporte.' },
  { id: 'doc-camila', name: 'Dra. Camila Rocha', kind: 'clinica', price: 120, photo: clinicaPhoto as string, register: 'CRM-SP 123456', rating: 4.9, count: 212, next: { date: today, time: '16:00' }, bio: 'Clínica geral com atendimento acolhedor e objetivo.' },
  { id: 'doc-beatriz', name: 'Dra. Beatriz Lima', kind: 'clinica', price: 110, photo: beatrizPhoto as string, register: 'CRM-MG 77310', rating: 4.8, count: 164, next: { date: tomorrow, time: '08:30' }, bio: 'Clínica geral e medicina preventiva.' },
  { id: 'doc-mariana', name: 'Dra. Mariana Costa', kind: 'clinica', price: 130, photo: marianaPhoto as string, register: 'CRM-SP 130552', rating: 4.7, count: 87, next: { date: tomorrow, time: '11:30' }, bio: 'Clínica geral com foco em check-ups.' },
];

export const card = (seed: DoctorSeed) => ({
  id: seed.id,
  type: 'DOCTOR',
  name: seed.name,
  bio: seed.bio,
  medical_register: seed.register,
  register_label: 'CRM',
  specialties: [specialty(seed.id, seed.kind, seed.price, seed.kind === 'cardio', seed.rqe)],
  attends_online: true,
  attends_presential: false,
  availabilities: null,
  avatar_url: seed.photo,
  average_rating: seed.rating,
  rating_count: seed.count,
  benefits_services: seed.kind === 'cardio' ? [{ id: `bs-${seed.id}`, benefit: 'b-especialistas', benefit_description: 'Desconto em especialistas' }] : [],
  accepts_chat_scheduling: true,
  video_duration_minutes: 30,
  chat_duration_minutes: 30,
  next_slot: slot(seed.next.date, seed.next.time),
});

const cardioSeeds = seeds.filter((seed) => seed.kind === 'cardio');
const clinicaSeeds = seeds.filter((seed) => seed.kind === 'clinica');

const page = (items: DoctorSeed[]) => ({ count: items.length, next: null, previous: null, results: items.map(card) });

export const specialtyList = {
  count: 8,
  next: null,
  previous: null,
  results: [
    { name: 'Clínica geral', icon: 'clinica-geral' },
    { name: 'Cardiologia', icon: 'cardiologia' },
    { name: 'Dermatologia', icon: 'dermatologia' },
    { name: 'Pediatria', icon: 'pediatria' },
    { name: 'Ginecologia', icon: 'ginecologia' },
    { name: 'Ortopedia', icon: 'ortopedia' },
    { name: 'Psicologia', icon: 'psicologia' },
    { name: 'Nutrição', icon: 'nutricao' },
  ],
};

// Ads show every specialist at the R$ 99,90 company price, down from R$ 120.
const promo = <T extends { specialties: { price: string; plan_price: string }[] }>(doctor: T): T => ({ ...doctor, specialties: doctor.specialties.map((s) => ({ ...s, price: '120.00', plan_price: '99.90' })) });

const base = [{ key: ['specialties'], data: specialtyList }, ...anaCompanyQueries.filter((entry) => entry.key[0] !== 'specialties')];

export const searchQueries = {
  loading: base,
  clinica: [...base, { key: ['doctor-search'], data: page(clinicaSeeds) }],
  cardio: [...base, { key: ['doctor-search'], data: page(cardioSeeds) }],
  cardio99: [...base, { key: ['doctor-search'], data: { ...page(cardioSeeds), results: page(cardioSeeds).results.map(promo) } }],
  cardioTomorrow: [...base, { key: ['doctor-search'], data: page(cardioSeeds.map((seed, index) => ({ ...seed, next: { date: tomorrow, time: ['09:00', '10:30', '14:30'][index] ?? '09:00' } }))) }],
};

export { anaCompany };

const rafael = seeds[0]!;

export const rafaelPartner = {
  ...card(rafael),
  user: { id: 'user-rafael', email: 'rafael.menezes@vivamais.com.br', name: rafael.name, date_joined: '2024-02-01T10:00:00-03:00' },
  addresses: [],
  clinic: null,
};

const times = ['08:30', '09:00', '09:30', '10:30', '11:30', '14:00', '14:30', '15:30', '16:00', '17:30'];
const slotDay = (date: string, only = times) => ({
  date,
  slots: only.map((time) => ({ time, start: `${date}T${time}:00-03:00`, status: 'free', type: 'online', max_duration: '00:30:00', specialty: 'Cardiologia', specialty_id: 'cat-cardio', partner_specialty_id: `ps-${rafael.id}-cardio` })),
});

export const rafaelSlots = { partner_id: rafael.id, days: [...Array.from({ length: 10 }, (_, i) => slotDay(shiftDay(today, i + 1)))] };

const rating = (id: string, stars: number, comment: string, ago: number) => ({ id, source: 'consultation', rating: stars, comment, created_at: `${shiftDay(today, -ago)}T12:00:00-03:00`, updated_at: stamp });

export const rafaelRatings = {
  count: 3,
  next: null,
  previous: null,
  results: [
    rating('r1', 5, 'Explicou tudo com calma e já saí com os exames pedidos. Atendimento muito humano.', 6),
    rating('r2', 5, 'Consulta pontual, sem pressa. Recomendo.', 15),
    rating('r3', 4, 'Muito atencioso. A imagem do vídeo oscilou um pouco, mas deu tudo certo.', 30),
  ],
};

export const profileQueries99 = [
  { key: ['/partners/doc-rafael/'], data: promo(rafaelPartner) },
  { key: ['/partners/slots/range/'], data: rafaelSlots },
  { key: ['/consultations/doctor-ratings/'], data: rafaelRatings },
  ...base,
];

export const profileQueries = [
  { key: ['/partners/doc-rafael/'], data: rafaelPartner },
  { key: ['/partners/slots/range/'], data: rafaelSlots },
  { key: ['/consultations/doctor-ratings/'], data: rafaelRatings },
  ...base,
];
