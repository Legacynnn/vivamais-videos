import { PlantaoAnamneseFillScreen } from '~/components/anamnese/PlantaoAnamneseFillScreen';

import { helena, helenaQueries, plantaoAnamnese } from '@screens/fixtures/helena';

export const meta = { title: 'Anamnese do plantão', route: '(client)/plantao/anamnese' };

const fill = (steps: number) => ({ user: helena, queries: helenaQueries, anamnese: plantaoAnamnese, press: Array(steps).fill('Continuar') });

export const states = {
  empty: { ...fill(0), anamnese: { ...plantaoAnamnese, answers: {} } },
  symptom: fill(0), since: fill(1), pain: fill(3), health: fill(4), done: fill(5),
};

export default PlantaoAnamneseFillScreen;
