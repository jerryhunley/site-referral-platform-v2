'use client';

import { type FieldConfig } from '@/lib/types/form-builder';
import { BaseFieldWrapper } from './FieldRenderer';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface MultipleChoiceFieldProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  value?: string[];
  onChange?: (value: string[]) => void;
  error?: string;
}

export function MultipleChoiceField({
  field,
  disabled,
  value = [],
  onChange,
  error,
}: MultipleChoiceFieldProps) {
  const options = field.options || [];

  const handleToggle = (optionValue: string) => {
    if (disabled) return;

    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange?.(newValue);
  };

  return (
    <BaseFieldWrapper field={field} error={error}>
      <div className="space-y-2">
        {options.map((option) => {
          const isChecked = value.includes(option.value);
          return (
            <label
              key={option.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors',
                'bg-bg-tertiary border border-glass-border',
                isChecked && 'border-mint bg-mint/5',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors',
                  isChecked ? 'border-mint bg-mint' : 'border-glass-border'
                )}
              >
                {isChecked && <Check className="w-3 h-3 text-white" />}
              </div>
              <input
                type="checkbox"
                value={option.value}
                checked={isChecked}
                onChange={() => handleToggle(option.value)}
                disabled={disabled}
                className="sr-only"
              />
              <span className="text-sm text-text-primary">{option.label}</span>
            </label>
          );
        })}
      </div>
    </BaseFieldWrapper>
  );
}
