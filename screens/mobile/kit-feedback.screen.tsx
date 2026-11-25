import { CalendarX } from 'lucide-react-native';
import { View } from 'react-native';
import { EmptyState } from '~/components/ui/EmptyState';
import { ErrorState } from '~/components/ui/ErrorState';
import { Skeleton } from '~/components/ui/Skeleton';
import { Spinner } from '~/components/ui/Spinner';
import { Caption, Group, Row, Sheet, noop } from '../kit/sheet';

const TONES = ['primary', 'primaryStrong', 'primaryLight', 'foreground', 'muted', 'destructive'] as const;

function KitFeedback() {
  return (
    <Sheet>
      <Group title="EmptyState" note="layout plain">
        <View className="rounded-2xl bg-card">
          <EmptyState layout="plain" icon={CalendarX} title="Nenhuma consulta agendada" body="Quando você marcar uma consulta, ela aparece aqui." />
        </View>
      </Group>
      <Group title="ErrorState" note="inline">
        <ErrorState variant="inline" message="Não foi possível carregar seus documentos." onRetry={noop} />
      </Group>
      <Group title="Skeleton">
        <View className="rounded-2xl bg-card p-4" style={{ gap: 16 }}>
          <Skeleton variant="row" />
          <Skeleton variant="row" lines={2} />
          <Skeleton width="100%" height={96} borderRadius={16} />
        </View>
      </Group>
      <Group title="Spinner">
        <Row wrap>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <Spinner key={size} size={size} />
          ))}
        </Row>
        <Row wrap>
          {TONES.map((tone) => (
            <Spinner key={tone} tone={tone} size="md" />
          ))}
        </Row>
        <Caption>{TONES.join(' · ')}</Caption>
      </Group>
    </Sheet>
  );
}

export const meta = { title: 'Kit · Feedback', route: 'kit/feedback' };

export default KitFeedback;
