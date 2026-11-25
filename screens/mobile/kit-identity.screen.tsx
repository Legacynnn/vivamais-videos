import { AiBadge } from '~/components/ui/AiBadge';
import { AiOrb } from '~/components/ui/AiOrb';
import { Avatar } from '~/components/ui/Avatar';
import { BrandMark, MonoBrandMark } from '~/components/ui/BrandMark';
import { Caption, Group, Row, Sheet } from '../kit/sheet';

const TONES = ['primary', 'soft', 'softPrimary', 'tint', 'lilac', 'palette', 'monogram', 'monogramDark'] as const;

function KitIdentity() {
  return (
    <Sheet>
      <Group title="Avatar" note="tons">
        <Row wrap>
          {TONES.map((tone) => (
            <Avatar key={tone} name="Ana Souza" size={48} tone={tone} />
          ))}
        </Row>
        <Caption>{TONES.join(' · ')}</Caption>
      </Group>
      <Group title="Avatar" note="tamanhos e cantos">
        <Row wrap>
          {([32, 40, 52, 76] as const).map((size) => (
            <Avatar key={size} name="Rafael Costa" size={size} tone="softPrimary" />
          ))}
          <Avatar name="Clínica" size={52} tone="tint" corners="tile" />
          <Avatar name="Ana Souza" size={52} tone="primary" online />
        </Row>
      </Group>
      <Group title="Marca">
        <Row wrap>
          <BrandMark size={56} />
          <MonoBrandMark size={56} color="#7E3BED" />
          <MonoBrandMark size={56} color="#17151E" />
          <AiBadge />
        </Row>
      </Group>
      <Group title="AiOrb" note="idle · thinking · answering">
        <Row wrap>
          <AiOrb state="idle" size={64} />
          <AiOrb state="thinking" size={64} />
          <AiOrb state="answering" size={64} />
        </Row>
      </Group>
    </Sheet>
  );
}

export const meta = { title: 'Kit · Identidade', route: 'kit/identity' };

export default KitIdentity;
