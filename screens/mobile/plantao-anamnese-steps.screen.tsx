import { PlantaoAnamneseFillScreen } from '~/components/anamnese/PlantaoAnamneseFillScreen';

import { helena, helenaQueries, plantaoAnamnese } from '@screens/fixtures/helena';

export const meta = { title: 'Anamnese do plantão · passos', route: '(client)/plantao/anamnese' };

const { inicio: _inicio, ...noSince } = plantaoAnamnese.answers;
const fill = (steps: number, answers: Record<string, unknown> = plantaoAnamnese.answers) => ({
  user: helena,
  queries: helenaQueries,
  anamnese: { ...plantaoAnamnese, answers },
  press: Array(steps).fill('Continuar'),
});

export const states = { 'since-blank': fill(1, noSince), where: fill(2) };

export default PlantaoAnamneseFillScreen;
