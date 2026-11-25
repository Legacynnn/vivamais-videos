import { FileBadge, FileText, FlaskConical, Image as ImageIcon, Pill } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';

import { DossierSummary } from '~/components/consultation/doctor/dossier/DossierSummary';
import { DossierTranscript } from '~/components/consultation/doctor/dossier/DossierTranscript';
import { Text } from '~/components/ui/Text';
import { BRAND } from '~/theme/colors';

import { helena } from '@screens/fixtures/helena';

export const meta = { title: 'Registro da consulta', route: '(client)/post-consultation (registro)' };

const turn = (i: number, speaker: 'medico' | 'paciente', startMs: number, text: string) => ({ key: String(i), speaker, startMs, text });

const turns = [
  turn(1, 'medico', 8000, 'Oi, Helena. O que você está sentindo?'),
  turn(2, 'paciente', 14000, 'Dor de cabeça forte desde ontem, uns sete de dez.'),
  turn(3, 'medico', 22000, 'Ela piora com a luz ou com a tela do celular?'),
  turn(4, 'paciente', 29000, 'Piora, sim. E também no fim do dia.'),
  turn(5, 'medico', 41000, 'Parece cefaleia tensional. Vou passar dipirona e pedir um hemograma.'),
  turn(6, 'paciente', 52000, 'Tá bom, doutora. Obrigada!'),
];

const blocks = [
  { key: 'queixa_principal', label: 'Queixa principal', items: ['Dor de cabeça forte desde ontem, 7/10'] },
  { key: 'achados', label: 'Achados', items: ['Cefaleia tensional'] },
  { key: 'orientacoes', label: 'Orientações', items: ['Repouso', 'Hidratação', 'Evitar telas'] },
  { key: 'conduta', label: 'Conduta', items: ['Dipirona 500 mg, de 6 em 6 horas se dor', 'Hemograma completo'] },
  { key: 'retorno', label: 'Retorno', items: ['Volte se piorar ou tiver febre'] },
];

const noop = () => undefined;

function TranscriptBody() {
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
      <DossierTranscript turns={turns as never} isError={false} patientName="Helena" onRetry={noop} />
    </ScrollView>
  );
}

function SummaryBody() {
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
      <DossierSummary view={{ kind: 'ready', blocks } as never} isRegenerating={false} onRegenerate={noop} onRetry={noop} />
    </ScrollView>
  );
}

const CARD = { borderRadius: 20, borderCurve: 'continuous' } as const;

const Row = ({ icon: Icon, title, note, first }: { icon: typeof Pill; title: string; note: string; first?: boolean }) => (
  <View className={`flex-row items-center px-4 py-3.5 ${first ? '' : 'border-t border-ink-100'}`} accessibilityLabel={`Abrir ${title}`}>
    <Icon size={17} color={BRAND.violet[600]} />
    <View className="ml-3 flex-1">
      <Text className="font-text-medium text-[15px] leading-[21px] text-ink-900" numberOfLines={1}>{title}</Text>
      <Text className="mt-0.5 font-text text-[13px] leading-[19px] text-ink-500">{note}</Text>
    </View>
  </View>
);

const Label = ({ children }: { children: string }) => (
  <Text className="mb-2 mt-5 px-1 font-text-medium text-[13px] uppercase text-ink-500">{children}</Text>
);

function DocumentsBody() {
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingTop: 0 }}>
      <Label>Gerados na consulta · 4</Label>
      <View className="overflow-hidden border border-ink-100 bg-white" style={CARD}>
        <Row first icon={Pill} title="Receita simples" note="Dipirona 500 mg · 11/11/2026" />
        <Row icon={FlaskConical} title="Pedido de exames" note="Hemograma completo · 11/11/2026" />
        <Row icon={FileBadge} title="Atestado médico" note="2 dias de afastamento · 11/11/2026" />
        <Row icon={FileText} title="Laudo / Encaminhamento" note="Clínica geral · 11/11/2026" />
      </View>
      <Label>Enviados no chat · 2</Label>
      <View className="overflow-hidden border border-ink-100 bg-white" style={CARD}>
        <Row first icon={ImageIcon} title="Foto do remédio" note="remedio.jpg · você enviou" />
        <Row icon={FileText} title="Hemograma - Helena Souza.pdf" note="PDF · você enviou" />
      </View>
    </ScrollView>
  );
}

const frame = (body: 'transcript' | 'summary' | 'documents') => ({ user: helena, props: { body } });

export const states = { transcript: frame('transcript'), summary: frame('summary'), documents: frame('documents') };

export default function ConsultationRecord({ body }: { body: 'transcript' | 'summary' | 'documents' }) {
  return (
    <View className="flex-1" style={{ backgroundColor: '#F2F1F6' }}>
      {body === 'transcript' ? <TranscriptBody /> : body === 'summary' ? <SummaryBody /> : <DocumentsBody />}
    </View>
  );
}
