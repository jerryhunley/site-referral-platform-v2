'use client';

import { type FieldConfig } from '@/lib/types/form-builder';

interface FreeFormTextElementProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
}

export function FreeFormTextElement({ field }: FreeFormTextElementProps) {
  return (
    <div className="prose prose-sm max-w-none">
      <p className="text-text-secondary whitespace-pre-wrap">
        {field.content || 'Enter your text here...'}
      </p>
    </div>
  );
}
