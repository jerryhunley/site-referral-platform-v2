'use client';

import { type FieldConfig } from '@/lib/types/form-builder';
import { BaseFieldWrapper } from './FieldRenderer';

interface LastNameFieldProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function LastNameField({
  field,
  disabled,
  value = '',
  onChange,
  error,
}: LastNameFieldProps) {
  return (
    <BaseFieldWrapper field={field} error={error}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={field.placeholder || 'Doe'}
        disabled={disabled}
        autoComplete="family-name"
        className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      />
    </BaseFieldWrapper>
  );
}
