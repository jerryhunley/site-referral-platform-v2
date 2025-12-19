'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Layers,
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

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/10">
      {/* Field selector */}
      <select
        value={condition.sourceFieldId}
        onChange={(e) => {
          const newField = availableFields.find((f) => f.id === e.target.value);
          const newOperators = newField
            ? getOperatorsForFieldType(newField.type)
            : operators;
          onChange({
            ...condition,
            sourceFieldId: e.target.value,
            operator: newOperators[0],
            value: '',
          });
        }}
        className="flex-1 min-w-[120px] px-2 py-1.5 text-sm rounded-lg bg-white/40 dark:bg-white/10 border border-white/50 dark:border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50"
      >
        <option value="">Select field...</option>
        {availableFields.map((field) => (
          <option key={field.id} value={field.id}>
            {field.label || field.name}
          </option>
        ))}
      </select>

      {/* Operator selector */}
      <select
        value={condition.operator}
        onChange={(e) =>
          onChange({
            ...condition,
            operator: e.target.value as ConditionOperator,
            value: operatorRequiresValue(e.target.value as ConditionOperator)
              ? condition.value
              : undefined,
          })
        }
        className="flex-1 min-w-[100px] px-2 py-1.5 text-sm rounded-lg bg-white/40 dark:bg-white/10 border border-white/50 dark:border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50"
        disabled={!condition.sourceFieldId}
      >
        {operators.map((op) => (
          <option key={op} value={op}>
            {getOperatorLabel(op)}
          </option>
        ))}
      </select>

      {/* Value input */}
      {needsValue && (
        <>
          {isChoiceField && !isMultipleChoice ? (
            <select
              value={condition.value as string || ''}
              onChange={(e) =>
                onChange({ ...condition, value: e.target.value })
              }
              className="flex-1 min-w-[100px] px-2 py-1.5 text-sm rounded-lg bg-white/40 dark:bg-white/10 border border-white/50 dark:border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50"
              disabled={!condition.sourceFieldId}
            >
              <option value="">Select value...</option>
              {fieldOptions.map((opt) => (
                <option key={opt.id} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : isMultipleChoice ? (
            <div className="flex-1 min-w-[100px] flex flex-wrap gap-1 p-1 rounded-lg bg-white/40 dark:bg-white/10 border border-white/50 dark:border-white/10">
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
                      'px-2 py-0.5 text-xs rounded-md transition-colors',
                      isSelected
                        ? 'bg-mint text-white'
                        : 'bg-white/40 dark:bg-white/10 text-text-secondary hover:text-text-primary'
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
              className="flex-1 min-w-[80px] px-2 py-1.5 text-sm rounded-lg bg-white/40 dark:bg-white/10 border border-white/50 dark:border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50"
              disabled={!condition.sourceFieldId}
            />
          )}
        </>
      )}

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors"
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
        'rounded-xl border transition-colors',
        depth === 0
          ? 'border-white/40 dark:border-white/10 bg-white/20 dark:bg-white/5'
          : 'border-mint/30 bg-mint/5',
        depth > 0 && 'ml-4'
      )}
    >
      {/* Group Header */}
      <div className="flex items-center gap-2 p-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/30 dark:hover:bg-white/10 transition-colors"
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

        <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          {depth === 0 ? 'Show when' : 'Group'}
        </span>

        {/* Logic toggle */}
        {hasContent && (
          <button
            onClick={handleToggleLogic}
            className={cn(
              'px-2 py-0.5 text-xs font-medium rounded-md transition-colors',
              group.logic === 'and'
                ? 'bg-mint/20 text-mint'
                : 'bg-vista-blue/20 text-vista-blue'
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
            className="p-1 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors"
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
            <div className="p-2 pt-0 space-y-2">
              {/* Conditions */}
              {group.conditions.map((condition, index) => (
                <div key={condition.id} className="relative">
                  {index > 0 && (
                    <div className="absolute -top-1.5 left-4 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-muted bg-white/60 dark:bg-bg-secondary rounded">
                      {group.logic}
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
                <div key={nestedGroup.id} className="relative">
                  {(group.conditions.length > 0 || index > 0) && (
                    <div className="absolute -top-1.5 left-4 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-text-muted bg-white/60 dark:bg-bg-secondary rounded">
                      {group.logic}
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

              {/* Add buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleAddCondition}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-mint hover:text-mint-dark transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Condition
                </button>

                {canNest && (
                  <button
                    onClick={handleAddNestedGroup}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-vista-blue hover:text-vista-blue/80 transition-colors"
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
