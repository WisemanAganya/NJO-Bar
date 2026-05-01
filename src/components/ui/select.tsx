import * as React from 'react';
import { cn } from '@/lib/utils';

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const Select = ({ value, defaultValue = '', onValueChange, children, className, ...props }: SelectProps) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const selectedValue = value !== undefined ? value : internalValue;

  const handleSelect = (next: string) => {
    if (value === undefined) {
      setInternalValue(next);
    }
    onValueChange?.(next);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value: selectedValue, onValueChange: handleSelect, open, setOpen }}>
      <div className={cn('relative', className)} {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) return null;

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn('w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-white shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20', className)}
      {...props}
    >
      {children}
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}
export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(({ placeholder, className, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) return null;

  return (
    <span ref={ref} className={cn('block truncate text-white/90', className)} {...props}>
      {context.value || placeholder}
    </span>
  );
});
SelectValue.displayName = 'SelectValue';

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context?.open) return null;

  return (
    <div
      ref={ref}
      className={cn('absolute z-20 mt-2 w-full rounded-3xl border border-white/10 bg-zinc-950 p-3 shadow-xl shadow-black/40', className)}
      {...props}
    >
      {children}
    </div>
  );
});
SelectContent.displayName = 'SelectContent';

export interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}
export const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ value, className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) return null;

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => context.onValueChange(value)}
        className={cn(
          'w-full rounded-2xl px-4 py-3 text-left text-white transition-colors hover:bg-white/5',
          className
        )}
        {...props}
      >
        {children ?? value}
      </button>
    );
  }
);
SelectItem.displayName = 'SelectItem';
