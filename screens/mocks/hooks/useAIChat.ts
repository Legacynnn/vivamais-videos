import { useAIChat as realUseAIChat } from '~/hooks/useAIChat';

import { aiConsultationCardio } from '@screens/fixtures/helena';

const citationsById = new Map(aiConsultationCardio.messages.flatMap((m) => ('citations' in m && m.citations ? [[m.id, m.citations] as const] : [])));

export function useAIChat(options?: Parameters<typeof realUseAIChat>[0]) {
  const chat = realUseAIChat(options);
  return { ...chat, messages: chat.messages.map((m) => (citationsById.has(m.id) ? { ...m, citations: [...citationsById.get(m.id)!] } : m)) };
}
