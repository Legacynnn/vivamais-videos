import type { ReactNode } from 'react';
import { View } from 'react-native';

import { HomeScreen } from '~/components/home/HomeScreen';

export function BehindHome({ children }: { children: ReactNode }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
        <HomeScreen />
      </View>
      {children}
    </View>
  );
}
