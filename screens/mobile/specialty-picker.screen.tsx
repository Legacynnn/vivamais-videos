import { SearchScreen } from '~/components/search/SearchScreen';
import { SpecialtyPickerRouteSheet, SpecialtyPickerSheet } from '~/components/search/SpecialtyPickerSheet';
import { searchSpecialtySheet } from '~/stores/search-sheets-store';

import { BehindHome } from '@screens/kit/behind-home';
import { SheetBackdrop } from '@screens/kit/sheets';
import { anaCompany, searchQueries, specialtyList } from '@screens/fixtures/agendamento';

export const meta = { title: 'Especialidade e formato', route: '(client)/search-specialty' };

const route = { focus: true, query: undefined, benefitId: undefined, originX: null, originY: null, originWidth: null, originHeight: null, specialty: 'Clínica geral' };
const options = specialtyList.results.map(({ name, icon }) => ({ id: name, label: name, icon }));
const state = (selected: string) => ({ user: anaCompany, queries: searchQueries.clinica, props: { ...route, selected } });

export const states = { open: state('Clínica geral'), cardio: state('Cardiologia') };

function Sheet({ selected }: { selected: string }) {
  const request = searchSpecialtySheet.useRequest();
  return (
    <>
      <SpecialtyPickerSheet visible specialty={selected} channel="online_room" specialties={options} onApply={() => {}} onClose={() => {}} />
      <SheetBackdrop open={request !== null} height={640}>
        <SpecialtyPickerRouteSheet />
      </SheetBackdrop>
    </>
  );
}

export default function SpecialtyPicker({ selected, ...props }: React.ComponentProps<typeof SearchScreen> & { selected: string }) {
  return (
    <BehindHome>
      <SearchScreen {...props} />
      <Sheet selected={selected} />
    </BehindHome>
  );
}
