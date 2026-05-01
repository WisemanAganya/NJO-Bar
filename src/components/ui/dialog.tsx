import * as React from 'react';
import { cn } from '@/lib/utils';

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dialog = ({ open, defaultOpen, onOpenChange, children, ...props }: DialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const value = {
    open: isControlled ? open! : internalOpen,
    onOpenChange: (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
  };

  return (
    <DialogContext.Provider value={value}>
      <div {...props}>{children}</div>
    </DialogContext.Provider>
  );
};

export interface DialogTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild, children, className, ...props }, ref) => {
    const context = React.useContext(DialogContext);
    if (!context) return null;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      context.onOpenChange(!context.open);
      if (props.onClick) props.onClick(event);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref,
        onClick: handleClick,
        ...props,
        className: cn((children.props as any).className, className),
      });
    }

    return (
      <button ref={ref} type="button" onClick={handleClick} className={cn('inline-flex items-center', className)} {...props} />
    );
  }
);
DialogTrigger.displayName = 'DialogTrigger';

import { createPortal } from 'react-dom';

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(({ className, ...props }, ref) => {
  const context = React.useContext(DialogContext);
  if (!context || !context.open) return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        ref={ref}
        className={cn(
          'relative animate-in fade-in zoom-in duration-300',
          className
        )}
        {...props}
      />
    </div>,
    document.body
  );
});
DialogContent.displayName = 'DialogContent';

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-2 p-6', className)} {...props} />
));
DialogHeader.displayName = 'DialogHeader';

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn('text-2xl font-semibold text-white', className)} {...props} />
));
DialogTitle.displayName = 'DialogTitle';

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-white/60', className)} {...props} />
  )
);
DialogDescription.displayName = 'DialogDescription';

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-wrap items-center justify-end gap-3 p-6 pt-0', className)} {...props} />
));
DialogFooter.displayName = 'DialogFooter';
