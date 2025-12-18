'use client';

import { type FieldConfig } from '@/lib/types/form-builder';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface AcceptTermsFieldProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
  error?: string;
}

export function AcceptTermsField({
  field,
  disabled,
  value = false,
  onChange,
  error,
}: AcceptTermsFieldProps) {
  return (
    <div className="w-full">
      <label
        className={cn(
          'flex items-start gap-3 cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div
          className={cn(
            'mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0',
            value ? 'border-mint bg-mint' : 'border-glass-border'
          )}
        >
          {value && <Check className="w-3 h-3 text-white" />}
        </div>
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <span className="text-sm text-text-primary">
          {field.label}
          {field.required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      {field.helperText && !error && (
        <p className="mt-1.5 ml-8 text-xs text-text-muted">{field.helperText}</p>
      )}
      {error && <p className="mt-1.5 ml-8 text-xs text-error">{error}</p>}
    </div>
  );
}
