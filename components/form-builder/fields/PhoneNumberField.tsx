'use client';

import { useState, useCallback } from 'react';
import { type FieldConfig } from '@/lib/types/form-builder';
import { BaseFieldWrapper } from './FieldRenderer';

interface PhoneNumberFieldProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

function formatPhoneNumber(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');

  // Format as (XXX) XXX-XXXX
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }
}

export function PhoneNumberField({
  field,
  disabled,
  value = '',
  onChange,
  error,
}: PhoneNumberFieldProps) {
  const [displayValue, setDisplayValue] = useState(formatPhoneNumber(value));

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      setDisplayValue(formatted);
      // Store just the digits
      const digits = formatted.replace(/\D/g, '');
      onChange?.(digits);
    },
    [onChange]
  );

  return (
    <BaseFieldWrapper field={field} error={error}>
      <input
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder={field.placeholder || '(555) 123-4567'}
        disabled={disabled}
        className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      />
    </BaseFieldWrapper>
  );
}
