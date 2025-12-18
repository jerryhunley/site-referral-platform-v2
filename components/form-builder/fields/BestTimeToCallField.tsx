'use client';

import { type FieldConfig } from '@/lib/types/form-builder';
import { BaseFieldWrapper } from './FieldRenderer';
import { ChevronDown } from 'lucide-react';

interface BestTimeToCallFieldProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function BestTimeToCallField({
  field,
  disabled,
  value = '',
  onChange,
  error,
}: BestTimeToCallFieldProps) {
  const options = field.options || [
    { id: '1', label: 'Morning (8am - 12pm)', value: 'morning' },
    { id: '2', label: 'Afternoon (12pm - 5pm)', value: 'afternoon' },
    { id: '3', label: 'Evening (5pm - 8pm)', value: 'evening' },
  ];

  return (
    <BaseFieldWrapper field={field} error={error}>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint disabled:opacity-50 disabled:cursor-not-allowed transition-colors appearance-none"
        >
          <option value="">Select a time...</option>
          {options.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
      </div>
    </BaseFieldWrapper>
  );
}
