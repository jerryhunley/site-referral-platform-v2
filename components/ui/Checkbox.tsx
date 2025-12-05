'use client';

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, indeterminate = false, error, className = '', id, checked, disabled, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-') || generatedId;

    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <motion.div
            className={`
              w-5 h-5 rounded-md border-2 cursor-pointer
              flex items-center justify-center
              transition-colors duration-200
              ${checked || indeterminate
                ? 'bg-mint border-mint'
                : 'bg-bg-secondary/50 dark:bg-bg-tertiary/50 border-glass-border'
              }
              ${error ? 'border-error' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-mint/70'}
            `}
            whileTap={!disabled ? { scale: 0.9 } : undefined}
            onClick={() => {
              if (!disabled) {
                const input = document.getElementById(checkboxId!) as HTMLInputElement;
                input?.click();
              }
            }}
          >
            <motion.div
              initial={false}
              animate={{
                scale: checked || indeterminate ? 1 : 0,
                opacity: checked || indeterminate ? 1 : 0,
              }}
              transition={{ duration: 0.15 }}
            >
              {indeterminate ? (
                <Minus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              ) : (
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              )}
            </motion.div>
          </motion.div>
        </div>

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={checkboxId}
                className={`
                  block text-sm font-medium cursor-pointer
                  ${disabled ? 'text-text-muted cursor-not-allowed' : 'text-text-primary'}
                `}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-text-muted mt-0.5">{description}</p>
            )}
            {error && (
              <p className="text-sm text-error mt-1">{error}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
