'use client';

import { type FieldConfig, type FormStyling } from '@/lib/types/form-builder';
import { ArrowRight } from 'lucide-react';

interface NextButtonElementProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  styling?: FormStyling;
  onClick?: () => void;
}

export function NextButtonElement({
  field,
  disabled,
  styling,
  onClick,
}: NextButtonElementProps) {
  const primaryColor = styling?.primaryColor || '#53CA97';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: primaryColor }}
    >
      {field.label || 'Next'}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
