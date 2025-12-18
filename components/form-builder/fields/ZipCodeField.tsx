'use client';

import { type FieldConfig } from '@/lib/types/form-builder';
import { BaseFieldWrapper } from './FieldRenderer';

interface ZipCodeFieldProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function ZipCodeField({
  field,
  disabled,
  value = '',
  onChange,
  error,
}: ZipCodeFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit to 5 characters
    const digits = e.target.value.replace(/\D/g, '').slice(0, 5);
    onChange?.(digits);
  };

  return (
    <BaseFieldWrapper field={field} error={error}>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder={field.placeholder || '12345'}
        disabled={disabled}
        maxLength={5}
        autoComplete="postal-code"
        className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      />
    </BaseFieldWrapper>
  );
}
