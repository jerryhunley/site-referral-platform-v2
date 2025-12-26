'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, GripVertical, Eye, ChevronDown, Paintbrush } from 'lucide-react';
import { useFormBuilder } from '@/lib/context/FormBuilderContext';
import { FIELD_REGISTRY, type FieldOption, type FieldWidth, type ConditionalGroup, type SingleChoiceDisplayStyle, type AdvancedFieldStyles } from '@/lib/types/form-builder';
import { cn } from '@/lib/utils';
import { ConditionBuilder } from './ConditionBuilder';
import { createConditionGroup } from '@/lib/utils/condition-evaluator';
import { cssObjectToString, cssStringToObject, getStyleKeysForFieldType, getStyleKeyDisplayName } from '@/lib/utils/css-parser';

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="pt-4">
      <div className="mb-4 dotted-divider" />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 text-left group"
      >
        {icon}
        <h3 className="text-sm font-semibold text-text-primary flex-1">{title}</h3>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
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
            <div className="pt-3 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Style Input Component
interface StyleInputProps {
  label: string;
  value?: React.CSSProperties;
  onChange: (styles: React.CSSProperties) => void;
}

function StyleInput({ label, value, onChange }: StyleInputProps) {
  const [cssText, setCssText] = useState(() => value ? cssObjectToString(value) : '');

  useEffect(() => {
    setCssText(value ? cssObjectToString(value) : '');
  }, [value]);

  const handleBlur = () => {
    try {
      const parsed = cssStringToObject(cssText);
      onChange(parsed);
    } catch {
      // Invalid CSS, keep previous value
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-text-secondary mb-1">
        {label}
      </label>
      <textarea
        value={cssText}
        onChange={(e) => setCssText(e.target.value)}
        onBlur={handleBlur}
        rows={2}
        className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-colors resize-none"
        placeholder="color: #333; padding: 8px;"
      />
    </div>
  );
}

export function FieldConfigPanel() {
  const { state, updateField, selectField } = useFormBuilder();
  const { selectedFieldId, isConfigPanelOpen } = state;

  const field = selectedFieldId ? state.form.fields[selectedFieldId] : null;
  const metadata = field ? FIELD_REGISTRY[field.type] : null;

  const [localOptions, setLocalOptions] = useState<FieldOption[]>([]);

  // Sync options when field changes
  useEffect(() => {
    if (field?.options) {
      setLocalOptions(field.options);
    } else {
      setLocalOptions([]);
    }
  }, [field?.id, field?.options]);

  const handleClose = () => {
    selectField(null);
  };

  const handleLabelChange = (label: string) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { label });
    }
  };

  const handlePlaceholderChange = (placeholder: string) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { placeholder });
    }
  };

  const handleHelperTextChange = (helperText: string) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { helperText });
    }
  };

  const handleRequiredChange = (required: boolean) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { required });
    }
  };

  const handleWidthChange = (width: FieldWidth) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { width });
    }
  };

  const handleContentChange = (content: string) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { content });
    }
  };

  const handleAddOption = () => {
    const newOption: FieldOption = {
      id: `opt-${Date.now()}`,
      label: `Option ${localOptions.length + 1}`,
      value: `option${localOptions.length + 1}`,
    };
    const newOptions = [...localOptions, newOption];
    setLocalOptions(newOptions);
    if (selectedFieldId) {
      updateField(selectedFieldId, { options: newOptions });
    }
  };

  const handleUpdateOption = (optionId: string, updates: Partial<FieldOption>) => {
    const newOptions = localOptions.map((opt) =>
      opt.id === optionId ? { ...opt, ...updates } : opt
    );
    setLocalOptions(newOptions);
    if (selectedFieldId) {
      updateField(selectedFieldId, { options: newOptions });
    }
  };

  const handleRemoveOption = (optionId: string) => {
    const newOptions = localOptions.filter((opt) => opt.id !== optionId);
    setLocalOptions(newOptions);
    if (selectedFieldId) {
      updateField(selectedFieldId, { options: newOptions });
    }
  };

  const isLayoutElement = field && ['divider', 'submit_button', 'next_button', 'page_break'].includes(field.type);
  const isFreeFormText = field?.type === 'free_form_text';
  const hasOptions = field && ['single_choice', 'multiple_choice', 'best_time_to_call'].includes(field.type);

  // Get available fields for conditional visibility (exclude current field)
  const currentPage = state.form.pages[state.selectedPageIndex];
  const availableFieldsForConditions = currentPage?.fieldIds
    .map((id) => state.form.fields[id])
    .filter((f) => f && f.id !== selectedFieldId && !['divider', 'page_break', 'submit_button', 'next_button', 'free_form_text'].includes(f.type)) || [];

  const handleConditionChange = (group: ConditionalGroup) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { conditionalVisibility: group });
    }
  };

  const handleAddCondition = () => {
    if (selectedFieldId) {
      updateField(selectedFieldId, {
        conditionalVisibility: createConditionGroup(),
      });
    }
  };

  const handleRemoveConditions = () => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { conditionalVisibility: undefined });
    }
  };

  const handleDisplayStyleChange = (displayStyle: SingleChoiceDisplayStyle) => {
    if (selectedFieldId) {
      updateField(selectedFieldId, { displayStyle });
    }
  };

  const handleAdvancedStyleChange = (styleKey: keyof AdvancedFieldStyles, styles: React.CSSProperties) => {
    if (selectedFieldId) {
      const currentStyles = field?.advancedStyles || {};
      updateField(selectedFieldId, {
        advancedStyles: {
          ...currentStyles,
          [styleKey]: styles,
        },
      });
    }
  };

  // Get relevant style keys for this field type
  const styleKeys = field ? getStyleKeysForFieldType(field.type) : [];

  return (
    <AnimatePresence>
      {isConfigPanelOpen && field && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-9998"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-6 top-6 bottom-6 w-1/3 min-w-[400px] max-w-[600px] glass-modal-panel z-9999 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Configure Field
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{metadata?.label}</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full text-text-secondary hover:text-text-primary glass-button hover:scale-105 active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Header divider */}
            <div className="mx-6 dotted-divider" />

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Label */}
              {!isLayoutElement && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Label
                  </label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => handleLabelChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-colors"
                  />
                </div>
              )}

              {/* Button Label (for buttons) */}
              {(field.type === 'submit_button' || field.type === 'next_button') && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => handleLabelChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-colors"
                  />
                </div>
              )}

              {/* Free Form Text Content */}
              {isFreeFormText && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Content
                  </label>
                  <textarea
                    value={field.content || ''}
                    onChange={(e) => handleContentChange(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-colors resize-none"
                    placeholder="Enter your text..."
                  />
                </div>
              )}

              {/* Placeholder */}
              {!isLayoutElement && !isFreeFormText && field.type !== 'accept_terms' && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Placeholder
                  </label>
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => handlePlaceholderChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-colors"
                    placeholder="Enter placeholder text..."
                  />
                </div>
              )}

              {/* Helper Text */}
              {!isLayoutElement && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Helper Text
                  </label>
                  <input
                    type="text"
                    value={field.helperText || ''}
                    onChange={(e) => handleHelperTextChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-colors"
                    placeholder="Add helper text..."
                  />
                </div>
              )}

              {/* Required Toggle */}
              {!isLayoutElement && !isFreeFormText && (
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-primary">
                    Required Field
                  </label>
                  <button
                    onClick={() => handleRequiredChange(!field.required)}
                    className={cn(
                      'relative w-11 h-6 rounded-full transition-colors',
                      field.required ? 'bg-mint' : 'bg-white/40 dark:bg-white/10'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
                        field.required ? 'left-6' : 'left-1'
                      )}
                    />
                  </button>
                </div>
              )}

              {/* Width Selection */}
              {!isLayoutElement && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Field Width
                  </label>
                  <div className="flex gap-2">
                    {(['full', 'half', 'third'] as FieldWidth[]).map((width) => (
                      <button
                        key={width}
                        onClick={() => handleWidthChange(width)}
                        className={cn(
                          'flex-1 py-2 rounded-full text-sm font-medium transition-colors',
                          field.width === width
                            ? 'bg-mint text-white'
                            : 'bg-white/40 dark:bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/15'
                        )}
                      >
                        {width === 'full' ? 'Full' : width === 'half' ? '1/2' : '1/3'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Options (for choice fields) */}
              {hasOptions && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-text-primary">
                      Options
                    </label>
                    <button
                      onClick={handleAddOption}
                      className="flex items-center gap-1 text-sm text-mint hover:text-mint-dark transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Option
                    </button>
                  </div>
                  <div className="space-y-2">
                    {localOptions.map((option, index) => (
                      <div
                        key={option.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/10"
                      >
                        <GripVertical className="w-4 h-4 text-text-muted cursor-grab" />
                        <input
                          type="text"
                          value={option.label}
                          onChange={(e) =>
                            handleUpdateOption(option.id, { label: e.target.value })
                          }
                          className="flex-1 px-2 py-1 text-sm bg-transparent border-none focus:outline-none text-text-primary"
                          placeholder="Option label"
                        />
                        <button
                          onClick={() => handleRemoveOption(option.id)}
                          className="p-1 text-text-muted hover:text-error transition-colors"
                          disabled={localOptions.length <= 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display Style (for single choice only) */}
              {field.type === 'single_choice' && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Display Style
                  </label>
                  <div className="flex gap-2">
                    {(['radio', 'dropdown', 'button'] as SingleChoiceDisplayStyle[]).map((style) => (
                      <button
                        key={style}
                        onClick={() => handleDisplayStyleChange(style)}
                        className={cn(
                          'flex-1 py-2 rounded-full text-sm font-medium transition-colors capitalize',
                          (field.displayStyle || 'radio') === style
                            ? 'bg-mint text-white'
                            : 'bg-white/40 dark:bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/15'
                        )}
                      >
                        {style === 'radio' ? 'Radio' : style === 'dropdown' ? 'Dropdown' : 'Buttons'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Styles */}
              {styleKeys.length > 0 && (
                <CollapsibleSection
                  title="Advanced Styles"
                  icon={<Paintbrush className="w-4 h-4 text-vista-blue" />}
                  defaultOpen={false}
                >
                  <p className="text-xs text-text-muted mb-3">
                    Enter CSS properties to customize this field&apos;s appearance.
                  </p>
                  {styleKeys.map((key) => (
                    <StyleInput
                      key={key}
                      label={getStyleKeyDisplayName(key)}
                      value={field.advancedStyles?.[key]}
                      onChange={(styles) => handleAdvancedStyleChange(key, styles)}
                    />
                  ))}
                </CollapsibleSection>
              )}

              {/* Conditional Visibility */}
              {!isLayoutElement && (
                <div className="pt-4">
                  <div className="mb-4 dotted-divider" />
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-mint" />
                    <h3 className="text-sm font-semibold text-text-primary">
                      Conditional Visibility
                    </h3>
                  </div>

                  {availableFieldsForConditions.length === 0 ? (
                    <p className="text-xs text-text-muted">
                      Add other fields to the form first to set up conditional visibility.
                    </p>
                  ) : field.conditionalVisibility ? (
                    <div className="space-y-3">
                      <ConditionBuilder
                        group={field.conditionalVisibility}
                        availableFields={availableFieldsForConditions}
                        onChange={handleConditionChange}
                        maxDepth={4}
                      />
                      <button
                        onClick={handleRemoveConditions}
                        className="flex items-center gap-1 text-xs text-error hover:text-error/80 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove all conditions
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-text-muted mb-2">
                        Show this field only when certain conditions are met.
                      </p>
                      <button
                        onClick={handleAddCondition}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-mint bg-mint/10 hover:bg-mint/20 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Conditions
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
