'use client';

import { type FieldConfig } from '@/lib/types/form-builder';
import { BaseFieldWrapper } from './FieldRenderer';

interface LongTextFieldProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function LongTextField({
  field,
  disabled,
  value = '',
  onChange,
  error,
}: LongTextFieldProps) {
  const maxLength = field.validation?.maxLength;

  return (
    <BaseFieldWrapper field={field} error={error}>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={field.placeholder}
          disabled={disabled}
          rows={4}
          maxLength={maxLength}
          className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-none"
        />
        {maxLength && (
          <span className="absolute bottom-2 right-3 text-xs text-text-muted">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </BaseFieldWrapper>
  );
}
