import { createElement, type ReactNode } from 'react';
import { View } from 'react-native';

export function SheetBackdrop({ open, height, children }: { open: boolean; height: number; children: ReactNode }) {
  if (!open) return null;
  return createElement(
    View,
    { style: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 40 } },
    createElement(View, { style: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(23,21,30,0.4)' } }),
    createElement(
      View,
      { style: { position: 'absolute', left: 0, right: 0, bottom: 0, height, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden', backgroundColor: '#fff' } },
      children,
    ),
  );
}
