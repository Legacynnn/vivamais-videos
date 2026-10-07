import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ScreenEdges = 'top' | 'all' | 'sides';

type ScreenBackground = 'background' | 'none';

interface ScreenProps {
  children: ReactNode;
  edges?: ScreenEdges;
  background?: ScreenBackground;
  modal?: boolean;
}

export function Screen({ children, edges = 'top', background = 'background' }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const pad = {
    paddingTop: edges === 'sides' ? 0 : insets.top,
    paddingBottom: edges === 'all' ? insets.bottom : 0,
  };
  return (
    <View style={pad} className={background === 'background' ? 'flex-1 bg-background' : 'flex-1'}>
      {children}
    </View>
  );
}
