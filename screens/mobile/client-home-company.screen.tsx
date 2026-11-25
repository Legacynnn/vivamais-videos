import { HomeScreen } from '~/components/home/HomeScreen';

import { anaCompany, anaCompanyQueries } from '@screens/fixtures/ana-company';

export const meta = { title: 'Início do colaborador', route: '(client)/(tabs)/index' };

export const states = {
  default: { user: anaCompany, queries: anaCompanyQueries },
  loading: { user: anaCompany, queries: anaCompanyQueries, loading: true },
};

export default HomeScreen;
