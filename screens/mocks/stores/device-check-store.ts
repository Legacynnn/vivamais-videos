import { fixture } from '@screens/fixture';

export const PLANTAO_LOBBY_DEVICE_KEY = 'plantao-lobby';

export function plantaoDeviceKey(queueId: string | null | undefined): string {
  return queueId ? `plantao:${queueId}` : PLANTAO_LOBBY_DEVICE_KEY;
}

export const useDeviceCheckStore = Object.assign(<T>(selector: (value: { testedAt: Record<string, number>; markTested: (key: string) => void }) => T) => selector({ testedAt: {}, markTested: () => {} }), {
  getState: () => ({}),
  setState: () => {},
  subscribe: () => () => {},
});

export function useDevicesTestedAt(_consultationId: string | null | undefined): Date | null {
  return fixture().devicesTested ? new Date('2026-11-11T09:00:00') : null;
}
