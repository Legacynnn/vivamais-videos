import camilaPhoto from '@screens/../assets/people/doctors/camila-rocha.jpg';
import remedioPhoto from '@screens/../assets/footage/remedio.jpg';

const profile = {
  id: 'profile-helena',
  full_name: 'Helena Souza',
  is_primary: true,
  is_dependent: false,
  can_switch_profile: true,
  avatar_url: null,
  share_history_with_doctors: true,
};

export const helena = {
  id: 'user-helena',
  name: 'Helena Souza',
  email: 'helena.souza@email.com',
  user_type: 'client',
  profile,
  available_profiles: [profile],
};

export const camila = {
  id: 'doctor-camila',
  name: 'Dra. Camila Rocha',
  specialty: 'Clínica geral',
  crm: 'SP 123456',
  photo: camilaPhoto as string,
};


const option = (label: string) => ({ id: label.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]+/g, '-'), label });
const symptoms = ['Dor de cabeça', 'Febre', 'Náusea', 'Tosse', 'Dor de garganta', 'Cansaço', 'Tontura', 'Dor no corpo', 'Falta de ar', 'Dor de barriga', 'Alergia', 'Outro'].map(option);
const since = ['Hoje', 'Ontem', 'Há 2 ou 3 dias', 'Há mais de uma semana'].map(option);

export const plantaoAnamnese = {
  id: 'anamnese-helena',
  consultation: null,
  patient_queue: 'queue-helena',
  form: { id: 'form-plantao', title: 'Anamnese do plantão' },
  form_version: 'form-plantao-v1',
  version_number: 1,
  sections: [
    {
      id: 'sintomas',
      title: 'Sintomas',
      one_per_screen: true,
      questions: [
        { id: 'sintomas', label: 'O que você está sentindo?', help: 'Escolha tudo o que se aplica.', kind: 'multi_choice', required: true, options: symptoms },
        { id: 'inicio', label: 'Desde quando?', kind: 'single_choice', required: true, options: since },
      ],
    },
    { id: 'dor', title: 'Dor', questions: [{ id: 'dor', label: 'Onde dói?', kind: 'pain', required: true }] },
    {
      id: 'saude',
      title: 'Saúde',
      questions: [
        { id: 'alergias', label: 'Tem alguma alergia?', kind: 'allergies', required: true },
        { id: 'remedios', label: 'Usa algum remédio?', kind: 'medications', required: true },
      ],
    },
  ],
  answers: {
    sintomas: ['dor-de-cabeca'],
    inicio: 'ontem',
    dor: { none: false, locations: ['Cabeça'], qualities: ['Latejante / pulsante'], description: '', level: 7 },
    alergias: ['Penicilina'],
    remedios: false,
  },
  score: null,
  status: 'in_progress',
  primary: true,
  requested_by: null,
  requested_by_name: null,
  prefilled_from: null,
  prefill_answers: {},
  prefill_source_date: null,
  submitted_at: null,
  attachments: [],
  created_at: '2026-11-11T09:12:00-03:00',
  updated_at: '2026-11-11T09:14:00-03:00',
};

const endedAt = '2026-11-11T09:41:00-03:00';

const consultation = (preparing: boolean) => ({
  id: 'consult-helena',
  status: 'completed',
  source: 'on_call',
  consultation_type: 'online',
  consultation_channel: 'online_room',
  status_payement: true,
  is_reconsulta: false,
  medical_record: 'record-helena',
  documents_in_preparation: preparing,
  consultation_date: '2026-11-11T09:24:00-03:00',
  ended_at: endedAt,
  duration_seconds: 17 * 60,
  price: '59.90',
  invoice_url: null,
  can_request_reconsulta: false,
  reconsulta: null,
  rating: null,
  doctor: camila.id,
  doctor_name: camila.name,
  specialty_name: camila.specialty,
  patient: 'profile-helena',
  patient_name: 'Helena Souza',
  no_show_side: null,
});

const signed = (id: string) => (ready: boolean) => (ready ? { document_id: id, created_at: endedAt } : {});

const record = (ready: boolean) => ({
  id: 'record-helena',
  status: ready ? 'completed' : 'in_progress',
  diagnoses: [{ role: 'primary', code: 'R51', name: 'Cefaleia' }],
  therapeutic_plan: { patient_guidelines: 'Repouso e boa hidratação. Volte se houver febre ou piora da dor.' },
  medication_prescriptions: [
    {
      id: 'rx-helena',
      ...signed('doc-receita')(ready),
      prescription_type_details: { name: 'Receita simples' },
      items: [{ id: 'rx-dipirona', medication_details: { title: 'Dipirona 500 mg' }, dosage: '1 comprimido de 6 em 6 horas, se tiver dor' }],
    },
  ],
  physical_exams: { ...signed('doc-exames')(ready), requested_exams: [{ id: 'exam-hemograma', term: 'Hemograma completo' }], orientation: null },
  medical_certificate: { ...signed('doc-atestado')(ready), certificate_days: 2 },
  medical_report: { ...signed('doc-laudo')(ready) },
  patient_release_status: null,
});

export const partner = {
  id: camila.id,
  type: 'DOCTOR',
  name: camila.name,
  medical_register: 'CRM-SP 123456',
  register_label: 'CRM',
  user: { id: 'user-camila', email: 'camila.rocha@vivamais.com.br', name: camila.name, date_joined: '2025-03-01T10:00:00-03:00' },
  specialties: [{ id: 'spec-clinica', name: camila.specialty, partner: camila.id, categories: [], specialty: { id: 'clinica-geral', name: camila.specialty, council_acronym: 'CRM', can_prescribe: true, can_issue_certificate: true } }],
  addresses: [],
  attends_online: true,
  attends_presential: false,
  availabilities: null,
  avatar_url: camila.photo,
  average_rating: 4.9,
  rating_count: 212,
  benefits_services: [],
  accepts_chat_scheduling: true,
  video_duration_minutes: 20,
  chat_duration_minutes: 20,
};

export const postConsultationQueries = (ready: boolean) => [
  ...helenaQueries,
  { key: ['consultation', 'consult-helena'], data: consultation(!ready) },
  { key: ['medical-record', 'record-helena'], data: record(ready) },
  { key: [`/partners/${camila.id}/`], data: partner },
];

export const aiConversation = {
  id: 'conv-helena',
  conversation_type: 'free_chat',
  consultation_id: null,
  medical_record_id: null,
  title: 'Como tomar a receita',
  last_message_at: '2026-11-11T10:02:00-03:00',
  is_favorite: false,
  expires_at: null,
  created_at: '2026-11-11T10:01:00-03:00',
  updated_at: '2026-11-11T10:02:00-03:00',
  messages: [
    { id: 'msg-1', role: 'user', content: 'Como tomo a receita?', model_name: null, character_count: 20, created_at: '2026-11-11T10:01:00-03:00', cards: [] },
    {
      id: 'msg-2',
      role: 'assistant',
      content: 'Dipirona 500 mg de 6 em 6 horas, se tiver dor.\n\nÉ o que está na sua **receita** da consulta com a Dra. Camila Rocha, de 11 de novembro.',
      model_name: 'viva',
      character_count: 130,
      created_at: '2026-11-11T10:02:00-03:00',
      cards: [],
    },
  ],
};

export const aiConsultationSummary = {
  ...aiConversation,
  id: 'conv-helena-summary',
  title: 'Resumo da consulta',
  messages: [
    { id: 'msg-s1', role: 'user', content: 'Resume minha consulta de hoje', model_name: null, character_count: 28, created_at: '2026-11-11T10:01:00-03:00', cards: [] },
    {
      id: 'msg-s2',
      role: 'assistant',
      content:
        'Da sua consulta com a Dra. Camila Rocha, hoje:\n\n**Achado:** cefaleia tensional, dor forte há 1 dia (7/10).\n**Orientações:** repouso, hidratação e evitar telas.\n**Receita:** Dipirona 500 mg, 1 comprimido de 6 em 6 horas se dor.\n**Exame:** Hemograma completo.\n**Retorno:** se piorar ou tiver febre, volte ao plantão.',
      model_name: 'viva',
      character_count: 300,
      created_at: '2026-11-11T10:02:00-03:00',
      cards: [],
    },
  ],
};

export const aiConsultationCardio = {
  ...aiConsultationSummary,
  id: 'conv-helena-cardio',
  messages: [
    aiConsultationSummary.messages[0],
    {
      ...aiConsultationSummary.messages[1],
      id: 'msg-c2',
      content:
        'Da sua consulta com a Dra. Camila Rocha, hoje:\n\n**Achado:** falta de ar e cansaço há 3 dias, pressão 15x9.\n**Conduta:** ajuste da Losartana 50 mg, 1 vez ao dia.\n**Exames:** eletrocardiograma e ecocardiograma.\n**Retorno:** em 30 dias com os exames.',
      citations: [
        { title: 'Receita', url: 'https://app.vivamais.com/documentos/receita', citedText: '' },
        { title: 'Pedido de exame', url: 'https://app.vivamais.com/documentos/exames', citedText: '' },
        { title: 'Atestado', url: 'https://app.vivamais.com/documentos/atestado', citedText: '' },
        { title: 'Prontuário', url: 'https://app.vivamais.com/documentos/prontuario', citedText: '' },
      ],
    },
  ],
};

export const submittedAnamnese = { ...plantaoAnamnese, consultation: 'consult-helena', status: 'submitted', submitted_at: '2026-11-11T09:15:00-03:00' };

export const helenaQueries = [
  { key: ['userProfile'], data: helena },
  { key: ['/consultations/anamnese-responses/'], data: { count: 1, next: null, previous: null, results: [submittedAnamnese] } },
];

const chatId = 'chat-helena';
export const patientSender = { id: 'profile-helena', name: 'Helena Souza', type: 'patient' as const };
export const doctorSender = { id: camila.id, name: camila.name, type: 'doctor' as const };

export const chatMessage = (id: string, sender: typeof patientSender | typeof doctorSender, time: string, body: Record<string, unknown>) => ({
  id,
  chat_id: chatId,
  sender,
  message_type: 'text',
  content: '',
  attachment: null,
  metadata: {},
  timestamp: `2026-11-11T${time}:00-03:00`,
  read: true,
  ...body,
});

export const attachment = (original_filename: string, mime_type: string, file_size: number, url: string | null) => ({
  bucket: null,
  object_key: null,
  original_filename,
  mime_type,
  file_size,
  url,
  download_url: null,
});

export const consultChatMessages = [
  chatMessage('chat-1', patientSender, '09:24', { content: 'Estou com dor de cabeça desde ontem' }),
  chatMessage('chat-2', doctorSender, '09:25', { content: 'Oi, Helena! Já vi sua pré-consulta. Pode me mandar uma foto do remédio que você tomou?' }),
  chatMessage('chat-3', patientSender, '09:26', { message_type: 'image', attachment: attachment('remedio.jpg', 'image/jpeg', 184_320, remedioPhoto as string) }),
  chatMessage('chat-4', doctorSender, '09:27', { content: 'Certo. Vou te mandar a receita aqui.' }),
  chatMessage('chat-5', doctorSender, '09:28', { message_type: 'file', attachment: attachment('Receita - Helena Souza.pdf', 'application/pdf', 86_016, null) }),
];

export const consultChat = {
  participants: [
    { ...patientSender, online: true },
    { ...doctorSender, online: true },
  ],
};

const chatConsultation = {
  id: 'consult-chat-helena',
  status: 'in_progress',
  source: 'on_call',
  consultation_type: 'online',
  consultation_channel: 'chat',
  status_payement: true,
  is_reconsulta: false,
  medical_record: null,
  consultation_date: '2026-11-11T09:24:00-03:00',
  doctor: camila.id,
  doctor_name: camila.name,
  specialty_name: camila.specialty,
  patient: 'profile-helena',
  patient_name: 'Helena Souza',
};

export const consultChatQueries = [
  ...helenaQueries,
  { key: ['consultation', 'consult-chat-helena'], data: chatConsultation },
  { key: ['/consultations/consultations/consult-chat-helena/status/'], data: { id: 'consult-chat-helena', status: 'in_progress' } },
  { key: ['document-source'], data: null },
  { key: [`/partners/${camila.id}/`], data: partner },
];
export { remedioPhoto };
