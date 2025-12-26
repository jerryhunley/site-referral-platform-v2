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
  GitBranch,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormBuilder } from '@/lib/context/FormBuilderContext';
import { type FieldConfig } from '@/lib/types/form-builder';
import { FieldRenderer } from './fields/FieldRenderer';

// Width classes for flex layout
const widthClasses = {
  full: 'w-full',
  half: 'w-full sm:w-[calc(50%-0.5rem)]',
  third: 'w-full sm:w-[calc(33.333%-0.667rem)]',
};

interface SortableFieldProps {
  field: FieldConfig;
  isSelected: boolean;
  isConditional: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onConditional: () => void;
}

function SortableField({
  field,
  isSelected,
  isConditional,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onConditional,
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
        widthClasses[field.width],
        'relative group p-4 rounded-xl transition-all duration-150',
        'glass-card-inset',
        isSelected
          ? 'ring-2 ring-mint/40 shadow-[0_4px_16px_rgba(46,155,115,0.1)]'
          : 'hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
        isDragging && 'opacity-50 z-50',
        // Indent conditional fields
        isConditional && 'ml-8 border-l-2 border-vista-blue/30'
      )}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          'absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full',
          'cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-all',
          'glass-button hover:scale-110 active:scale-95'
        )}
      >
        <GripVertical className="w-4 h-4 text-text-muted" />
      </div>

      {/* Actions */}
      <div
        className={cn(
          'absolute right-3 top-3 flex items-center gap-1',
          'opacity-0 group-hover:opacity-100 transition-opacity z-10'
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 rounded-full glass-button text-text-muted hover:text-mint hover:scale-110 active:scale-95 transition-all"
          title="Edit field"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConditional();
          }}
          className={cn(
            'p-1.5 rounded-full transition-all hover:scale-110 active:scale-95',
            field.conditionalVisibility
              ? 'bg-vista-blue/15 text-vista-blue hover:bg-vista-blue/25'
              : 'glass-button text-text-muted hover:text-vista-blue'
          )}
          title={field.conditionalVisibility ? 'Edit conditions' : 'Add conditions'}
        >
          <GitBranch className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          className="p-1.5 rounded-full glass-button text-text-muted hover:text-text-primary hover:scale-110 active:scale-95 transition-all"
          title="Duplicate field"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded-full glass-button text-text-muted hover:text-error hover:scale-110 active:scale-95 transition-all"
          title="Delete field"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Conditional indicator badge - top left of card */}
      {isConditional && (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 mb-3 rounded-full bg-vista-blue/15 text-vista-blue">
          <GitBranch className="w-3 h-3" />
          <span className="text-[10px] font-semibold uppercase tracking-wide">Conditional</span>
        </div>
      )}

      {/* Field Content */}
      <div className="pl-8 pr-24">
        <FieldRenderer field={field} isPreview={false} disabled />
      </div>
    </div>
  );
}

interface EmptyCanvasStateProps {
  onAddField: () => void;
}

function EmptyCanvasState({ onAddField }: EmptyCanvasStateProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas-empty',
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-1 flex flex-col items-center justify-center p-8 rounded-xl glass-card-inset transition-all',
        isOver && 'ring-2 ring-mint/40 bg-mint/5'
      )}
    >
      <motion.button
        onClick={onAddField}
        className="w-16 h-16 rounded-full! glass-button flex items-center justify-center mb-4 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-8 h-8 text-text-muted group-hover:text-mint transition-colors" />
      </motion.button>
      <p className="text-text-primary font-medium mb-1">Start building your form</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
        Click the button above to add fields
      </p>
    </div>
  );
}

interface AddFieldButtonProps {
  afterFieldId: string | null;
  onClick: () => void;
}

function AddFieldButton({ afterFieldId, onClick }: AddFieldButtonProps) {
  return (
    <div className="w-full flex items-center justify-center py-3">
      <motion.button
        onClick={onClick}
        className={cn(
          'p-1.5 rounded-full glass-button',
          'text-text-muted/60 hover:text-mint',
          'transition-all duration-200'
        )}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        title="Add field"
      >
        <Plus className="w-4 h-4" />
      </motion.button>
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
    openConfigPanel,
    removeField,
    duplicateField,
    setSelectedPage,
    addPage,
    removePage,
    updatePage,
    openFieldPaletteModal,
    openConditionalFieldPaletteModal,
  } = useFormBuilder();

  const currentPage = state.form.pages[state.selectedPageIndex];
  const fields = currentPage?.fieldIds.map((id) => state.form.fields[id]).filter(Boolean) || [];

  const handleEdit = (fieldId: string) => {
    // Open config panel explicitly when Edit is clicked
    openConfigPanel(fieldId);
  };

  const handleConditional = (fieldId: string) => {
    // Open field palette modal to add a conditional field
    openConditionalFieldPaletteModal(fieldId);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Form Header */}
      <div className="px-6 py-4">
        <h2 className="text-lg font-semibold text-text-primary">{state.form.name}</h2>
        {state.form.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{state.form.description}</p>
        )}
      </div>

      {/* Header divider */}
      <div className="mx-6 dotted-divider" />

      {/* Page Tabs (Wizard Mode) */}
      {state.form.mode === 'wizard' && (
        <div className="px-4 py-3 flex items-center gap-2 overflow-x-auto">
          {state.form.pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => setSelectedPage(index)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                state.selectedPageIndex === index
                  ? 'bg-mint text-white shadow-sm'
                  : 'glass-button text-text-secondary hover:text-text-primary hover:scale-105 active:scale-95'
              )}
            >
              {page.title}
            </button>
          ))}
          <button
            onClick={() => addPage()}
            className="p-1.5 rounded-full glass-button text-text-muted hover:text-mint hover:scale-110 active:scale-95 transition-all"
            title="Add page"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header (Wizard Mode) */}
      {state.form.mode === 'wizard' && currentPage && (
        <>
          <div className="mx-6 dotted-divider" />
          <div className="px-6 py-4">
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
              className="text-sm text-gray-500 dark:text-gray-400 bg-transparent border-none focus:outline-none focus:ring-0 w-full mt-1"
              placeholder="Add a description..."
            />
          </div>
        </>
      )}

      {/* Canvas Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {fields.length === 0 ? (
          <EmptyCanvasState onAddField={() => openFieldPaletteModal(null)} />
        ) : (
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-4">
              {/* Add button at the start */}
              <AddFieldButton
                afterFieldId={null}
                onClick={() => openFieldPaletteModal(null)}
              />

              {/* All fields in a single flex-wrap container for side-by-side layout */}
              <div className="flex flex-wrap gap-4">
                {fields.map((field) => (
                  <SortableField
                    key={field.id}
                    field={field}
                    isSelected={state.selectedFieldId === field.id}
                    isConditional={!!field.conditionalVisibility}
                    onSelect={() => selectField(field.id)}
                    onEdit={() => handleEdit(field.id)}
                    onDelete={() => removeField(field.id)}
                    onDuplicate={() => duplicateField(field.id)}
                    onConditional={() => handleConditional(field.id)}
                  />
                ))}
              </div>

              {/* Add button at the end */}
              <AddFieldButton
                afterFieldId={fields[fields.length - 1]?.id || null}
                onClick={() => openFieldPaletteModal(fields[fields.length - 1]?.id || null)}
              />
            </div>
          </SortableContext>
        )}
      </div>

      {/* Page Actions (Wizard Mode) */}
      {state.form.mode === 'wizard' && state.form.pages.length > 1 && (
        <>
          <div className="mx-6 dotted-divider" />
          <div className="px-6 py-3 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Page {state.selectedPageIndex + 1} of {state.form.pages.length}
            </span>
            <button
              onClick={() => removePage(state.selectedPageIndex)}
              className="px-3 py-1.5 text-xs font-medium text-text-primary glass-button rounded-full hover:text-error hover:scale-105 active:scale-95 transition-all"
            >
              Remove this page
            </button>
          </div>
        </>
      )}
    </div>
  );
}
