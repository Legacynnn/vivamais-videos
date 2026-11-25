import { AIChatScreen } from '~/components/ai-chat/AIChatScreen';

import { anaCompany, anaCompanyQueries } from '@screens/fixtures/ana-company';

export const meta = { title: 'Super Inteligência · dúvida', route: '(client)/ai-chat' };

const at = (m: number) => `2026-11-11T08:${String(m).padStart(2, '0')}:00-03:00`;

const conversation = {
  id: 'conv-ana',
  conversation_type: 'free_chat',
  consultation_id: null,
  medical_record_id: null,
  title: 'Dipirona com paracetamol',
  last_message_at: at(31),
  is_favorite: false,
  expires_at: null,
  created_at: at(30),
  updated_at: at(31),
  messages: [
    { id: 'msg-1', role: 'user', content: 'Posso tomar dipirona com paracetamol?', model_name: null, character_count: 37, created_at: at(30), cards: [] },
    {
      id: 'msg-2',
      role: 'assistant',
      content: 'Em geral, sim, alternando os horários. Siga a dose da bula e não passe do limite do dia.\n\nSe a dor durar mais de **3 dias**, vale chamar o plantão.',
      model_name: 'viva',
      character_count: 150,
      created_at: at(31),
      cards: [],
    },
  ],
};

export const states = {
  answer: {
    user: anaCompany,
    queries: [...anaCompanyQueries, { key: ['/ai/conversations/conv-ana/'], data: conversation }],
    props: { conversationId: 'conv-ana', conversationsRoute: '/(client)/ai-conversations', plansRoute: '/(client)/plans', profileId: 'profile-ana' },
  },
};

export default AIChatScreen;
