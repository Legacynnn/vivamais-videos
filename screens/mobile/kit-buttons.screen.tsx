import { Plus } from 'lucide-react-native';
import { Button } from '~/components/ui/Button';
import { Caption, Group, Row, Sheet, noop } from '../kit/sheet';

const VARIANTS = [
  'primary',
  'primaryStrong',
  'secondary',
  'outline',
  'outlineViolet',
  'muted',
  'ghost',
  'destructive',
  'destructiveSoft',
  'warning',
  'info',
  'success',
] as const;

function KitButtons() {
  return (
    <Sheet>
      <Group title="Button" note="Arredondado: 12 variantes × 3 tamanhos">
        {VARIANTS.map((variant) => (
          <Row key={variant}>
            <Button label="Agendar consulta" variant={variant} onPress={noop} grow />
            <Caption>{variant}</Caption>
          </Row>
        ))}
      </Group>
      <Group title="Tamanhos e estados">
        <Button label="Default" onPress={noop} fullWidth />
        <Row>
          <Button label="Small" size="small" onPress={noop} />
          <Button label="Com ícone" size="small" leftIcon={Plus} onPress={noop} />
          <Button label="Link" size="link" onPress={noop} />
        </Row>
        <Row>
          <Button label="Carregando" loading onPress={noop} grow />
          <Button label="Desativado" disabled onPress={noop} grow />
        </Row>
      </Group>
      <Group title="Pill" note="primary · muted · outline · ghost">
        <Row wrap>
          <Button pill label="Primary" variant="primary" onPress={noop} />
          <Button pill label="Muted" variant="muted" onPress={noop} />
          <Button pill label="Outline" variant="outline" onPress={noop} />
          <Button pill label="Ghost" variant="ghost" onPress={noop} />
        </Row>
        <Row wrap>
          <Button pill label="Default" onPress={noop} />
          <Button pill label="Small" size="small" onPress={noop} />
          <Button pill label="Compact" size="compact" onPress={noop} />
        </Row>
      </Group>
    </Sheet>
  );
}

export const meta = { title: 'Kit · Botões', route: 'kit/buttons' };

export default KitButtons;
