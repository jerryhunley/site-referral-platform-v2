'use client';

import { useState, useMemo } from 'react';
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
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type FieldType,
  type FieldCategory,
  getFieldsByCategory,
  FIELD_REGISTRY,
} from '@/lib/types/form-builder';
import { Modal } from '@/components/ui/Modal';

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

interface ClickableFieldCardProps {
  fieldType: FieldType;
  onClick: () => void;
}

function ClickableFieldCard({ fieldType, onClick }: ClickableFieldCardProps) {
  const metadata = FIELD_REGISTRY[fieldType];
  const Icon = iconMap[metadata.icon] || Type;

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-start gap-2 p-4 rounded-3xl',
        'h-[140px] w-full',
        'bg-white/40 dark:bg-white/10 backdrop-blur-sm',
        'border border-white/50 dark:border-white/10',
        'hover:bg-white/60 dark:hover:bg-white/15',
        'hover:border-mint/30 dark:hover:border-mint/30',
        'hover:shadow-[0_4px_20px_rgba(46,155,115,0.1)]',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-mint/50'
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-10 h-10 rounded-full bg-mint/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-mint" />
      </div>
      <div className="flex flex-col items-center gap-1 flex-1 min-h-0">
        <span className="text-sm font-medium text-text-primary text-center leading-tight">
          {metadata.label}
        </span>
        <span className="text-xs text-text-muted text-center line-clamp-2">
          {metadata.description}
        </span>
      </div>
    </motion.button>
  );
}

const categories: { key: FieldCategory; label: string }[] = [
  { key: 'predefined', label: 'Predefined' },
  { key: 'standard', label: 'Standard' },
  { key: 'layout', label: 'Layout' },
];

interface FieldPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectField: (fieldType: FieldType) => void;
}

export function FieldPaletteModal({
  isOpen,
  onClose,
  onSelectField,
}: FieldPaletteModalProps) {
  const [activeCategory, setActiveCategory] = useState<FieldCategory>('predefined');
  const [searchQuery, setSearchQuery] = useState('');

  // Reset state when modal opens
  const handleClose = () => {
    setSearchQuery('');
    setActiveCategory('predefined');
    onClose();
  };

  // Get fields for active category and filter by search
  const filteredFields = useMemo(() => {
    const categoryFields = getFieldsByCategory(activeCategory);

    if (!searchQuery.trim()) {
      return categoryFields;
    }

    const query = searchQuery.toLowerCase();
    return categoryFields.filter(
      (field) =>
        field.label.toLowerCase().includes(query) ||
        field.type.toLowerCase().includes(query) ||
        field.description.toLowerCase().includes(query)
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

    return allFields.filter(
      (field) =>
        field.label.toLowerCase().includes(query) ||
        field.type.toLowerCase().includes(query) ||
        field.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const displayFields = searchQuery.trim() ? allMatchingFields : filteredFields;

  const handleFieldSelect = (fieldType: FieldType) => {
    onSelectField(fieldType);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Field"
      size="lg"
    >
      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fields..."
            className={cn(
              'w-full pl-10 pr-4 py-3 rounded-xl',
              'bg-white/40 dark:bg-white/10 backdrop-blur-sm',
              'border border-white/50 dark:border-white/10',
              'text-sm text-text-primary placeholder:text-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint',
              'transition-colors'
            )}
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/30 dark:hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      {!searchQuery.trim() && (
        <div className="mb-4">
          <div className="flex gap-2 p-1 bg-white/30 dark:bg-white/10 backdrop-blur-sm rounded-full">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  'flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all',
                  activeCategory === cat.key
                    ? 'bg-mint text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/40 dark:hover:bg-white/10'
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
        <div className="mb-4">
          <span className="text-sm text-text-muted">
            {displayFields?.length || 0} result{displayFields?.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
          </span>
        </div>
      )}

      {/* Fields Grid */}
      <div className="min-h-[300px]">
        {displayFields && displayFields.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {displayFields.map((field, index) => (
              <motion.div
                key={field.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: index * 0.02 }}
              >
                <ClickableFieldCard
                  fieldType={field.type}
                  onClick={() => handleFieldSelect(field.type)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-white/40 dark:bg-white/10 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-base font-medium text-text-primary mb-1">No fields found</p>
            <p className="text-sm text-text-muted">Try a different search term</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
