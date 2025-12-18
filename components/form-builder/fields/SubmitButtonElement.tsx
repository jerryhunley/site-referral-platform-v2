'use client';

import { type FieldConfig, type FormStyling } from '@/lib/types/form-builder';

interface SubmitButtonElementProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  styling?: FormStyling;
  onClick?: () => void;
}

export function SubmitButtonElement({
  field,
  disabled,
  styling,
  onClick,
}: SubmitButtonElementProps) {
  const primaryColor = styling?.primaryColor || '#53CA97';

  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 px-6 rounded-xl font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: primaryColor }}
    >
      {field.label || 'Submit'}
    </button>
  );
}
