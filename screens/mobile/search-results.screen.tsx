import { SearchScreen } from '~/components/search/SearchScreen';
import { FilterRouteSheet } from '~/components/search/FilterSheet';
import { SpecialtyPickerRouteSheet } from '~/components/search/SpecialtyPickerSheet';
import { searchFilterSheet, searchSpecialtySheet } from '~/stores/search-sheets-store';

import { BehindHome } from '@screens/kit/behind-home';
import { SheetBackdrop } from '@screens/kit/sheets';
import { anaCompany, searchQueries } from '@screens/fixtures/agendamento';

export const meta = { title: 'Buscar médicos', route: '(client)/search' };

const route = { focus: true, query: undefined, benefitId: undefined, originX: null, originY: null, originWidth: null, originHeight: null };
const list = (specialty: string) => ({ ...route, specialty });
const open = ['Filtros, 1 ativos'];

export const states = {
  loading: { user: anaCompany, loading: true, queries: searchQueries.loading, props: list('Clínica geral') },
  clinica: { user: anaCompany, queries: searchQueries.clinica, props: list('Clínica geral') },
  cardio: { user: anaCompany, queries: searchQueries.cardio, props: list('Cardiologia') },
  'cardio-filtered': {
    user: anaCompany,
    queries: searchQueries.cardioTomorrow,
    props: list('Cardiologia'),
    press: [...open, 'Amanhã', 'Especialistas', 'Ver médicos'],
  },
};

function Sheets() {
  const filters = searchFilterSheet.useRequest();
  const picker = searchSpecialtySheet.useRequest();
  return (
    <>
      <SheetBackdrop open={filters !== null} height={760}>
        <FilterRouteSheet />
      </SheetBackdrop>
      <SheetBackdrop open={picker !== null} height={560}>
        <SpecialtyPickerRouteSheet />
      </SheetBackdrop>
    </>
  );
}

export default function SearchResults(props: React.ComponentProps<typeof SearchScreen>) {
  return (
    <BehindHome>
      <SearchScreen {...props} />
      <Sheets />
    </BehindHome>
  );
}
