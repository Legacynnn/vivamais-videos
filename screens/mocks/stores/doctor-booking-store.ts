import { useSyncExternalStore } from 'react';

import type { ConsultationChannelType } from '~/lib/scheduling/appointment';

interface State {
  doctorId: string | null;
  specialtyId: string | null;
  channel: ConsultationChannelType | null;
  date: string | null;
  open: (doctorId: string) => void;
  pickConsult: (specialtyId: string | null, channel: ConsultationChannelType) => void;
  pickDate: (date: string) => void;
}

const listeners = new Set<() => void>();
let state: State;

const set = (patch: Partial<State>) => {
  state = { ...state, ...patch };
  listeners.forEach((notify) => notify());
};

state = {
  doctorId: null,
  specialtyId: null,
  channel: null,
  date: null,
  open: (doctorId) => set({ doctorId, specialtyId: null, channel: null, date: null }),
  pickConsult: (specialtyId, channel) => set({ specialtyId, channel }),
  pickDate: (date) => set({ date }),
};

export const useDoctorBookingStore = Object.assign(
  <T>(selector: (value: State) => T): T =>
    useSyncExternalStore(
      (notify) => {
        listeners.add(notify);
        return () => listeners.delete(notify);
      },
      () => selector(state),
    ),
  { getState: () => state, setState: set },
);
