import { VivaAIChatScreen } from '~/components/ai-chat/VivaAIChatScreen';

import { aiConsultationCardio, aiConsultationSummary, aiConversation, helena, helenaQueries } from '@screens/fixtures/helena';

export const meta = { title: 'Super Inteligência', route: '(client)/ai-chat' };

const props = { agent: 'patient', profileId: 'profile-helena' };

export const states = {
  empty: { user: helena, queries: helenaQueries, props },
  answer: { user: helena, queries: helenaQueries, vivaMessages: aiConversation.messages, props: { ...props, conversationId: 'conv-helena' } },
  summary: { user: helena, queries: helenaQueries, vivaMessages: aiConsultationSummary.messages, props: { ...props, conversationId: 'conv-helena-summary' } },
  cardio: { user: helena, queries: helenaQueries, vivaMessages: aiConsultationCardio.messages, props: { ...props, conversationId: 'conv-helena-cardio' } },
};

export default VivaAIChatScreen;
