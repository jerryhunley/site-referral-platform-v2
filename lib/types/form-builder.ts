// ========================================
// Form Builder - TypeScript Types
// ========================================

// Field type definitions
export type PredefinedFieldType =
  | 'best_time_to_call'
  | 'email'
  | 'first_name'
  | 'last_name'
  | 'phone_number'
  | 'zip_code';

export type StandardFieldType =
  | 'accept_terms'
  | 'bmi_calculator'
  | 'date_of_birth'
  | 'short_text'
  | 'long_text'
  | 'multiple_choice'
  | 'number_entry'
  | 'single_choice'
  | 'site_selector';

export type LayoutFieldType =
  | 'divider'
  | 'free_form_text'
  | 'next_button'
  | 'page_break'
  | 'submit_button';

export type FieldType = PredefinedFieldType | StandardFieldType | LayoutFieldType;

export type FieldCategory = 'predefined' | 'standard' | 'layout';

// Form modes
export type FormMode = 'wizard' | 'inline';

// Field width options
export type FieldWidth = 'full' | 'half' | 'third';

// Spacing options
export type SpacingSize = 'compact' | 'normal' | 'relaxed';

// Border radius options
export type RadiusSize = 'sm' | 'md' | 'lg' | 'xl';

// Label position options
export type LabelPosition = 'top' | 'inline';

// Progress bar styles
export type ProgressBarStyle = 'steps' | 'bar' | 'dots';

// Validation rule types
export type ValidationRuleType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'min'
  | 'max'
  | 'pattern'
  | 'email'
  | 'phone';

export interface ValidationRule {
  type: ValidationRuleType;
  value?: string | number | boolean;
  message: string;
}

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customMessage?: string;
}

// Field option for choice fields
export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

// Field configuration
export interface FieldConfig {
  id: string;
  type: FieldType;
  label: string;
  name: string; // Form submission field name
  placeholder?: string;
  helperText?: string;
  defaultValue?: string | number | boolean | string[];
  required: boolean;
  validation?: ValidationRules;
  options?: FieldOption[]; // For choice fields
  width: FieldWidth;
  // For free form text
  content?: string;
  // For BMI calculator
  heightUnit?: 'inches' | 'cm';
  weightUnit?: 'lbs' | 'kg';
}

// Form page (for wizard mode)
export interface FormPage {
  id: string;
  title: string;
  description?: string;
  fieldIds: string[];
}

// Form styling
export interface FormStyling {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fieldRadius: RadiusSize;
  labelPosition: LabelPosition;
  fieldSpacing: SpacingSize;
  useGlassEffect: boolean;
  showProgressBar: boolean;
  progressBarStyle: ProgressBarStyle;
}

// Form settings
export interface FormSettings {
  submitAction: 'redirect' | 'message' | 'webhook';
  submitRedirectUrl?: string;
  submitMessage?: string;
  webhookUrl?: string;
  enableRecaptcha: boolean;
  collectAnalytics: boolean;
}

// Complete form definition
export interface FormDefinition {
  id: string;
  name: string;
  description?: string;
  mode: FormMode;
  pages: FormPage[];
  fields: Record<string, FieldConfig>;
  styling: FormStyling;
  settings: FormSettings;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Form builder state
export interface FormBuilderState {
  form: FormDefinition;
  selectedFieldId: string | null;
  selectedPageIndex: number;
  isDragging: boolean;
  isTestPanelOpen: boolean;
  isConfigPanelOpen: boolean;
  isSettingsPanelOpen: boolean;
  hasUnsavedChanges: boolean;
  undoStack: FormDefinition[];
  redoStack: FormDefinition[];
}

// Form builder actions
export type FormBuilderAction =
  | { type: 'SET_FORM'; payload: FormDefinition }
  | { type: 'UPDATE_FORM_NAME'; payload: string }
  | { type: 'UPDATE_FORM_DESCRIPTION'; payload: string }
  | { type: 'SET_FORM_MODE'; payload: FormMode }
  | { type: 'ADD_FIELD'; payload: { fieldType: FieldType; pageIndex: number; afterFieldId?: string } }
  | { type: 'REMOVE_FIELD'; payload: string }
  | { type: 'UPDATE_FIELD'; payload: { fieldId: string; updates: Partial<FieldConfig> } }
  | { type: 'DUPLICATE_FIELD'; payload: string }
  | { type: 'REORDER_FIELDS'; payload: { pageIndex: number; fieldIds: string[] } }
  | { type: 'MOVE_FIELD_TO_PAGE'; payload: { fieldId: string; targetPageIndex: number; targetIndex?: number } }
  | { type: 'SELECT_FIELD'; payload: string | null }
  | { type: 'SET_SELECTED_PAGE'; payload: number }
  | { type: 'ADD_PAGE'; payload?: { afterIndex?: number; title?: string } }
  | { type: 'REMOVE_PAGE'; payload: number }
  | { type: 'UPDATE_PAGE'; payload: { pageIndex: number; updates: Partial<FormPage> } }
  | { type: 'REORDER_PAGES'; payload: string[] }
  | { type: 'UPDATE_STYLING'; payload: Partial<FormStyling> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<FormSettings> }
  | { type: 'SET_DRAGGING'; payload: boolean }
  | { type: 'TOGGLE_TEST_PANEL' }
  | { type: 'TOGGLE_CONFIG_PANEL' }
  | { type: 'TOGGLE_SETTINGS_PANEL' }
  | { type: 'CLOSE_ALL_PANELS' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'MARK_SAVED' }
  | { type: 'RESET_FORM' };

// Field metadata for palette
export interface FieldMetadata {
  type: FieldType;
  category: FieldCategory;
  label: string;
  icon: string; // Lucide icon name
  description: string;
  defaultConfig: Partial<FieldConfig>;
}

// Field registry
export const FIELD_REGISTRY: Record<FieldType, FieldMetadata> = {
  // Predefined fields
  best_time_to_call: {
    type: 'best_time_to_call',
    category: 'predefined',
    label: 'Best Time to Call',
    icon: 'Clock',
    description: 'Dropdown for preferred contact time',
    defaultConfig: {
      label: 'Best Time to Call',
      name: 'bestTimeToCall',
      required: false,
      width: 'full',
      options: [
        { id: '1', label: 'Morning (8am - 12pm)', value: 'morning' },
        { id: '2', label: 'Afternoon (12pm - 5pm)', value: 'afternoon' },
        { id: '3', label: 'Evening (5pm - 8pm)', value: 'evening' },
      ],
    },
  },
  email: {
    type: 'email',
    category: 'predefined',
    label: 'Email Address',
    icon: 'Mail',
    description: 'Email input with validation',
    defaultConfig: {
      label: 'Email Address',
      name: 'email',
      placeholder: 'you@example.com',
      required: true,
      width: 'full',
      validation: { pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
    },
  },
  first_name: {
    type: 'first_name',
    category: 'predefined',
    label: 'First Name',
    icon: 'User',
    description: 'First name text input',
    defaultConfig: {
      label: 'First Name',
      name: 'firstName',
      placeholder: 'John',
      required: true,
      width: 'half',
    },
  },
  last_name: {
    type: 'last_name',
    category: 'predefined',
    label: 'Last Name',
    icon: 'User',
    description: 'Last name text input',
    defaultConfig: {
      label: 'Last Name',
      name: 'lastName',
      placeholder: 'Doe',
      required: true,
      width: 'half',
    },
  },
  phone_number: {
    type: 'phone_number',
    category: 'predefined',
    label: 'Phone Number',
    icon: 'Phone',
    description: 'Phone number with formatting',
    defaultConfig: {
      label: 'Phone Number',
      name: 'phone',
      placeholder: '(555) 123-4567',
      required: true,
      width: 'full',
    },
  },
  zip_code: {
    type: 'zip_code',
    category: 'predefined',
    label: 'Zip Code',
    icon: 'MapPin',
    description: '5-digit zip code input',
    defaultConfig: {
      label: 'Zip Code',
      name: 'zipCode',
      placeholder: '12345',
      required: true,
      width: 'half',
      validation: { pattern: '^\\d{5}$', maxLength: 5 },
    },
  },

  // Standard fields
  accept_terms: {
    type: 'accept_terms',
    category: 'standard',
    label: 'Accept Terms',
    icon: 'CheckSquare',
    description: 'Terms and conditions checkbox',
    defaultConfig: {
      label: 'I agree to the Terms and Conditions',
      name: 'acceptTerms',
      required: true,
      width: 'full',
    },
  },
  bmi_calculator: {
    type: 'bmi_calculator',
    category: 'standard',
    label: 'BMI Calculator',
    icon: 'Calculator',
    description: 'Height/weight inputs with BMI calculation',
    defaultConfig: {
      label: 'BMI Calculator',
      name: 'bmi',
      required: false,
      width: 'full',
      heightUnit: 'inches',
      weightUnit: 'lbs',
    },
  },
  date_of_birth: {
    type: 'date_of_birth',
    category: 'standard',
    label: 'Date of Birth',
    icon: 'Calendar',
    description: 'Date picker for birthdate',
    defaultConfig: {
      label: 'Date of Birth',
      name: 'dateOfBirth',
      required: true,
      width: 'full',
    },
  },
  short_text: {
    type: 'short_text',
    category: 'standard',
    label: 'Short Text',
    icon: 'Type',
    description: 'Single-line text input',
    defaultConfig: {
      label: 'Short Text',
      name: 'shortText',
      placeholder: 'Enter text...',
      required: false,
      width: 'full',
    },
  },
  long_text: {
    type: 'long_text',
    category: 'standard',
    label: 'Long Text',
    icon: 'AlignLeft',
    description: 'Multi-line textarea',
    defaultConfig: {
      label: 'Long Text',
      name: 'longText',
      placeholder: 'Enter your message...',
      required: false,
      width: 'full',
      validation: { maxLength: 1000 },
    },
  },
  multiple_choice: {
    type: 'multiple_choice',
    category: 'standard',
    label: 'Multiple Choice',
    icon: 'CheckCircle',
    description: 'Checkboxes for multiple selections',
    defaultConfig: {
      label: 'Multiple Choice',
      name: 'multipleChoice',
      required: false,
      width: 'full',
      options: [
        { id: '1', label: 'Option 1', value: 'option1' },
        { id: '2', label: 'Option 2', value: 'option2' },
        { id: '3', label: 'Option 3', value: 'option3' },
      ],
    },
  },
  number_entry: {
    type: 'number_entry',
    category: 'standard',
    label: 'Number Entry',
    icon: 'Hash',
    description: 'Numeric input field',
    defaultConfig: {
      label: 'Number',
      name: 'number',
      placeholder: '0',
      required: false,
      width: 'half',
    },
  },
  single_choice: {
    type: 'single_choice',
    category: 'standard',
    label: 'Single Choice',
    icon: 'Circle',
    description: 'Radio buttons for single selection',
    defaultConfig: {
      label: 'Single Choice',
      name: 'singleChoice',
      required: false,
      width: 'full',
      options: [
        { id: '1', label: 'Option 1', value: 'option1' },
        { id: '2', label: 'Option 2', value: 'option2' },
        { id: '3', label: 'Option 3', value: 'option3' },
      ],
    },
  },
  site_selector: {
    type: 'site_selector',
    category: 'standard',
    label: 'Site Selector',
    icon: 'Building2',
    description: 'Select nearby clinical trial sites',
    defaultConfig: {
      label: 'Select a Site Near You',
      name: 'selectedSite',
      helperText: 'Sites are ordered by distance from your zip code',
      required: true,
      width: 'full',
    },
  },

  // Layout elements
  divider: {
    type: 'divider',
    category: 'layout',
    label: 'Divider',
    icon: 'Minus',
    description: 'Visual separator line',
    defaultConfig: {
      label: '',
      name: 'divider',
      required: false,
      width: 'full',
    },
  },
  free_form_text: {
    type: 'free_form_text',
    category: 'layout',
    label: 'Free Form Text',
    icon: 'FileText',
    description: 'Static text block for instructions',
    defaultConfig: {
      label: '',
      name: 'freeFormText',
      required: false,
      width: 'full',
      content: 'Enter your text here...',
    },
  },
  next_button: {
    type: 'next_button',
    category: 'layout',
    label: 'Next Button',
    icon: 'ArrowRight',
    description: 'Navigate to next page (wizard mode)',
    defaultConfig: {
      label: 'Next',
      name: 'nextButton',
      required: false,
      width: 'full',
    },
  },
  page_break: {
    type: 'page_break',
    category: 'layout',
    label: 'Page Break',
    icon: 'FileBreak',
    description: 'Create a new page (wizard mode)',
    defaultConfig: {
      label: 'Page Break',
      name: 'pageBreak',
      required: false,
      width: 'full',
    },
  },
  submit_button: {
    type: 'submit_button',
    category: 'layout',
    label: 'Submit Button',
    icon: 'Send',
    description: 'Form submission button',
    defaultConfig: {
      label: 'Submit',
      name: 'submitButton',
      required: false,
      width: 'full',
    },
  },
};

// Helper to get fields by category
export function getFieldsByCategory(category: FieldCategory): FieldMetadata[] {
  return Object.values(FIELD_REGISTRY).filter((field) => field.category === category);
}

// Helper to create default form
export function createDefaultForm(): FormDefinition {
  const now = new Date().toISOString();
  return {
    id: `form-${Date.now()}`,
    name: 'Untitled Form',
    description: '',
    mode: 'inline',
    pages: [
      {
        id: 'page-1',
        title: 'Page 1',
        description: '',
        fieldIds: [],
      },
    ],
    fields: {},
    styling: {
      primaryColor: '#53CA97',
      backgroundColor: 'transparent',
      textColor: '#1B2222',
      fieldRadius: 'lg',
      labelPosition: 'top',
      fieldSpacing: 'normal',
      useGlassEffect: true,
      showProgressBar: true,
      progressBarStyle: 'steps',
    },
    settings: {
      submitAction: 'message',
      submitMessage: 'Thank you for your submission!',
      enableRecaptcha: false,
      collectAnalytics: true,
    },
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };
}

// Helper to create a new field
export function createField(type: FieldType, existingFieldNames: string[]): FieldConfig {
  const metadata = FIELD_REGISTRY[type];
  const baseConfig = metadata.defaultConfig;

  // Generate unique name if needed
  let name = baseConfig.name || type;
  let counter = 1;
  while (existingFieldNames.includes(name)) {
    name = `${baseConfig.name || type}_${counter}`;
    counter++;
  }

  return {
    id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    label: baseConfig.label || metadata.label,
    name,
    placeholder: baseConfig.placeholder,
    helperText: baseConfig.helperText,
    defaultValue: baseConfig.defaultValue,
    required: baseConfig.required ?? false,
    validation: baseConfig.validation,
    options: baseConfig.options,
    width: baseConfig.width || 'full',
    content: baseConfig.content,
    heightUnit: baseConfig.heightUnit,
    weightUnit: baseConfig.weightUnit,
  };
}

// Initial form builder state
export function createInitialState(form?: FormDefinition): FormBuilderState {
  return {
    form: form || createDefaultForm(),
    selectedFieldId: null,
    selectedPageIndex: 0,
    isDragging: false,
    isTestPanelOpen: false,
    isConfigPanelOpen: false,
    isSettingsPanelOpen: false,
    hasUnsavedChanges: false,
    undoStack: [],
    redoStack: [],
  };
}
