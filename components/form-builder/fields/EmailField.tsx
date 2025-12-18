'use client';

import { type FieldConfig } from '@/lib/types/form-builder';
import { BaseFieldWrapper } from './FieldRenderer';

interface EmailFieldProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function EmailField({
  field,
  disabled,
  value = '',
  onChange,
  error,
}: EmailFieldProps) {
  return (
    <BaseFieldWrapper field={field} error={error}>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={field.placeholder || 'you@example.com'}
        disabled={disabled}
        className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      />
    </BaseFieldWrapper>
  );
}
