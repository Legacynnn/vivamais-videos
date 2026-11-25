import { Composition } from 'remotion';
import { Booking, BOOKING_FRAMES } from './Booking';
import { Agendamento, AGENDAMENTO_FRAMES } from './agendamento/Agendamento';
import { IAAplicada, IA_FRAMES } from './ia-aplicada/IAAplicada';
import { SearchPilot, SEARCH_PILOT_FRAMES } from './SearchPilot';

export const Root = () => (
  <>
    <Composition id="ia-aplicada" component={IAAplicada} durationInFrames={IA_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="agendamento" component={Agendamento} durationInFrames={AGENDAMENTO_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="booking" component={Booking} durationInFrames={BOOKING_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="search-pilot" component={SearchPilot} durationInFrames={SEARCH_PILOT_FRAMES} fps={30} width={1080} height={1920} />
  </>
);
