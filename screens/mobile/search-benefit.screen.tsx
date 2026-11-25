import SearchResults from './search-results.screen';
import { anaCompany, searchQueries } from '@screens/fixtures/agendamento';

export const meta = { title: 'Busca por benefício', route: '(client)/search?benefit_id' };

const route = { focus: true, query: undefined, specialty: undefined, benefitId: 'b-especialistas', originX: null, originY: null, originWidth: null, originHeight: null };

export const states = {
  especialistas: { user: anaCompany, queries: searchQueries.cardio, props: route },
  preco: { user: anaCompany, queries: searchQueries.cardio99, props: route, strikePrice: 'R$ 120,00' },
};

export default SearchResults;
