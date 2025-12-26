'use client';

import { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import {
  Save,
  Play,
  Undo2,
  Redo2,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

import { useFormBuilder } from '@/lib/context/FormBuilderContext';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { BuilderCanvas } from './BuilderCanvas';
import { FieldConfigPanel } from './FieldConfigPanel';
import { FormTestPanel } from './FormTestPanel';
import { FormSettingsPanel } from './FormSettingsPanel';
import { FieldPaletteModal } from './FieldPaletteModal';
import { type FieldType, FIELD_REGISTRY } from '@/lib/types/form-builder';

export function FormBuilder() {
  const {
    state,
    addField,
    reorderFields,
    selectField,
    undo,
    redo,
    canUndo,
    canRedo,
    toggleTestPanel,
    toggleSettingsPanel,
    markSaved,
    updateFormName,
    openFieldPaletteModal,
    closeFieldPaletteModal,
  } = useFormBuilder();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragType, setActiveDragType] = useState<'palette' | 'canvas' | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(state.form.name);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }

      // Ctrl/Cmd + Shift + Z = Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        if (canRedo) redo();
      }

      // Ctrl/Cmd + S = Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }

      // Delete/Backspace = Remove selected field
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedFieldId) {
        e.preventDefault();
        // This would need removeField from context
      }

      // Escape = Deselect field
      if (e.key === 'Escape') {
        selectField(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo, state.selectedFieldId, selectField]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Determine if dragging from palette or canvas
    if (active.data.current?.type === 'palette-field') {
      setActiveDragType('palette');
    } else {
      setActiveDragType('canvas');
    }
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Handle drag over events for visual feedback
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);
      setActiveDragType(null);

      if (!over) return;

      // Handle dropping from palette to canvas
      if (active.data.current?.type === 'palette-field') {
        const fieldType = active.data.current.fieldType as FieldType;
        const targetFieldId = over.data.current?.fieldId;

        addField(fieldType, state.selectedPageIndex, targetFieldId);
        return;
      }

      // Handle reordering within canvas
      if (active.id !== over.id) {
        const currentPage = state.form.pages[state.selectedPageIndex];
        if (!currentPage) return;

        const oldIndex = currentPage.fieldIds.indexOf(active.id as string);
        const newIndex = currentPage.fieldIds.indexOf(over.id as string);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newFieldIds = [...currentPage.fieldIds];
          newFieldIds.splice(oldIndex, 1);
          newFieldIds.splice(newIndex, 0, active.id as string);
          reorderFields(state.selectedPageIndex, newFieldIds);
        }
      }
    },
    [addField, reorderFields, state.selectedPageIndex, state.form.pages]
  );

  const handleSave = useCallback(() => {
    // For now, save to localStorage
    localStorage.setItem(`form-${state.form.id}`, JSON.stringify(state.form));
    markSaved();
  }, [state.form, markSaved]);

  const handleNameSubmit = useCallback(() => {
    if (tempName.trim()) {
      updateFormName(tempName.trim());
    } else {
      setTempName(state.form.name);
    }
    setIsEditingName(false);
  }, [tempName, updateFormName, state.form.name]);

  // Get active field info for drag overlay
  const getActiveFieldInfo = () => {
    if (!activeId) return null;

    if (activeDragType === 'palette') {
      const fieldType = activeId.replace('palette-', '') as FieldType;
      return FIELD_REGISTRY[fieldType];
    }

    if (activeDragType === 'canvas') {
      const field = state.form.fields[activeId];
      if (field) {
        return FIELD_REGISTRY[field.type];
      }
    }

    return null;
  };

  const activeFieldInfo = getActiveFieldInfo();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              {isEditingName ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleNameSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSubmit();
                    if (e.key === 'Escape') {
                      setTempName(state.form.name);
                      setIsEditingName(false);
                    }
                  }}
                  className="text-xl font-semibold text-text-primary bg-transparent border-b-2 border-mint focus:outline-none px-1"
                  autoFocus
                />
              ) : (
                <h1
                  className="text-xl font-semibold text-text-primary cursor-pointer hover:text-mint transition-colors"
                  onClick={() => {
                    setTempName(state.form.name);
                    setIsEditingName(true);
                  }}
                >
                  {state.form.name}
                </h1>
              )}

              {state.hasUnsavedChanges && (
                <span className="text-xs text-text-muted">(unsaved)</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-glass-border mx-2" />

            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Settings className="w-4 h-4" />}
              onClick={toggleSettingsPanel}
            >
              Settings
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Play className="w-4 h-4" />}
              onClick={toggleTestPanel}
            >
              Test Form
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Save className="w-4 h-4" />}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </motion.div>

        {/* Main Content - Full Width Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 min-h-0"
        >
          <GlassCard padding="none" className="h-full overflow-hidden">
            <BuilderCanvas />
          </GlassCard>
        </motion.div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeFieldInfo ? (
            <div className="px-3 py-2 bg-bg-secondary border border-mint rounded-lg shadow-lg flex items-center gap-2 opacity-90">
              <span className="text-sm font-medium text-text-primary">
                {activeFieldInfo.label}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </div>

      {/* Side Panels */}
      <FieldConfigPanel />
      <FormTestPanel />
      <FormSettingsPanel />

      {/* Field Palette Modal */}
      <FieldPaletteModal
        isOpen={state.isFieldPaletteModalOpen}
        onClose={closeFieldPaletteModal}
        onSelectField={(fieldType) => {
          addField(
            fieldType,
            state.selectedPageIndex,
            state.fieldInsertPosition?.afterFieldId ?? undefined
          );
          closeFieldPaletteModal();
        }}
      />
    </DndContext>
  );
}
