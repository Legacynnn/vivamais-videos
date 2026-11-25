import { legacyMessagesToUIMessages, type PersistedLegacyMessage } from '@vivamais/ai-client';

import { fixture } from '@screens/fixture';

const idle = async () => {};

export function useVivaChat(_options?: unknown) {
  const { vivaMessages = [], vivaStatus = 'ready' } = fixture() as { vivaMessages?: PersistedLegacyMessage[]; vivaStatus?: string };
  const messages = legacyMessagesToUIMessages(vivaMessages);
  return {
    id: 'viva-fixture',
    messages,
    status: vivaStatus,
    error: undefined,
    historyError: null,
    conversationPatient: null,
    isLoadingHistory: false,
    historyCount: messages.length,
    sendMessage: idle,
    regenerate: idle,
    stop: idle,
    setMessages: () => {},
    addToolApprovalResponse: () => {},
    clearError: () => {},
    resumeStream: idle,
  };
}
