import { AnamneseFillScreen } from '~/components/anamnese/AnamneseFillScreen';

import { anaAnamnese, anaCompany, anamneseQueries } from '@screens/fixtures/anamnese-ana';

export const meta = { title: 'Anamnese da consulta', route: '(client)/anamnese/fill/[responseId]' };

const fill = (press: string[]) => ({
  user: anaCompany,
  queries: anamneseQueries,
  anamnese: anaAnamnese,
  props: { responseId: 'resp-ana', from: 'booking' },
  press,
});
const next = (steps: number) => Array(steps).fill('Continuar');

export const states = {
  symptom: fill([]),
  since: fill(next(1)),
  pain: fill(next(3)),
  health: fill(next(4)),
  sent: fill([...next(5), 'Enviar anamnese']),
};

export default AnamneseFillScreen;
