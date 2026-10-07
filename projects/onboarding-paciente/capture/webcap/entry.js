import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { cssInterop } from 'nativewind';
import Animated from 'react-native-reanimated';

[Animated.View, Animated.Text, Animated.ScrollView, Animated.Image].forEach((C) => {
  if (C) cssInterop(C, { className: 'style' });
});

LoadSkiaWeb({ locateFile: (file) => `/${file}` }).then(() => {
  require('expo-router/entry');
});
