'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5
            bg-bg-secondary/50 dark:bg-bg-tertiary/50
            border border-glass-border
            rounded-xl
            text-text-primary
            placeholder:text-text-muted
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-error focus:ring-error/50 focus:border-error' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
