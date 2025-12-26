'use client';

import { type FieldConfig, type FormStyling } from '@/lib/types/form-builder';
import { cn } from '@/lib/utils';
import { shouldShowField } from '@/lib/utils/condition-evaluator';

// Import all field components
import { ShortTextField } from './ShortTextField';
import { LongTextField } from './LongTextField';
import { EmailField } from './EmailField';
import { PhoneNumberField } from './PhoneNumberField';
import { FirstNameField } from './FirstNameField';
import { LastNameField } from './LastNameField';
import { ZipCodeField } from './ZipCodeField';
import { DateOfBirthField } from './DateOfBirthField';
import { NumberEntryField } from './NumberEntryField';
import { SingleChoiceField } from './SingleChoiceField';
import { MultipleChoiceField } from './MultipleChoiceField';
import { AcceptTermsField } from './AcceptTermsField';
import { BestTimeToCallField } from './BestTimeToCallField';
import { SiteSelectorField } from './SiteSelectorField';
import { BMICalculatorField } from './BMICalculatorField';
import { DividerElement } from './DividerElement';
import { FreeFormTextElement } from './FreeFormTextElement';
import { SubmitButtonElement } from './SubmitButtonElement';
import { NextButtonElement } from './NextButtonElement';
import { PageBreakElement } from './PageBreakElement';

interface FieldRendererProps {
  field: FieldConfig;
  isPreview?: boolean;
  disabled?: boolean;
  value?: unknown;
  onChange?: (value: unknown) => void;
  error?: string;
  styling?: FormStyling;
  formValues?: Record<string, unknown>; // All form values for conditional visibility
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldComponent = React.ComponentType<any>;

// Field component mapping
const fieldComponents: Record<string, FieldComponent> = {
  short_text: ShortTextField,
  long_text: LongTextField,
  email: EmailField,
  phone_number: PhoneNumberField,
  first_name: FirstNameField,
  last_name: LastNameField,
  zip_code: ZipCodeField,
  date_of_birth: DateOfBirthField,
  number_entry: NumberEntryField,
  single_choice: SingleChoiceField,
  multiple_choice: MultipleChoiceField,
  accept_terms: AcceptTermsField,
  best_time_to_call: BestTimeToCallField,
  site_selector: SiteSelectorField,
  bmi_calculator: BMICalculatorField,
  divider: DividerElement,
  free_form_text: FreeFormTextElement,
  submit_button: SubmitButtonElement,
  next_button: NextButtonElement,
  page_break: PageBreakElement,
};

export function FieldRenderer(props: FieldRendererProps) {
  const { field, styling, formValues = {}, disabled } = props;

  // Skip conditional visibility check in builder mode (when disabled is true)
  // Only evaluate conditions when in test/preview mode with actual form values
  if (!disabled) {
    const isVisible = shouldShowField(field, formValues);
    if (!isVisible) {
      return null;
    }
  }

  const FieldComponent = fieldComponents[field.type];

  if (!FieldComponent) {
    return (
      <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
        Unknown field type: {field.type}
      </div>
    );
  }

  // Width classes based on field configuration (accounting for gap-4 = 1rem)
  const widthClasses = {
    full: 'w-full',
    half: 'w-full sm:w-[calc(50%-0.5rem)]',
    third: 'w-full sm:w-[calc(33.333%-0.667rem)]',
  };

  return (
    <div className={cn(widthClasses[field.width])}>
      <FieldComponent {...props} />
    </div>
  );
}

// Base field wrapper for consistent styling
interface BaseFieldWrapperProps {
  field: FieldConfig;
  children: React.ReactNode;
  error?: string;
  hideLabel?: boolean;
}

export function BaseFieldWrapper({
  field,
  children,
  error,
  hideLabel = false,
}: BaseFieldWrapperProps) {
  const isLayoutElement = ['divider', 'free_form_text', 'submit_button', 'next_button', 'page_break'].includes(field.type);

  if (isLayoutElement) {
    return <>{children}</>;
  }

  return (
    <div className="w-full">
      {!hideLabel && field.label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {field.label}
          {field.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children}
      {field.helperText && !error && (
        <p className="mt-1.5 text-xs text-text-muted">{field.helperText}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-error">{error}</p>
      )}
    </div>
  );
}
