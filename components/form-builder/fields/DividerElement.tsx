'use client';

import { type FieldConfig } from '@/lib/types/form-builder';

interface DividerElementProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
}

export function DividerElement({ field }: DividerElementProps) {
  return (
    <div className="py-2">
      <hr className="border-glass-border" />
    </div>
  );
}
