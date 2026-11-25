import type { UseChatReturn } from '~/hooks/chat/useChat';
import type { ChatMessage, ChatParticipant } from '~/types/chat';

import { fixture } from '@screens/fixture';

interface ChatFixture {
  messages: ChatMessage[];
  participants: ChatParticipant[];
  typing?: string;
}

const idle = async () => {};

// Message clock times are kept, the day is moved to today so the day pill reads "Hoje".
function today(message: ChatMessage): ChatMessage {
  const at = new Date(message.timestamp);
  const now = new Date();
  at.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
  return { ...message, timestamp: at.toISOString() };
}

export function useChat(): UseChatReturn {
  const chat = (fixture().chat as ChatFixture | undefined) ?? { messages: [], participants: [] };
  const typing = chat.participants.find((participant) => participant.id === chat.typing) ?? null;
  return {
    chatId: 'chat-helena',
    messages: chat.messages.map(today),
    participants: chat.participants,
    isConnected: true,
    connectionState: 'connected',
    isLoadingHistory: false,
    hasMore: false,
    isTyping: Boolean(typing),
    typingParticipant: typing,
    unreadCount: 0,
    bootstrapError: null,
    historyError: null,
    sendMessage: async () => ({ requestId: 'draft' }),
    sendFileMessage: async () => ({ requestId: 'draft' }),
    loadMoreMessages: idle,
    retryBootstrap: idle,
    retryHistory: idle,
    markRead: () => {},
    notifyTyping: () => {},
    isSendingFile: false,
    uploadProgress: null,
  };
}
