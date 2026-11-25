import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

// The reanimated shim never re-renders after mount, so the reveal would stay at opacity 0.
export function SuccessReveal({ style, children }: { index: number; float?: boolean; style?: StyleProp<ViewStyle>; children: ReactNode }) {
  return <View style={style}>{children}</View>;
}
