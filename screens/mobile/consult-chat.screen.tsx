import { ClientChatScreen } from '~/components/chat/ClientChatScreen';

import { consultChat, consultChatMessages, consultChatQueries, helena } from '@screens/fixtures/helena';

export const meta = { title: 'Consulta por chat', route: '(client)/chat/[consultationId]' };

const props = { consultationId: 'consult-chat-helena', readOnly: false };
const upTo = (count: number, typing?: string) => ({
  user: helena,
  queries: consultChatQueries,
  props,
  chat: { ...consultChat, messages: consultChatMessages.slice(0, count), typing },
});

export const states = {
  m1: upTo(1),
  typing: upTo(1, 'doctor-camila'),
  m2: upTo(2),
  m3: upTo(3),
  m4: upTo(4),
  full: upTo(5),
};

export default ClientChatScreen;
