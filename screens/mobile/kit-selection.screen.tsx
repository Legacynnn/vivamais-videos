import { Stethoscope } from 'lucide-react-native';
import { CheckRow } from '~/components/ui/CheckRow';
import { Chip } from '~/components/ui/Chip';
import { SegmentedControl } from '~/components/ui/SegmentedControl';
import { Switch } from '~/components/ui/Switch';
import { Text } from '~/components/ui/Text';
import { Caption, Group, Row, Sheet, noop } from '../kit/sheet';

const TABS = [
  { value: 'proximas', label: 'Próximas' },
  { value: 'historico', label: 'Histórico' },
] as const;

const SEGMENTS = ['tabs', 'pill', 'pillFill', 'pillCompact', 'soft', 'softFilter', 'cards'] as const;

function KitSelection() {
  return (
    <Sheet>
      <Group title="Chip" note="tonal · solid · md · lg">
        <Row wrap>
          <Chip label="Cardiologia" selected onPress={noop} />
          <Chip label="Pediatria" selected={false} onPress={noop} />
          <Chip label="Clínico" selected onPress={noop} variant="solid" />
          <Chip label="Dermato" selected={false} onPress={noop} variant="solid" />
        </Row>
        <Row wrap>
          <Chip label="Com ícone" glyph={Stethoscope} selected={false} onPress={noop} size="lg" />
          <Chip label="Spark" spark selected onPress={noop} size="lg" />
          <Chip label="Removível" removable selected onPress={noop} />
          <Chip label="Desativado" disabled selected={false} onPress={noop} />
        </Row>
      </Group>
      <Group title="SegmentedControl">
        {SEGMENTS.map((variant) => (
          <SegmentedControl key={variant} options={TABS} value="proximas" onChange={noop} variant={variant} />
        ))}
        <Caption>{SEGMENTS.join(' · ')}</Caption>
      </Group>
      <Group title="Switch" note="brand · inset · soft · pill">
        <Row wrap>
          <Switch value variant="brand" />
          <Switch value={false} variant="brand" />
          <Switch value variant="inset" />
          <Switch value variant="soft" />
          <Switch value variant="pill" />
          <Switch value disabled />
        </Row>
      </Group>
      <Group title="CheckRow">
        <CheckRow checked label="Aceito os termos" onChange={noop}>
          <Text className="font-text text-[14px] text-foreground">Li e aceito os termos de uso</Text>
        </CheckRow>
        <CheckRow checked={false} label="Receber novidades" onChange={noop}>
          <Text className="font-text text-[14px] text-foreground">Quero receber novidades por e-mail</Text>
        </CheckRow>
      </Group>
    </Sheet>
  );
}

export const meta = { title: 'Kit · Seleção', route: 'kit/selection' };

export default KitSelection;
