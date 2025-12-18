'use client';

import { type FieldConfig } from '@/lib/types/form-builder';
import { BaseFieldWrapper } from './FieldRenderer';

interface NumberEntryFieldProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  value?: number | string;
  onChange?: (value: number | string) => void;
  error?: string;
}

export function NumberEntryField({
  field,
  disabled,
  value = '',
  onChange,
  error,
}: NumberEntryFieldProps) {
  const { min, max } = field.validation || {};

  return (
    <BaseFieldWrapper field={field} error={error}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={field.placeholder || '0'}
        disabled={disabled}
        min={min}
        max={max}
        className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      />
    </BaseFieldWrapper>
  );
}
