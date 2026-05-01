import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'secondary' | 'link';
type ButtonSize = 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const variantStyles = {
      default: 'bg-amber-500 text-black hover:bg-amber-600',
      outline: 'border border-white/10 bg-transparent text-white hover:bg-white/5',
      ghost: 'bg-transparent text-white hover:bg-white/10',
      secondary: 'bg-white/10 text-white hover:bg-white/20',
      link: 'bg-transparent text-amber-500 hover:text-amber-400 underline-offset-4 hover:underline',
    };
    const sizeStyles = {
      sm: 'h-9 px-3 text-sm',
      lg: 'h-14 px-6 text-base',
      icon: 'h-10 w-10 p-0',
      undefined: 'h-12 px-5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size ?? 'undefined'], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
