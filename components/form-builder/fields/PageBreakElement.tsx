'use client';

import { type FieldConfig } from '@/lib/types/form-builder';
import { SeparatorHorizontal } from 'lucide-react';

interface PageBreakElementProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
}

export function PageBreakElement({ field }: PageBreakElementProps) {
  return (
    <div className="py-4 flex items-center justify-center gap-3">
      <div className="flex-1 h-px bg-glass-border" />
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-tertiary border border-glass-border">
        <SeparatorHorizontal className="w-4 h-4 text-text-muted" />
        <span className="text-xs font-medium text-text-muted">Page Break</span>
      </div>
      <div className="flex-1 h-px bg-glass-border" />
    </div>
  );
}
