import { View } from 'react-native';

import { DayCalendarSheet } from '~/components/doctor/DayCalendarSheet';
import { DoctorPublicProfileScreen } from '~/components/doctor/DoctorPublicProfileScreen';
import { shiftDay } from '~/lib/format/date';

import { SheetBackdrop } from '@screens/kit/sheets';
import { anaCompany, profileQueries, profileQueries99, tomorrow, today } from '@screens/fixtures/agendamento';

export const meta = { title: 'Calendário do médico', route: '(client)/doctor/[id]/calendar' };

const props = { id: 'doc-rafael', specialtyParam: 'Cardiologia', dateParam: shiftDay(today, 2) };
const base = { user: anaCompany, queries: profileQueries, props };
const day = String(Number(tomorrow.slice(8)));

export const states = {
  open: base,
  picked: { ...base, press: [day] },
  'preco-open': { ...base, queries: profileQueries99 },
  'preco-picked': { ...base, queries: profileQueries99, press: [day] },
};

export default function DoctorCalendar(screen: typeof props) {
  return (
    <View style={{ flex: 1 }}>
      <DoctorPublicProfileScreen {...screen} />
      <SheetBackdrop open height={600}>
        <DayCalendarSheet id={screen.id} specialtyId={null} channel="online_room" date={screen.dateParam} />
      </SheetBackdrop>
    </View>
  );
}
