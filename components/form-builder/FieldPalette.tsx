'use client';

import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Mail,
  User,
  Phone,
  MapPin,
  CheckSquare,
  Calculator,
  Calendar,
  Type,
  AlignLeft,
  CheckCircle,
  Hash,
  Circle,
  Building2,
  Minus,
  FileText,
  ArrowRight,
  SeparatorHorizontal,
  Send,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type FieldType,
  type FieldCategory,
  getFieldsByCategory,
  FIELD_REGISTRY,
} from '@/lib/types/form-builder';

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Clock,
  Mail,
  User,
  Phone,
  MapPin,
  CheckSquare,
  Calculator,
  Calendar,
  Type,
  AlignLeft,
  CheckCircle,
  Hash,
  Circle,
  Building2,
  Minus,
  FileText,
  ArrowRight,
  FileBreak: SeparatorHorizontal,
  Send,
};

interface DraggableFieldItemProps {
  fieldType: FieldType;
}

function DraggableFieldItem({ fieldType }: DraggableFieldItemProps) {
  const metadata = FIELD_REGISTRY[fieldType];
  const Icon = iconMap[metadata.icon] || Type;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${fieldType}`,
    data: {
      type: 'palette-field',
      fieldType,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing',
        'bg-bg-tertiary/50 hover:bg-bg-tertiary border border-transparent hover:border-glass-border',
        'transition-all duration-150 group',
        isDragging && 'opacity-50 scale-95'
      )}
    >
      <GripVertical className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="p-1.5 rounded-md bg-mint/10">
        <Icon className="w-3.5 h-3.5 text-mint" />
      </div>
      <span className="text-sm text-text-primary truncate">{metadata.label}</span>
    </div>
  );
}

interface PaletteSectionProps {
  title: string;
  category: FieldCategory;
  defaultOpen?: boolean;
}

function PaletteSection({ title, category, defaultOpen = false }: PaletteSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const fields = getFieldsByCategory(category);

  return (
    <div className="border-b border-glass-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg-tertiary/50 transition-colors"
      >
        <span className="text-sm font-medium text-text-primary">{title}</span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronRight className="w-4 h-4 text-text-muted" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-1">
              {fields.map((field) => (
                <DraggableFieldItem key={field.type} fieldType={field.type} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FieldPalette() {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-glass-border">
        <h2 className="text-sm font-semibold text-text-primary">Fields</h2>
        <p className="text-xs text-text-muted mt-0.5">Drag to add to form</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PaletteSection title="Predefined Fields" category="predefined" defaultOpen />
        <PaletteSection title="Standard Fields" category="standard" />
        <PaletteSection title="Layout Elements" category="layout" />
      </div>
    </div>
  );
}
