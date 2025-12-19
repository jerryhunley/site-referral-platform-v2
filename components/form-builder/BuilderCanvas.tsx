'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import {
  GripVertical,
  Trash2,
  Copy,
  Pencil,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormBuilder } from '@/lib/context/FormBuilderContext';
import { type FieldConfig } from '@/lib/types/form-builder';
import { FieldRenderer } from './fields/FieldRenderer';

interface SortableFieldProps {
  field: FieldConfig;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function SortableField({
  field,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
}: SortableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group p-4 rounded-xl border transition-all duration-150',
        'backdrop-blur-sm',
        isSelected
          ? 'border-white/60 dark:border-white/20 bg-white/50 dark:bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_4px_16px_rgba(0,0,0,0.06)]'
          : 'border-white/40 dark:border-white/10 bg-white/30 dark:bg-white/8 hover:bg-white/40 dark:hover:bg-white/12 hover:border-white/50 dark:hover:border-white/15',
        isDragging && 'opacity-50 z-50'
      )}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg',
          'cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity',
          'hover:bg-white/40 dark:hover:bg-white/10'
        )}
      >
        <GripVertical className="w-4 h-4 text-text-muted" />
      </div>

      {/* Actions */}
      <div
        className={cn(
          'absolute right-3 top-3 flex items-center gap-1.5',
          'opacity-0 group-hover:opacity-100 transition-opacity z-10'
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 rounded-lg hover:bg-white/40 dark:hover:bg-white/10 text-text-muted hover:text-mint transition-colors"
          title="Edit field"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="p-1.5 rounded-lg hover:bg-white/40 dark:hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors"
          title="Duplicate field"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors"
          title="Delete field"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Field Content */}
      <div className="pl-8 pr-24">
        <FieldRenderer field={field} isPreview={false} disabled />
      </div>
    </div>
  );
}

function EmptyCanvasState() {
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas-empty',
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-1 flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-colors',
        isOver ? 'border-mint bg-mint/5' : 'border-glass-border'
      )}
    >
      <div className="w-16 h-16 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
        <Plus className="w-8 h-8 text-text-muted" />
      </div>
      <p className="text-text-primary font-medium mb-1">Start building your form</p>
      <p className="text-sm text-text-muted text-center max-w-xs">
        Drag fields from the left panel and drop them here to create your form
      </p>
    </div>
  );
}

function DropIndicator() {
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas-drop-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'h-14 rounded-xl border-2 border-dashed flex items-center justify-center transition-all',
        isOver
          ? 'border-mint bg-mint/10'
          : 'border-glass-border hover:border-mint/50'
      )}
    >
      <span className="text-sm text-text-muted">
        {isOver ? 'Drop here to add field' : '+ Add field here'}
      </span>
    </div>
  );
}

export function BuilderCanvas() {
  const {
    state,
    selectField,
    removeField,
    duplicateField,
    setSelectedPage,
    addPage,
    removePage,
    updatePage,
  } = useFormBuilder();

  const currentPage = state.form.pages[state.selectedPageIndex];
  const fields = currentPage?.fieldIds.map((id) => state.form.fields[id]).filter(Boolean) || [];

  const handleEdit = (fieldId: string) => {
    // Select field opens the config panel
    selectField(fieldId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Form Header */}
      <div className="px-6 py-4 border-b border-glass-border bg-bg-tertiary/30">
        <h2 className="text-lg font-semibold text-text-primary">{state.form.name}</h2>
        {state.form.description && (
          <p className="text-sm text-text-muted mt-1">{state.form.description}</p>
        )}
      </div>

      {/* Page Tabs (Wizard Mode) */}
      {state.form.mode === 'wizard' && (
        <div className="px-4 py-2 border-b border-glass-border flex items-center gap-2 overflow-x-auto">
          {state.form.pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => setSelectedPage(index)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap',
                state.selectedPageIndex === index
                  ? 'bg-mint text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              )}
            >
              {page.title}
            </button>
          ))}
          <button
            onClick={() => addPage()}
            className="p-2 rounded-xl text-text-muted hover:text-mint hover:bg-bg-tertiary transition-colors"
            title="Add page"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header (Wizard Mode) */}
      {state.form.mode === 'wizard' && currentPage && (
        <div className="px-6 py-4 border-b border-glass-border">
          <input
            type="text"
            value={currentPage.title}
            onChange={(e) => updatePage(state.selectedPageIndex, { title: e.target.value })}
            className="text-lg font-semibold text-text-primary bg-transparent border-none focus:outline-none focus:ring-0 w-full"
            placeholder="Page Title"
          />
          <input
            type="text"
            value={currentPage.description || ''}
            onChange={(e) => updatePage(state.selectedPageIndex, { description: e.target.value })}
            className="text-sm text-text-muted bg-transparent border-none focus:outline-none focus:ring-0 w-full mt-1"
            placeholder="Add a description..."
          />
        </div>
      )}

      {/* Canvas Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {fields.length === 0 ? (
          <EmptyCanvasState />
        ) : (
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  isSelected={state.selectedFieldId === field.id}
                  onSelect={() => selectField(field.id)}
                  onEdit={() => handleEdit(field.id)}
                  onDelete={() => removeField(field.id)}
                  onDuplicate={() => duplicateField(field.id)}
                />
              ))}
              <DropIndicator />
            </div>
          </SortableContext>
        )}
      </div>

      {/* Page Actions (Wizard Mode) */}
      {state.form.mode === 'wizard' && state.form.pages.length > 1 && (
        <div className="px-6 py-3 border-t border-glass-border flex items-center justify-between">
          <span className="text-sm text-text-muted">
            Page {state.selectedPageIndex + 1} of {state.form.pages.length}
          </span>
          <button
            onClick={() => removePage(state.selectedPageIndex)}
            className="text-sm text-error hover:underline"
          >
            Remove this page
          </button>
        </div>
      )}
    </div>
  );
}
