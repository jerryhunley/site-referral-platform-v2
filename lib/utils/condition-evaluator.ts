// ========================================
// Condition Evaluator for Form Builder
// ========================================

import type {
  FieldCondition,
  ConditionalGroup,
  ConditionOperator,
  FieldConfig,
} from '@/lib/types/form-builder';

const MAX_NESTING_DEPTH = 4;

/**
 * Get display label for an operator
 */
export function getOperatorLabel(operator: ConditionOperator): string {
  const labels: Record<ConditionOperator, string> = {
    equals: 'equals',
    not_equals: 'does not equal',
    contains: 'contains',
    not_contains: 'does not contain',
    is_empty: 'is empty',
    is_not_empty: 'is not empty',
    greater_than: 'is greater than',
    less_than: 'is less than',
    greater_than_or_equals: 'is greater than or equals',
    less_than_or_equals: 'is less than or equals',
    starts_with: 'starts with',
    ends_with: 'ends with',
    is_checked: 'is checked',
    is_not_checked: 'is not checked',
    includes_any: 'includes any of',
    includes_all: 'includes all of',
  };
  return labels[operator];
}

/**
 * Get operators available for a field type
 */
export function getOperatorsForFieldType(fieldType: string): ConditionOperator[] {
  // Text-based fields
  if (['short_text', 'long_text', 'email', 'first_name', 'last_name', 'phone_number', 'zip_code'].includes(fieldType)) {
    return [
      'equals',
      'not_equals',
      'contains',
      'not_contains',
      'is_empty',
      'is_not_empty',
      'starts_with',
      'ends_with',
    ];
  }

  // Number fields
  if (['number_entry', 'bmi_calculator'].includes(fieldType)) {
    return [
      'equals',
      'not_equals',
      'greater_than',
      'less_than',
      'greater_than_or_equals',
      'less_than_or_equals',
      'is_empty',
      'is_not_empty',
    ];
  }

  // Single choice fields
  if (['single_choice', 'best_time_to_call', 'site_selector'].includes(fieldType)) {
    return [
      'equals',
      'not_equals',
      'is_empty',
      'is_not_empty',
    ];
  }

  // Multiple choice fields
  if (['multiple_choice'].includes(fieldType)) {
    return [
      'includes_any',
      'includes_all',
      'is_empty',
      'is_not_empty',
    ];
  }

  // Boolean/checkbox fields
  if (['accept_terms'].includes(fieldType)) {
    return [
      'is_checked',
      'is_not_checked',
    ];
  }

  // Date fields
  if (['date_of_birth'].includes(fieldType)) {
    return [
      'equals',
      'not_equals',
      'is_empty',
      'is_not_empty',
    ];
  }

  // Default operators
  return [
    'equals',
    'not_equals',
    'is_empty',
    'is_not_empty',
  ];
}

/**
 * Check if an operator requires a value input
 */
export function operatorRequiresValue(operator: ConditionOperator): boolean {
  const noValueOperators: ConditionOperator[] = [
    'is_empty',
    'is_not_empty',
    'is_checked',
    'is_not_checked',
  ];
  return !noValueOperators.includes(operator);
}

/**
 * Evaluate a single condition against form values
 */
export function evaluateCondition(
  condition: FieldCondition,
  formValues: Record<string, unknown>
): boolean {
  const sourceValue = formValues[condition.sourceFieldId];

  switch (condition.operator) {
    case 'equals':
      return sourceValue === condition.value;

    case 'not_equals':
      return sourceValue !== condition.value;

    case 'contains':
      if (typeof sourceValue === 'string' && typeof condition.value === 'string') {
        return sourceValue.toLowerCase().includes(condition.value.toLowerCase());
      }
      return false;

    case 'not_contains':
      if (typeof sourceValue === 'string' && typeof condition.value === 'string') {
        return !sourceValue.toLowerCase().includes(condition.value.toLowerCase());
      }
      return true;

    case 'is_empty':
      return sourceValue === undefined ||
        sourceValue === null ||
        sourceValue === '' ||
        (Array.isArray(sourceValue) && sourceValue.length === 0);

    case 'is_not_empty':
      return sourceValue !== undefined &&
        sourceValue !== null &&
        sourceValue !== '' &&
        !(Array.isArray(sourceValue) && sourceValue.length === 0);

    case 'greater_than':
      if (typeof sourceValue === 'number' && typeof condition.value === 'number') {
        return sourceValue > condition.value;
      }
      return false;

    case 'less_than':
      if (typeof sourceValue === 'number' && typeof condition.value === 'number') {
        return sourceValue < condition.value;
      }
      return false;

    case 'greater_than_or_equals':
      if (typeof sourceValue === 'number' && typeof condition.value === 'number') {
        return sourceValue >= condition.value;
      }
      return false;

    case 'less_than_or_equals':
      if (typeof sourceValue === 'number' && typeof condition.value === 'number') {
        return sourceValue <= condition.value;
      }
      return false;

    case 'starts_with':
      if (typeof sourceValue === 'string' && typeof condition.value === 'string') {
        return sourceValue.toLowerCase().startsWith(condition.value.toLowerCase());
      }
      return false;

    case 'ends_with':
      if (typeof sourceValue === 'string' && typeof condition.value === 'string') {
        return sourceValue.toLowerCase().endsWith(condition.value.toLowerCase());
      }
      return false;

    case 'is_checked':
      return sourceValue === true;

    case 'is_not_checked':
      return sourceValue !== true;

    case 'includes_any':
      if (Array.isArray(sourceValue) && Array.isArray(condition.value)) {
        return condition.value.some((v) => sourceValue.includes(v));
      }
      return false;

    case 'includes_all':
      if (Array.isArray(sourceValue) && Array.isArray(condition.value)) {
        return condition.value.every((v) => sourceValue.includes(v));
      }
      return false;

    default:
      return true;
  }
}

/**
 * Evaluate a group of conditions with nested groups
 * Limited to MAX_NESTING_DEPTH levels
 */
export function evaluateConditionGroup(
  group: ConditionalGroup,
  formValues: Record<string, unknown>,
  depth: number = 0
): boolean {
  // Enforce max nesting depth
  if (depth > MAX_NESTING_DEPTH) {
    console.warn(`Condition nesting exceeded max depth of ${MAX_NESTING_DEPTH}`);
    return true;
  }

  // If no conditions and no nested groups, return true (show field)
  if (group.conditions.length === 0 && group.nestedGroups.length === 0) {
    return true;
  }

  // Evaluate all conditions in this group
  const conditionResults = group.conditions.map((condition) =>
    evaluateCondition(condition, formValues)
  );

  // Recursively evaluate nested groups
  const nestedResults = group.nestedGroups.map((nestedGroup) =>
    evaluateConditionGroup(nestedGroup, formValues, depth + 1)
  );

  // Combine all results
  const allResults = [...conditionResults, ...nestedResults];

  if (allResults.length === 0) {
    return true;
  }

  // Apply group logic (AND/OR)
  if (group.logic === 'and') {
    return allResults.every(Boolean);
  } else {
    return allResults.some(Boolean);
  }
}

/**
 * Determine if a field should be visible based on its conditional visibility
 */
export function shouldShowField(
  field: FieldConfig,
  formValues: Record<string, unknown>
): boolean {
  // If no conditional visibility is set, always show the field
  if (!field.conditionalVisibility) {
    return true;
  }

  return evaluateConditionGroup(field.conditionalVisibility, formValues);
}

/**
 * Create an empty condition group
 */
export function createConditionGroup(logic: 'and' | 'or' = 'and'): ConditionalGroup {
  return {
    id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    logic,
    conditions: [],
    nestedGroups: [],
  };
}

/**
 * Create an empty condition
 */
export function createCondition(sourceFieldId: string = ''): FieldCondition {
  return {
    id: `cond-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sourceFieldId,
    operator: 'equals',
    value: '',
  };
}

/**
 * Get the depth of a condition group tree
 */
export function getConditionGroupDepth(group: ConditionalGroup): number {
  if (group.nestedGroups.length === 0) {
    return 1;
  }

  return 1 + Math.max(...group.nestedGroups.map(getConditionGroupDepth));
}

/**
 * Check if more nesting is allowed
 */
export function canAddNestedGroup(group: ConditionalGroup): boolean {
  return getConditionGroupDepth(group) < MAX_NESTING_DEPTH;
}
