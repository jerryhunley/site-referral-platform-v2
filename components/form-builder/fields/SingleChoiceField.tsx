'use client';

import { type FieldConfig } from '@/lib/types/form-builder';
import { BaseFieldWrapper } from './FieldRenderer';
import { cn } from '@/lib/utils';

interface SingleChoiceFieldProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function SingleChoiceField({
  field,
  disabled,
  value = '',
  onChange,
  error,
}: SingleChoiceFieldProps) {
  const options = field.options || [];

  return (
    <BaseFieldWrapper field={field} error={error}>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors',
              'bg-bg-tertiary border border-glass-border',
              value === option.value && 'border-mint bg-mint/5',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                value === option.value
                  ? 'border-mint bg-mint'
                  : 'border-glass-border'
              )}
            >
              {value === option.value && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <input
              type="radio"
              name={field.name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)}
              disabled={disabled}
              className="sr-only"
            />
            <span className="text-sm text-text-primary">{option.label}</span>
          </label>
        ))}
      </div>
    </BaseFieldWrapper>
  );
}
