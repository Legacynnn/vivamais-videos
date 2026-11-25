import SearchResults from './search-results.screen';
import { anaCompany, searchQueries } from '@screens/fixtures/agendamento';

export const meta = { title: 'Filtros da busca', route: '(client)/search-filters' };

const route = { focus: true, query: undefined, benefitId: undefined, originX: null, originY: null, originWidth: null, originHeight: null, specialty: 'Cardiologia' };
const base = { user: anaCompany, queries: searchQueries.cardio, props: route };

export const states = {
  default: { ...base, press: ['Filtros, 1 ativos'] },
  set: { ...base, press: ['Filtros, 1 ativos', 'Amanhã', 'Vídeo', 'Especialistas'] },
};

export default SearchResults;
