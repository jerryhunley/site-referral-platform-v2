'use client';

import { useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import {
  Search,
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

interface DraggableFieldCardProps {
  fieldType: FieldType;
}

function DraggableFieldCard({ fieldType }: DraggableFieldCardProps) {
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
        'flex flex-col items-center gap-2 p-3 rounded-xl cursor-grab active:cursor-grabbing',
        'bg-white/35 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/10',
        'hover:bg-white/50 dark:hover:bg-white/15 hover:border-white/70 dark:hover:border-white/15',
        'hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,255,255,0.4)]',
        'dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.1)]',
        'transition-all duration-150',
        isDragging && 'opacity-50 scale-95'
      )}
    >
      <div className="w-10 h-10 rounded-lg bg-mint/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-mint" />
      </div>
      <span className="text-xs font-medium text-text-primary text-center leading-tight">
        {metadata.label}
      </span>
    </div>
  );
}

const categories: { key: FieldCategory; label: string }[] = [
  { key: 'predefined', label: 'Predefined' },
  { key: 'standard', label: 'Standard' },
  { key: 'layout', label: 'Layout' },
];

export function FieldPalette() {
  const [activeCategory, setActiveCategory] = useState<FieldCategory>('predefined');
  const [searchQuery, setSearchQuery] = useState('');

  // Get fields for active category and filter by search
  const filteredFields = useMemo(() => {
    const categoryFields = getFieldsByCategory(activeCategory);

    if (!searchQuery.trim()) {
      return categoryFields;
    }

    const query = searchQuery.toLowerCase();
    return categoryFields.filter((field) =>
      field.label.toLowerCase().includes(query) ||
      field.type.toLowerCase().includes(query)
    );
  }, [activeCategory, searchQuery]);

  // Also search across all categories when search is active
  const allMatchingFields = useMemo(() => {
    if (!searchQuery.trim()) {
      return null;
    }

    const query = searchQuery.toLowerCase();
    const allFields = [
      ...getFieldsByCategory('predefined'),
      ...getFieldsByCategory('standard'),
      ...getFieldsByCategory('layout'),
    ];

    return allFields.filter((field) =>
      field.label.toLowerCase().includes(query) ||
      field.type.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const displayFields = searchQuery.trim() ? allMatchingFields : filteredFields;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-glass-border">
        <h2 className="text-sm font-semibold text-text-primary">Fields</h2>
        <p className="text-xs text-text-muted mt-0.5">Drag to add to form</p>
      </div>

      {/* Search Input */}
      <div className="px-4 py-3 border-b border-glass-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fields..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-colors"
          />
        </div>
      </div>

      {/* Category Tabs */}
      {!searchQuery.trim() && (
        <div className="px-3 py-2 border-b border-glass-border">
          <div className="flex gap-1 p-1 bg-white/30 dark:bg-white/10 backdrop-blur-sm rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  'flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all',
                  activeCategory === cat.key
                    ? 'bg-white/60 dark:bg-white/15 text-text-primary shadow-sm backdrop-blur-sm'
                    : 'text-text-muted hover:text-text-secondary hover:bg-white/30 dark:hover:bg-white/10'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Label */}
      {searchQuery.trim() && (
        <div className="px-4 py-2 border-b border-glass-border">
          <span className="text-xs text-text-muted">
            {displayFields?.length || 0} result{displayFields?.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
          </span>
        </div>
      )}

      {/* Fields Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {displayFields && displayFields.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {displayFields.map((field) => (
              <DraggableFieldCard key={field.type} fieldType={field.type} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="w-8 h-8 text-text-muted mb-2" />
            <p className="text-sm text-text-muted">No fields found</p>
            <p className="text-xs text-text-muted mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
