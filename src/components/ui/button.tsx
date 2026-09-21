import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-sans font-medium transition-all duration-150 active:scale-97 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50',
  {
    variants: {
      variant: {
        primary:
          'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 border border-indigo-500/30',
        secondary:
          'bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 text-slate-200 hover:text-white backdrop-blur-xl shadow-lg hover:border-slate-700',
        outline:
          'bg-transparent hover:bg-slate-800/60 border border-slate-800 text-slate-300 hover:text-white',
        ghost:
          'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-white',
        success:
          'bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 hover:text-emerald-200 shadow-sm',
        danger:
          'bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-rose-300 hover:text-rose-200 shadow-sm',
      },
      size: {
        sm: 'py-1 px-2.5 text-xs rounded-xl gap-1.5',
        md: 'py-1.5 px-3.5 text-xs rounded-xl gap-2 font-semibold',
        lg: 'py-2.5 px-4 text-sm rounded-2xl gap-2.5 font-semibold',
        icon: 'p-2 rounded-xl shrink-0',
        'icon-sm': 'p-1.5 rounded-lg shrink-0',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
