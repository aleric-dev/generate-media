import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 font-mono font-semibold whitespace-nowrap transition-colors select-none',
  {
    variants: {
      variant: {
        neutral: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
        success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
        warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
        info: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
        danger: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5 rounded-full',
        md: 'text-xs px-2.5 py-0.5 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'sm',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge: React.FC<BadgeProps> = ({ className, variant, size, ...props }) => {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
};
