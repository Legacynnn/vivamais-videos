import { MyPlanScreen } from '~/components/plans/MyPlanScreen';

import { anaCompany, anaCompanyQueries } from '@screens/fixtures/ana-company';

export const meta = { title: 'Meu plano', route: '(client)/plans' };

export const states = { company: { user: anaCompany, queries: anaCompanyQueries, props: { clientId: undefined } } };

export default MyPlanScreen;
