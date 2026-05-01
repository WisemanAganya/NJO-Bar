import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('overflow-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent', className)}
    {...props}
  />
));
ScrollArea.displayName = 'ScrollArea';
