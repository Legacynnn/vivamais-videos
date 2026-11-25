import { ActiveFilterChips } from '~/components/search/ActiveFilterChips';
import { CategoryChips } from '~/components/search/CategoryChips';
import { DoctorRow } from '~/components/search/DoctorRow';
import { SearchHeader } from '~/components/search/SearchHeader';
import { Chip } from '~/components/ui/Chip';
import { SkeletonBox } from '~/components/ui/Skeleton';
import { Text } from '~/components/ui/Text';
import { formatBRLLabel } from '~/lib/format/money';
import { getSpecialtyImage } from '~/lib/search/specialty-icons';
import { BRAND, THEMES } from '~/theme/colors';
import { SURFACE } from '~/theme/surface';

import camila from '../../assets/people/doctors/camila-rocha.jpg';
import helena from '../../assets/people/doctors/camila.jpg';
import rafael from '../../assets/people/doctors/rafael.jpg';
import julia from '../../assets/people/doctors/julia.jpg';
import mariana from '../../assets/people/doctors/mariana.jpg';
import andre from '../../assets/people/doctors/d1.jpeg';

(globalThis as { __vmsFixture?: unknown }).__vmsFixture = {};

export const photos = { camila, helena, rafael, julia, mariana, andre } as Record<string, string>;

export { ActiveFilterChips, BRAND, CategoryChips, Chip, SkeletonBox, DoctorRow, formatBRLLabel, SearchHeader, SURFACE, Text, THEMES };

export { default as HomeScreen } from '../../screens/mobile/client-home.screen';
export { states as homeStates } from '../../screens/mobile/client-home.screen';
export { default as MyPlanScreen, states as myPlanStates } from '../../screens/mobile/my-plan.screen';
export { default as SearchResultsScreen, states as searchStates } from '../../screens/mobile/search-results.screen';
export { default as DoctorProfileScreen, states as profileStates } from '../../screens/mobile/doctor-profile.screen';
export { default as AnamneseFillScreen, states as anamneseStates } from '../../screens/mobile/anamnese-fill.screen';
export { default as VideoCallScreen, states as callStates } from '../../screens/mobile/video-call.screen';
export { searchQueries, today, tomorrow } from '../../screens/fixtures/agendamento';
export { anaAnamnese } from '../../screens/fixtures/anamnese-ana';
export { default as SpecialtyPickerScreen, states as pickerStates } from '../../screens/mobile/specialty-picker.screen';
export { getSpecialtyImage };
