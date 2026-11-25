import { TextField } from '~/components/ui/TextField';
import { Group, Sheet } from '../kit/sheet';

function KitFields() {
  return (
    <Sheet>
      <Group title="TextField" note="default">
        <TextField label="Nome completo" placeholder="Como está no documento" />
        <TextField label="E-mail" defaultValue="ana.souza@email.com" helper="Usado para entrar no app" />
        <TextField label="CPF" defaultValue="123.456.789-00" error="CPF inválido" />
      </Group>
      <Group title="TextField" note="well">
        <TextField variant="well" label="Sintomas" placeholder="Descreva o que está sentindo" multiline minHeight={96} />
        <TextField variant="well" label="Telefone" defaultValue="(11) 98765-4321" />
      </Group>
    </Sheet>
  );
}

export const meta = { title: 'Kit · Campos', route: 'kit/fields' };

export default KitFields;
