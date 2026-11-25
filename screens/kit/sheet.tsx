import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/Text';

export const noop = () => {};

export function Sheet({ children }: { children: ReactNode }) {
  return <View className="bg-background px-5 pb-10 pt-6">{children}</View>;
}

export function Group({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <View className="mb-8">
      <Text className="font-brand text-[18px] leading-6 text-foreground">{title}</Text>
      {note ? <Text className="mt-0.5 font-text text-[12px] leading-4 text-muted-foreground">{note}</Text> : null}
      <View className="mt-3" style={{ gap: 12 }}>
        {children}
      </View>
    </View>
  );
}

export function Row({ children, wrap }: { children: ReactNode; wrap?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: wrap ? 'wrap' : 'nowrap', alignItems: 'center', gap: 10 }}>
      {children}
    </View>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return <Text className="font-text text-[11px] leading-4 text-muted-foreground">{children}</Text>;
}
