import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Mic, MicOff, PhoneOff, SwitchCamera, Video, VideoOff, Volume2, type LucideIcon } from 'lucide-react-native';

import { PatientInCall } from '~/components/video-call/PatientInCall';
import { ClientCallChat } from '~/components/chat/CallChat';
import type { CallEmbedProps } from '~/components/video-call/call-embed';
import { BRAND, withOpacity } from '~/theme/colors';

import rafaelPhoto from '@screens/../assets/people/doctors/rafael-hd.jpg';
import anaPhoto from '@screens/../assets/people/ana.jpg';
import { anaCompany } from '@screens/fixtures/ana-company';
import { consultChat, consultChatQueries } from '@screens/fixtures/helena';

export const meta = { title: 'Consulta por vídeo', route: '(client)/video-call/[consultationId]' };

const queries = [{ key: ['userProfile'], data: anaCompany }, ...consultChatQueries.slice(1)];

export const states = {
  'in-call': { user: anaCompany, queries, props: { consultationId: 'consult-chat-helena' }, chat: { ...consultChat, messages: [] } },
};

const TONE = { neutral: withOpacity(BRAND.black, 0.45), off: BRAND.white, danger: BRAND.danger } as const;
const INK = { neutral: BRAND.white, off: BRAND.ink[900], danger: BRAND.white } as const;

function Control({ icon: Icon, label, tone, onPress }: { icon: LucideIcon; label: string; tone: keyof typeof TONE; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      className="h-14 w-14 items-center justify-center rounded-full active:opacity-80"
      style={{ backgroundColor: TONE[tone] }}
    >
      <Icon size={22} color={INK[tone]} />
    </Pressable>
  );
}

function CallEmbed({ bottomInset, onJoined, onRemoteCountChange }: CallEmbedProps) {
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);

  useEffect(() => {
    onJoined();
    onRemoteCountChange?.(1);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: BRAND.ink[900] }}>
      <View testID="call-remote" accessibilityLabel="Vídeo do médico" style={{ flex: 1 }}>
        <Image source={rafaelPhoto as string} style={{ flex: 1 }} contentFit="cover" />
      </View>
      <View
        testID="call-self"
        accessibilityLabel="Sua câmera"
        style={{ position: 'absolute', right: 12, top: 330, width: '32%', aspectRatio: 3 / 4, borderRadius: 10, overflow: 'hidden', borderWidth: 1.5, borderColor: BRAND.white, backgroundColor: BRAND.ink[900] }}
      >
        <Image source={anaPhoto as string} style={{ flex: 1 }} contentFit="cover" />
      </View>
      <View className="absolute left-0 right-0 flex-row items-center justify-center" style={{ bottom: bottomInset + 20, gap: 14 }}>
        <Control icon={mic ? Mic : MicOff} label="Desligar microfone" tone={mic ? 'neutral' : 'off'} onPress={() => setMic((on) => !on)} />
        <Control icon={camera ? Video : VideoOff} label="Desligar câmera" tone={camera ? 'neutral' : 'off'} onPress={() => setCamera((on) => !on)} />
        <Control icon={SwitchCamera} label="Trocar câmera" tone="neutral" onPress={() => {}} />
        <Control icon={Volume2} label="Usar fone do aparelho" tone="neutral" onPress={() => {}} />
        <Control icon={PhoneOff} label="Sair da chamada" tone="danger" onPress={() => {}} />
      </View>
    </View>
  );
}

const noop = () => {};

export default function VideoCall({ consultationId }: { consultationId: string }) {
  return (
    <PatientInCall
      consultationId={consultationId}
      consultation={undefined}
      fromPlantao={false}
      embed={CallEmbed}
      requestAccess={async () => ({}) as never}
      onCallEnded={noop}
      onLeave={noop}
      onDisconnectResolved={noop}
      isRecording
      askConsent={false}
      recordingConsent={{ reset: noop } as never}
      onDismissConsent={noop}
      chat={ClientCallChat}
      onMinimize={noop}
    />
  );
}
