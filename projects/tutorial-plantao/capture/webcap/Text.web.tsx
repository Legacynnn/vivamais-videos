import * as React from 'react';
import { Text as RNText } from 'react-native';

import { cn } from '~/lib/platform/cn';

export function Text({ className, ...props }: React.ComponentPropsWithoutRef<typeof RNText> & { className?: string }) {
  return <RNText className={cn('text-[17px] leading-6 text-foreground', className)} {...props} />;
}
