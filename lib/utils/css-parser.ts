import type React from 'react';
import type { AdvancedFieldStyles, FieldType } from '@/lib/types/form-builder';

/**
 * Convert React.CSSProperties object to inline CSS string format
 */
export function cssObjectToString(styles: React.CSSProperties): string {
  return Object.entries(styles)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${value}`;
    })
    .join('; ');
}

/**
 * Parse inline CSS string to React.CSSProperties object
 */
export function cssStringToObject(css: string): React.CSSProperties {
  const styles: Record<string, string> = {};

  if (!css || !css.trim()) return styles;

  css.split(';').forEach((declaration) => {
    const colonIndex = declaration.indexOf(':');
    if (colonIndex === -1) return;

    const key = declaration.slice(0, colonIndex).trim();
    const value = declaration.slice(colonIndex + 1).trim();

    if (key && value) {
      // Convert kebab-case to camelCase
      const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styles[camelKey] = value;
    }
  });

  return styles;
}

/**
 * Get the relevant style keys for a given field type
 */
export function getStyleKeysForFieldType(fieldType: FieldType): (keyof AdvancedFieldStyles)[] {
  const textInputFields = [
    'short_text',
    'long_text',
    'email',
    'phone_number',
    'number_entry',
    'zip_code',
    'first_name',
    'last_name',
  ];
  const choiceFields = ['single_choice', 'multiple_choice', 'best_time_to_call'];
  const buttonFields = ['submit_button', 'next_button'];
  const checkboxFields = ['accept_terms', 'multiple_choice'];

  if (fieldType === 'divider') {
    return ['divider', 'dividerContainer', 'dividerLabel'];
  }

  if (buttonFields.includes(fieldType)) {
    return ['button', 'container'];
  }

  if (fieldType === 'single_choice') {
    return ['label', 'radioGroup', 'button', 'container'];
  }

  if (checkboxFields.includes(fieldType)) {
    return ['label', 'checkbox', 'container'];
  }

  if (choiceFields.includes(fieldType)) {
    return ['label', 'radioGroup', 'container'];
  }

  if (textInputFields.includes(fieldType)) {
    return ['label', 'input', 'inputAddon', 'container'];
  }

  // Layout elements like free_form_text, page_break
  if (fieldType === 'free_form_text') {
    return ['container'];
  }

  // Default fallback
  return ['label', 'container'];
}

/**
 * Get the display name for a style key
 */
export function getStyleKeyDisplayName(key: keyof AdvancedFieldStyles): string {
  const displayNames: Record<keyof AdvancedFieldStyles, string> = {
    label: 'Label Styles',
    input: 'Input Styles',
    checkbox: 'Checkbox Styles',
    radioGroup: 'Radio Group Styles',
    button: 'Button Styles',
    inputAddon: 'Input Addon Styles',
    container: 'Container Styles',
    divider: 'Divider Styles',
    dividerContainer: 'Divider Container Styles',
    dividerLabel: 'Divider Label Styles',
  };

  return displayNames[key] || key;
}

/**
 * Merge field-level styles with global defaults
 * Field-level styles take precedence over global defaults
 */
export function mergeStyles(
  globalStyles: AdvancedFieldStyles | undefined,
  fieldStyles: AdvancedFieldStyles | undefined
): AdvancedFieldStyles {
  if (!globalStyles && !fieldStyles) return {};
  if (!globalStyles) return fieldStyles || {};
  if (!fieldStyles) return globalStyles;

  const merged: AdvancedFieldStyles = { ...globalStyles };

  (Object.keys(fieldStyles) as (keyof AdvancedFieldStyles)[]).forEach((key) => {
    const fieldValue = fieldStyles[key];
    if (fieldValue) {
      merged[key] = {
        ...(globalStyles[key] || {}),
        ...fieldValue,
      };
    }
  });

  return merged;
}
