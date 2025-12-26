'use client';

import { ChevronDown } from 'lucide-react';
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
  const displayStyle = field.displayStyle || 'radio';

  // Radio button style (default)
  const renderRadioStyle = () => (
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
  );

  // Dropdown style
  const renderDropdownStyle = () => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-3 rounded-xl appearance-none',
          'bg-bg-tertiary border border-glass-border',
          'text-text-primary text-sm',
          'focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint',
          'transition-colors cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          !value && 'text-text-muted'
        )}
      >
        <option value="" disabled>
          {field.placeholder || 'Select an option...'}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
    </div>
  );

  // Button group style
  const renderButtonStyle = () => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange?.(option.value)}
          disabled={disabled}
          className={cn(
            'flex-1 min-w-[100px] py-3 px-4 rounded-xl text-sm font-medium transition-all',
            value === option.value
              ? 'bg-mint text-white shadow-sm'
              : 'bg-white/40 dark:bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/15 border border-glass-border',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <BaseFieldWrapper field={field} error={error}>
      {displayStyle === 'radio' && renderRadioStyle()}
      {displayStyle === 'dropdown' && renderDropdownStyle()}
      {displayStyle === 'button' && renderButtonStyle()}
    </BaseFieldWrapper>
  );
}
