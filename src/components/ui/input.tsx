import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, hasError, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center">
        {icon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-slate-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          className={cn(
            'w-full bg-[#070A11] border rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-500 transition-all outline-none font-sans',
            'focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            icon ? 'pl-9' : 'pl-3',
            hasError
              ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20 text-rose-200'
              : 'border-slate-800/90 hover:border-slate-700',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
