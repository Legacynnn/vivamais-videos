import { View } from 'react-native';
import { ScreenHeader } from '~/components/ui/ScreenHeader';
import { SectionHeader } from '~/components/ui/SectionHeader';
import { Caption, Group, Sheet, noop } from '../kit/sheet';

const HEADERS = ['nav', 'centered', 'compact', 'display', 'large'] as const;

function KitHeaders() {
  return (
    <Sheet>
      <Group title="ScreenHeader">
        {HEADERS.map((variant) => (
          <View key={variant} className="overflow-hidden rounded-2xl bg-card">
            <ScreenHeader
              title="Minhas consultas"
              subtitle={variant === 'display' || variant === 'large' ? 'Próximos 7 dias' : undefined}
              variant={variant}
              onBack={noop}
              topInset="none"
              background="card"
            />
            <View className="px-4 pb-2">
              <Caption>{variant}</Caption>
            </View>
          </View>
        ))}
      </Group>
      <Group title="SectionHeader">
        <SectionHeader title="Para você" variant="home" action={{ label: 'Ver tudo', onPress: noop }} />
        <SectionHeader title="Especialidades" variant="display" />
        <SectionHeader title="Documentos" variant="label" />
        <SectionHeader title="Pendentes" variant="labelBadge" count={3} />
        <SectionHeader title="Hoje" variant="day" meta="2 consultas" />
      </Group>
    </Sheet>
  );
}

export const meta = { title: 'Kit · Cabeçalhos', route: 'kit/headers' };

export default KitHeaders;
