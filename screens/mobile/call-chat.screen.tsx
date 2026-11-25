import { View } from 'react-native';

import { ClientCallChat } from '~/components/chat/CallChat';

import {
  attachment,
  chatMessage,
  consultChat,
  consultChatQueries,
  doctorSender,
  helena,
  patientSender,
  remedioPhoto,
} from '@screens/fixtures/helena';
import { anaCompany } from '@screens/fixtures/ana-company';
import { rafaelPartner } from '@screens/fixtures/agendamento';

export const meta = { title: 'Chat durante a chamada', route: '(client)/video-call/[consultationId]' };

const greeting = chatMessage('call-1', doctorSender, '09:31', {
  content: 'Oi, Helena! Pode me mandar uma foto do remédio que você tomou?',
});
const photo = chatMessage('call-2', patientSender, '09:32', {
  message_type: 'image',
  attachment: attachment('remedio.jpg', 'image/jpeg', 184_320, remedioPhoto as string),
});
const exam = chatMessage('call-3', patientSender, '09:33', {
  message_type: 'file',
  attachment: attachment('Exame - Helena Souza.pdf', 'application/pdf', 212_992, null),
});

const open = 'Abrir chat da consulta';
const state = (messages: unknown[], press: string[] = [open]) => ({
  user: helena,
  queries: consultChatQueries,
  props: { consultationId: 'consult-chat-helena' },
  chat: { ...consultChat, messages },
  press,
});

export const states = {
  button: state([greeting], []),
  open: state([greeting]),
  picker: state([greeting], [open, 'Anexar arquivo']),
  photo: state([greeting, photo]),
  pdf: state([greeting, photo, exam]),
};

const anaSender = { id: 'profile-ana', name: 'Ana Souza', type: 'patient' as const };
const rafaelSender = { id: 'doc-rafael', name: 'Dr. Rafael Menezes', type: 'doctor' as const };
const rafaelConsultation = { ...consultChatQueries[2]!.data as object, id: 'consult-rafael', doctor: 'doc-rafael', doctor_name: 'Dr. Rafael Menezes', specialty_name: 'Cardiologia', patient: 'profile-ana', patient_name: 'Ana Souza' };
const rafaelQueries = [
  { key: ['userProfile'], data: anaCompany },
  ...consultChatQueries.slice(1).filter((entry) => !String(entry.key[0]).startsWith('/partners/') && entry.key[0] !== 'consultation' && !String(entry.key[0]).includes('/status/')),
  { key: ['consultation', 'consult-rafael'], data: rafaelConsultation },
  { key: ['/consultations/consultations/consult-rafael/status/'], data: { id: 'consult-rafael', status: 'in_progress' } },
  { key: ['/partners/doc-rafael/'], data: rafaelPartner },
];
const rafaelGreeting = { ...greeting, sender: rafaelSender, content: 'Oi, Ana! Pode me mandar uma foto do remédio que você toma para a pressão?' };
const rafaelPhotoMessage = { ...photo, sender: anaSender };
const rafaelState = (messages: unknown[]) => ({
  user: anaCompany,
  queries: rafaelQueries,
  props: { consultationId: 'consult-rafael' },
  chat: { participants: [{ ...anaSender, online: true }, { ...rafaelSender, online: true }], messages },
  press: [open],
});

states['rafael-open' as keyof typeof states] = rafaelState([rafaelGreeting]) as never;
states['rafael-photo' as keyof typeof states] = rafaelState([rafaelGreeting, rafaelPhotoMessage]) as never;

export default function CallChatScreen({ consultationId }: { consultationId: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'flex-end', paddingTop: 60, paddingRight: 16 }}>
      <ClientCallChat consultationId={consultationId} />
    </View>
  );
}
