'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Layers,
  Check,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  ConditionalGroup,
  FieldCondition,
  ConditionOperator,
  FieldConfig,
} from '@/lib/types/form-builder';
import {
  createConditionGroup,
  createCondition,
  getOperatorsForFieldType,
  getOperatorLabel,
  operatorRequiresValue,
  canAddNestedGroup,
} from '@/lib/utils/condition-evaluator';

// ===========================================
// Custom Dropdown Components
// ===========================================

interface FieldDropdownProps {
  value: string;
  options: FieldConfig[];
  onChange: (fieldId: string) => void;
  placeholder?: string;
}

function FieldDropdown({ value, options, onChange, placeholder = 'Select field...' }: FieldDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedField = options.find((f) => f.id === value);

  const filteredOptions = options.filter((f) =>
    (f.label || f.name).toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative flex-1 min-w-[140px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full w-full text-left',
          'bg-white/80 dark:bg-slate-800/60',
          'border border-white/90 dark:border-slate-700/50',
          'hover:bg-white hover:border-white hover:shadow-[0_2px_8px_rgba(255,255,255,0.5)] dark:hover:bg-slate-700/60 dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all',
          isOpen && 'ring-2 ring-mint/40'
        )}
      >
        <span className={cn(
          'text-xs font-medium flex-1 truncate',
          selectedField ? 'text-text-primary' : 'text-text-muted'
        )}>
          {selectedField ? (selectedField.label || selectedField.name) : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-text-muted transition-transform shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 max-h-60 overflow-hidden flex flex-col rounded-xl glass-dropdown"
          >
            {/* Search input */}
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/80 dark:bg-slate-800/60 border border-white/90 dark:border-slate-700/50 rounded-full text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-mint/40"
                />
              </div>
            </div>

            {/* Options list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {filteredOptions.map((field) => (
                <button
                  key={field.id}
                  onClick={() => {
                    onChange(field.id);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-1.5 rounded-full text-left',
                    'hover:bg-mint/10 dark:hover:bg-mint/15 transition-all',
                    value === field.id && 'bg-mint/15 dark:bg-mint/20'
                  )}
                >
                  <span className="text-xs font-medium text-text-primary flex-1">
                    {field.label || field.name}
                  </span>
                  {value === field.id && (
                    <Check className="w-3.5 h-3.5 text-mint shrink-0" />
                  )}
                </button>
              ))}

              {filteredOptions.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-3">
                  No fields found
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface OperatorDropdownProps {
  value: ConditionOperator;
  operators: ConditionOperator[];
  onChange: (operator: ConditionOperator) => void;
  disabled?: boolean;
}

function OperatorDropdown({ value, operators, onChange, disabled }: OperatorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-left',
          'bg-white/80 dark:bg-slate-800/60',
          'border border-white/90 dark:border-slate-700/50',
          'hover:bg-white hover:border-white hover:shadow-[0_2px_8px_rgba(255,255,255,0.5)] dark:hover:bg-slate-700/60 dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all',
          isOpen && 'ring-2 ring-mint/40',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className="text-xs font-medium text-text-primary whitespace-nowrap">
          {getOperatorLabel(value)}
        </span>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-text-muted transition-transform shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 z-50 min-w-[140px] overflow-hidden flex flex-col rounded-xl glass-dropdown"
          >
            <div className="p-2 space-y-0.5">
              {operators.map((op) => (
                <button
                  key={op}
                  onClick={() => {
                    onChange(op);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-1.5 rounded-full text-left',
                    'hover:bg-mint/10 dark:hover:bg-mint/15 transition-all',
                    value === op && 'bg-mint/15 dark:bg-mint/20'
                  )}
                >
                  <span className="text-xs font-medium text-text-primary flex-1 whitespace-nowrap">
                    {getOperatorLabel(op)}
                  </span>
                  {value === op && (
                    <Check className="w-3.5 h-3.5 text-mint shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ValueDropdownProps {
  value: string;
  options: { id: string; value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

function ValueDropdown({ value, options, onChange, disabled, placeholder = 'Select value...' }: ValueDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1 min-w-[120px]">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full w-full text-left',
          'bg-white/80 dark:bg-slate-800/60',
          'border border-white/90 dark:border-slate-700/50',
          'hover:bg-white hover:border-white hover:shadow-[0_2px_8px_rgba(255,255,255,0.5)] dark:hover:bg-slate-700/60 dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-all',
          isOpen && 'ring-2 ring-mint/40',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className={cn(
          'text-xs font-medium flex-1 truncate',
          selectedOption ? 'text-text-primary' : 'text-text-muted'
        )}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-text-muted transition-transform shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 max-h-48 overflow-hidden flex flex-col rounded-xl glass-dropdown"
          >
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-1.5 rounded-full text-left',
                    'hover:bg-mint/10 dark:hover:bg-mint/15 transition-all',
                    value === opt.value && 'bg-mint/15 dark:bg-mint/20'
                  )}
                >
                  <span className="text-xs font-medium text-text-primary flex-1">
                    {opt.label}
                  </span>
                  {value === opt.value && (
                    <Check className="w-3.5 h-3.5 text-mint shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===========================================
// Condition Builder Components
// ===========================================

interface ConditionBuilderProps {
  group: ConditionalGroup;
  availableFields: FieldConfig[];
  onChange: (group: ConditionalGroup) => void;
  depth?: number;
  maxDepth?: number;
  onRemove?: () => void;
}

interface ConditionRowProps {
  condition: FieldCondition;
  availableFields: FieldConfig[];
  onChange: (condition: FieldCondition) => void;
  onRemove: () => void;
}

function ConditionRow({
  condition,
  availableFields,
  onChange,
  onRemove,
}: ConditionRowProps) {
  const selectedField = availableFields.find((f) => f.id === condition.sourceFieldId);
  const operators = selectedField
    ? getOperatorsForFieldType(selectedField.type)
    : ['equals', 'not_equals'] as ConditionOperator[];
  const needsValue = operatorRequiresValue(condition.operator);

  // Get options for choice fields
  const fieldOptions = selectedField?.options || [];
  const isChoiceField = fieldOptions.length > 0;
  const isMultipleChoice = selectedField?.type === 'multiple_choice';

  const handleFieldChange = (fieldId: string) => {
    const newField = availableFields.find((f) => f.id === fieldId);
    const newOperators = newField
      ? getOperatorsForFieldType(newField.type)
      : operators;
    onChange({
      ...condition,
      sourceFieldId: fieldId,
      operator: newOperators[0],
      value: '',
    });
  };

  const handleOperatorChange = (operator: ConditionOperator) => {
    onChange({
      ...condition,
      operator,
      value: operatorRequiresValue(operator) ? condition.value : undefined,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Field selector */}
      <FieldDropdown
        value={condition.sourceFieldId}
        options={availableFields}
        onChange={handleFieldChange}
      />

      {/* Operator selector */}
      <OperatorDropdown
        value={condition.operator}
        operators={operators}
        onChange={handleOperatorChange}
        disabled={!condition.sourceFieldId}
      />

      {/* Value input */}
      {needsValue && (
        <>
          {isChoiceField && !isMultipleChoice ? (
            <ValueDropdown
              value={condition.value as string || ''}
              options={fieldOptions}
              onChange={(v) => onChange({ ...condition, value: v })}
              disabled={!condition.sourceFieldId}
            />
          ) : isMultipleChoice ? (
            <div className="flex-1 min-w-[100px] flex flex-wrap gap-1 p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-white/90 dark:border-slate-700/50">
              {fieldOptions.map((opt) => {
                const values = Array.isArray(condition.value)
                  ? condition.value
                  : [];
                const isSelected = values.includes(opt.value);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      const newValues = isSelected
                        ? values.filter((v) => v !== opt.value)
                        : [...values, opt.value];
                      onChange({ ...condition, value: newValues });
                    }}
                    className={cn(
                      'px-2.5 py-0.5 text-xs font-medium rounded-full transition-all',
                      isSelected
                        ? 'bg-mint text-white'
                        : 'bg-white/60 dark:bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/80'
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              type="text"
              value={condition.value as string || ''}
              onChange={(e) =>
                onChange({ ...condition, value: e.target.value })
              }
              placeholder="Value"
              className="flex-1 min-w-[80px] px-3 py-1.5 text-xs font-medium rounded-full bg-white/80 dark:bg-slate-800/60 border border-white/90 dark:border-slate-700/50 text-text-primary placeholder:text-text-muted hover:bg-white hover:border-white hover:shadow-[0_2px_8px_rgba(255,255,255,0.5)] dark:hover:bg-slate-700/60 dark:hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-mint/40 transition-all"
              disabled={!condition.sourceFieldId}
            />
          )}
        </>
      )}

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="p-1.5 rounded-full text-text-primary glass-button hover:text-error hover:scale-105 active:scale-95 transition-all"
        title="Remove condition"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ConditionBuilder({
  group,
  availableFields,
  onChange,
  depth = 0,
  maxDepth = 4,
  onRemove,
}: ConditionBuilderProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const canNest = depth < maxDepth - 1 && canAddNestedGroup(group);

  const handleAddCondition = () => {
    onChange({
      ...group,
      conditions: [...group.conditions, createCondition()],
    });
  };

  const handleUpdateCondition = (index: number, condition: FieldCondition) => {
    const newConditions = [...group.conditions];
    newConditions[index] = condition;
    onChange({ ...group, conditions: newConditions });
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = group.conditions.filter((_, i) => i !== index);
    onChange({ ...group, conditions: newConditions });
  };

  const handleAddNestedGroup = () => {
    if (!canNest) return;
    onChange({
      ...group,
      nestedGroups: [...group.nestedGroups, createConditionGroup()],
    });
  };

  const handleUpdateNestedGroup = (index: number, nestedGroup: ConditionalGroup) => {
    const newNestedGroups = [...group.nestedGroups];
    newNestedGroups[index] = nestedGroup;
    onChange({ ...group, nestedGroups: newNestedGroups });
  };

  const handleRemoveNestedGroup = (index: number) => {
    const newNestedGroups = group.nestedGroups.filter((_, i) => i !== index);
    onChange({ ...group, nestedGroups: newNestedGroups });
  };

  const handleToggleLogic = () => {
    onChange({
      ...group,
      logic: group.logic === 'and' ? 'or' : 'and',
    });
  };

  const hasContent = group.conditions.length > 0 || group.nestedGroups.length > 0;

  return (
    <div
      className={cn(
        'rounded-xl transition-colors',
        depth === 0
          ? 'glass-card-inset'
          : 'border border-mint/30 bg-mint/5',
        depth > 0 && 'ml-4'
      )}
    >
      {/* Group Header */}
      <div className="flex items-center gap-2 p-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-full text-text-muted hover:text-text-primary glass-button hover:scale-105 active:scale-95 transition-all"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {depth > 0 && (
          <Layers className="w-4 h-4 text-mint" />
        )}

        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {depth === 0 ? 'Show when' : 'Group'}
        </span>

        {/* Logic toggle */}
        {hasContent && (
          <button
            onClick={handleToggleLogic}
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-md transition-colors',
              group.logic === 'and'
                ? 'bg-mint/15 text-mint dark:bg-mint/20'
                : 'bg-vista-blue/15 text-vista-blue dark:bg-vista-blue/20'
            )}
          >
            {group.logic.toUpperCase()}
          </button>
        )}

        <div className="flex-1" />

        {/* Remove group button (for nested groups) */}
        {depth > 0 && onRemove && (
          <button
            onClick={onRemove}
            className="p-1.5 rounded-full text-text-primary glass-button hover:text-error hover:scale-105 active:scale-95 transition-all"
            title="Remove group"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Group Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 space-y-3">
              {/* Conditions */}
              {group.conditions.map((condition, index) => (
                <div key={condition.id} className="space-y-2">
                  {index > 0 && (
                    <div className="flex items-center gap-2 pl-4">
                      <span className={cn(
                        'px-3 py-1 text-xs font-semibold rounded-md',
                        group.logic === 'and'
                          ? 'bg-mint/15 text-mint dark:bg-mint/20'
                          : 'bg-vista-blue/15 text-vista-blue dark:bg-vista-blue/20'
                      )}>
                        {group.logic.toUpperCase()}
                      </span>
                      <div
                        className="flex-1 h-px"
                        style={{
                          backgroundImage: 'radial-gradient(circle, rgb(156 163 175 / 0.5) 1px, transparent 1px)',
                          backgroundSize: '8px 1px',
                          backgroundRepeat: 'repeat-x',
                        }}
                      />
                    </div>
                  )}
                  <ConditionRow
                    condition={condition}
                    availableFields={availableFields}
                    onChange={(c) => handleUpdateCondition(index, c)}
                    onRemove={() => handleRemoveCondition(index)}
                  />
                </div>
              ))}

              {/* Nested Groups */}
              {group.nestedGroups.map((nestedGroup, index) => (
                <div key={nestedGroup.id} className="space-y-2">
                  {(group.conditions.length > 0 || index > 0) && (
                    <div className="flex items-center gap-2 pl-4">
                      <span className={cn(
                        'px-3 py-1 text-xs font-semibold rounded-md',
                        group.logic === 'and'
                          ? 'bg-mint/15 text-mint dark:bg-mint/20'
                          : 'bg-vista-blue/15 text-vista-blue dark:bg-vista-blue/20'
                      )}>
                        {group.logic.toUpperCase()}
                      </span>
                      <div
                        className="flex-1 h-px"
                        style={{
                          backgroundImage: 'radial-gradient(circle, rgb(156 163 175 / 0.5) 1px, transparent 1px)',
                          backgroundSize: '8px 1px',
                          backgroundRepeat: 'repeat-x',
                        }}
                      />
                    </div>
                  )}
                  <ConditionBuilder
                    group={nestedGroup}
                    availableFields={availableFields}
                    onChange={(g) => handleUpdateNestedGroup(index, g)}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                    onRemove={() => handleRemoveNestedGroup(index)}
                  />
                </div>
              ))}

              {/* Dotted divider */}
              <div
                className="h-px"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgb(156 163 175 / 0.5) 1px, transparent 1px)',
                  backgroundSize: '8px 1px',
                  backgroundRepeat: 'repeat-x',
                }}
              />

              {/* Add buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleAddCondition}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-primary glass-button rounded-full hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Condition
                </button>

                {canNest && (
                  <button
                    onClick={handleAddNestedGroup}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-primary glass-button rounded-full hover:scale-105 active:scale-95 transition-all"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Add Group
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
