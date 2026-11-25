import { fixture } from '@screens/fixture';

export type DraftStatus = 'saved' | 'pending' | 'saving' | 'failed';

export function useResponseFiller(_responseId: string) {
  return {
    scheduleSave: (_answers: unknown) => {},
    flush: async () => {},
    draftStatus: 'saved' as DraftStatus,
    send: async () => ({ ...(fixture().anamnese as object), status: 'submitted', submitted_at: '2026-11-24T09:00:00-03:00' }),
    sending: false,
    uploadFile: async () => ({}),
    uploading: false,
  };
}
