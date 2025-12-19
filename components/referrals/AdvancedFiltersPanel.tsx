'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Search,
  ChevronDown,
  Check,
  // Field icons
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Building2,
  FlaskConical,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Tag,
  MapPin,
  Hash,
  FileText,
  Star,
  Heart,
  Activity,
  Stethoscope,
  Pill,
  Users,
  ClipboardList,
  Timer,
  CalendarCheck,
  CalendarX,
  UserCheck,
  Send,
  Inbox,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReferralStatus } from '@/lib/types';
import { statusConfigs } from '@/lib/types';
import { mockStudies } from '@/lib/mock-data/studies';
import { mockUsers } from '@/lib/mock-data/users';

// ===========================================
// Types
// ===========================================

interface FilterField {
  id: string;
  label: string;
  icon: LucideIcon;
  category: string;
  operators: FilterOperator[];
  valueType: 'text' | 'select' | 'multi-select' | 'date' | 'number' | 'boolean';
  options?: { value: string; label: string }[];
}

interface FilterOperator {
  value: string;
  label: string;
}

interface FilterCondition {
  id: string;
  fieldId: string;
  operator: string;
  value: string | string[] | boolean;
}

interface FilterGroup {
  id: string;
  logic: 'and' | 'or';
  conditions: FilterCondition[];
}

interface AdvancedFiltersState {
  groups: FilterGroup[];
  groupLogic: 'and' | 'or';
}

interface AdvancedFiltersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ===========================================
// Filter Field Definitions
// ===========================================

const TEXT_OPERATORS: FilterOperator[] = [
  { value: 'contains', label: 'contains' },
  { value: 'not_contains', label: 'does not contain' },
  { value: 'equals', label: 'is' },
  { value: 'not_equals', label: 'is not' },
  { value: 'starts_with', label: 'starts with' },
  { value: 'ends_with', label: 'ends with' },
  { value: 'is_empty', label: 'is empty' },
  { value: 'is_not_empty', label: 'is not empty' },
];

const SELECT_OPERATORS: FilterOperator[] = [
  { value: 'is', label: 'is' },
  { value: 'is_not', label: 'is not' },
  { value: 'is_any_of', label: 'is any of' },
  { value: 'is_none_of', label: 'is none of' },
  { value: 'is_empty', label: 'is empty' },
  { value: 'is_not_empty', label: 'is not empty' },
];

const DATE_OPERATORS: FilterOperator[] = [
  { value: 'is', label: 'is' },
  { value: 'is_before', label: 'is before' },
  { value: 'is_after', label: 'is after' },
  { value: 'is_between', label: 'is between' },
  { value: 'is_within', label: 'is within' },
  { value: 'is_empty', label: 'is empty' },
  { value: 'is_not_empty', label: 'is not empty' },
];

const NUMBER_OPERATORS: FilterOperator[] = [
  { value: 'equals', label: '=' },
  { value: 'not_equals', label: '≠' },
  { value: 'greater_than', label: '>' },
  { value: 'less_than', label: '<' },
  { value: 'greater_or_equal', label: '≥' },
  { value: 'less_or_equal', label: '≤' },
  { value: 'is_between', label: 'is between' },
  { value: 'is_empty', label: 'is empty' },
];

const BOOLEAN_OPERATORS: FilterOperator[] = [
  { value: 'is_true', label: 'is true' },
  { value: 'is_false', label: 'is false' },
];

// Status options from our status configs
const statusOptions = Object.entries(statusConfigs).map(([value, config]) => ({
  value,
  label: config.label,
}));

// Study options
const studyOptions = mockStudies.map((s) => ({
  value: s.id,
  label: s.name,
}));

// User options for assignee
const userOptions = [
  { value: 'unassigned', label: 'Unassigned' },
  ...mockUsers.map((u) => ({
    value: u.id,
    label: `${u.firstName} ${u.lastName}`,
  })),
];

// Site options (mock)
const siteOptions = [
  { value: 'site-001', label: 'Site 001 - Main Campus' },
  { value: 'site-002', label: 'Site 002 - Downtown' },
  { value: 'site-003', label: 'Site 003 - North Clinic' },
  { value: 'site-004', label: 'Site 004 - South Medical' },
  { value: 'site-005', label: 'Site 005 - East Wing' },
];

// Qualification bucket options
const qualificationBuckets = [
  { value: 'highly_qualified', label: 'Highly Qualified' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'needs_review', label: 'Needs Review' },
  { value: 'not_qualified', label: 'Not Qualified' },
  { value: 'pending_screening', label: 'Pending Screening' },
];

// Source options
const sourceOptions = [
  { value: 'web_form', label: 'Web Form' },
  { value: 'phone_call', label: 'Phone Call' },
  { value: 'referral', label: 'Physician Referral' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'clinical_trial_finder', label: 'Clinical Trial Finder' },
];

// Priority options
const priorityOptions = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

// Contact attempt options
const contactAttemptOptions = [
  { value: '0', label: 'No attempts' },
  { value: '1', label: '1 attempt' },
  { value: '2', label: '2 attempts' },
  { value: '3', label: '3 attempts' },
  { value: '4', label: '4 attempts' },
  { value: '5+', label: '5+ attempts' },
];

// All available filter fields
const FILTER_FIELDS: FilterField[] = [
  // Contact Info
  {
    id: 'first_name',
    label: 'First Name',
    icon: User,
    category: 'Contact Info',
    operators: TEXT_OPERATORS,
    valueType: 'text',
  },
  {
    id: 'last_name',
    label: 'Last Name',
    icon: User,
    category: 'Contact Info',
    operators: TEXT_OPERATORS,
    valueType: 'text',
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    category: 'Contact Info',
    operators: TEXT_OPERATORS,
    valueType: 'text',
  },
  {
    id: 'phone',
    label: 'Phone Number',
    icon: Phone,
    category: 'Contact Info',
    operators: TEXT_OPERATORS,
    valueType: 'text',
  },
  {
    id: 'zip_code',
    label: 'Zip Code',
    icon: MapPin,
    category: 'Contact Info',
    operators: TEXT_OPERATORS,
    valueType: 'text',
  },

  // Status & Assignment
  {
    id: 'status',
    label: 'Status',
    icon: CheckCircle,
    category: 'Status & Assignment',
    operators: SELECT_OPERATORS,
    valueType: 'multi-select',
    options: statusOptions,
  },
  {
    id: 'assigned_to',
    label: 'Assignee',
    icon: UserCheck,
    category: 'Status & Assignment',
    operators: SELECT_OPERATORS,
    valueType: 'multi-select',
    options: userOptions,
  },
  {
    id: 'qualification_bucket',
    label: 'Qualification Bucket',
    icon: ClipboardList,
    category: 'Status & Assignment',
    operators: SELECT_OPERATORS,
    valueType: 'multi-select',
    options: qualificationBuckets,
  },
  {
    id: 'priority',
    label: 'Priority',
    icon: AlertCircle,
    category: 'Status & Assignment',
    operators: SELECT_OPERATORS,
    valueType: 'select',
    options: priorityOptions,
  },

  // Study & Site
  {
    id: 'study',
    label: 'Study',
    icon: FlaskConical,
    category: 'Study & Site',
    operators: SELECT_OPERATORS,
    valueType: 'multi-select',
    options: studyOptions,
  },
  {
    id: 'site',
    label: 'Site',
    icon: Building2,
    category: 'Study & Site',
    operators: SELECT_OPERATORS,
    valueType: 'multi-select',
    options: siteOptions,
  },
  {
    id: 'protocol_number',
    label: 'Protocol Number',
    icon: FileText,
    category: 'Study & Site',
    operators: TEXT_OPERATORS,
    valueType: 'text',
  },

  // Dates
  {
    id: 'submitted_at',
    label: 'Date Submitted',
    icon: Calendar,
    category: 'Dates',
    operators: DATE_OPERATORS,
    valueType: 'date',
  },
  {
    id: 'last_contacted_at',
    label: 'Last Contacted',
    icon: Clock,
    category: 'Dates',
    operators: DATE_OPERATORS,
    valueType: 'date',
  },
  {
    id: 'appointment_date',
    label: 'Appointment Date',
    icon: CalendarCheck,
    category: 'Dates',
    operators: DATE_OPERATORS,
    valueType: 'date',
  },
  {
    id: 'date_of_birth',
    label: 'Date of Birth',
    icon: Calendar,
    category: 'Dates',
    operators: DATE_OPERATORS,
    valueType: 'date',
  },
  {
    id: 'icf_signed_date',
    label: 'ICF Signed Date',
    icon: CalendarCheck,
    category: 'Dates',
    operators: DATE_OPERATORS,
    valueType: 'date',
  },

  // Communication
  {
    id: 'has_unread_messages',
    label: 'Has Unread Messages',
    icon: MessageSquare,
    category: 'Communication',
    operators: BOOLEAN_OPERATORS,
    valueType: 'boolean',
  },
  {
    id: 'contact_attempts',
    label: 'Contact Attempts',
    icon: Phone,
    category: 'Communication',
    operators: SELECT_OPERATORS,
    valueType: 'select',
    options: contactAttemptOptions,
  },
  {
    id: 'last_message_direction',
    label: 'Last Message Direction',
    icon: Send,
    category: 'Communication',
    operators: SELECT_OPERATORS,
    valueType: 'select',
    options: [
      { value: 'inbound', label: 'Inbound (from patient)' },
      { value: 'outbound', label: 'Outbound (to patient)' },
    ],
  },
  {
    id: 'sms_opt_in',
    label: 'SMS Opt-in',
    icon: MessageSquare,
    category: 'Communication',
    operators: BOOLEAN_OPERATORS,
    valueType: 'boolean',
  },

  // Source & Tracking
  {
    id: 'source',
    label: 'Referral Source',
    icon: Inbox,
    category: 'Source & Tracking',
    operators: SELECT_OPERATORS,
    valueType: 'multi-select',
    options: sourceOptions,
  },
  {
    id: 'campaign',
    label: 'Campaign',
    icon: Tag,
    category: 'Source & Tracking',
    operators: TEXT_OPERATORS,
    valueType: 'text',
  },
  {
    id: 'referral_id',
    label: 'Referral ID',
    icon: Hash,
    category: 'Source & Tracking',
    operators: TEXT_OPERATORS,
    valueType: 'text',
  },

  // Medical
  {
    id: 'age',
    label: 'Age',
    icon: User,
    category: 'Medical',
    operators: NUMBER_OPERATORS,
    valueType: 'number',
  },
  {
    id: 'bmi',
    label: 'BMI',
    icon: Activity,
    category: 'Medical',
    operators: NUMBER_OPERATORS,
    valueType: 'number',
  },
  {
    id: 'diagnosis',
    label: 'Diagnosis',
    icon: Stethoscope,
    category: 'Medical',
    operators: TEXT_OPERATORS,
    valueType: 'text',
  },
  {
    id: 'medications',
    label: 'Current Medications',
    icon: Pill,
    category: 'Medical',
    operators: TEXT_OPERATORS,
    valueType: 'text',
  },
  {
    id: 'medical_history',
    label: 'Medical History',
    icon: Heart,
    category: 'Medical',
    operators: TEXT_OPERATORS,
    valueType: 'text',
  },

  // Notes & Tags
  {
    id: 'notes',
    label: 'Notes',
    icon: FileText,
    category: 'Notes & Tags',
    operators: TEXT_OPERATORS,
    valueType: 'text',
  },
  {
    id: 'tags',
    label: 'Tags',
    icon: Tag,
    category: 'Notes & Tags',
    operators: SELECT_OPERATORS,
    valueType: 'multi-select',
    options: [
      { value: 'vip', label: 'VIP' },
      { value: 'urgent', label: 'Urgent' },
      { value: 'follow_up', label: 'Follow Up' },
      { value: 'callback_requested', label: 'Callback Requested' },
      { value: 'hard_to_reach', label: 'Hard to Reach' },
      { value: 'spanish_speaking', label: 'Spanish Speaking' },
    ],
  },
  {
    id: 'starred',
    label: 'Starred',
    icon: Star,
    category: 'Notes & Tags',
    operators: BOOLEAN_OPERATORS,
    valueType: 'boolean',
  },
];

// Group fields by category
const groupedFields = FILTER_FIELDS.reduce((acc, field) => {
  if (!acc[field.category]) {
    acc[field.category] = [];
  }
  acc[field.category].push(field);
  return acc;
}, {} as Record<string, FilterField[]>);

// ===========================================
// Searchable Field Dropdown Component
// ===========================================

interface FieldSelectorProps {
  value: string;
  onChange: (fieldId: string) => void;
  excludeIds?: string[];
}

function FieldSelector({ value, onChange, excludeIds = [] }: FieldSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedField = FILTER_FIELDS.find((f) => f.id === value);

  // Filter fields based on search
  const filteredGroupedFields = useMemo(() => {
    const searchLower = search.toLowerCase();
    const result: Record<string, FilterField[]> = {};

    Object.entries(groupedFields).forEach(([category, fields]) => {
      const filteredFields = fields.filter(
        (f) =>
          !excludeIds.includes(f.id) &&
          (f.label.toLowerCase().includes(searchLower) ||
            f.category.toLowerCase().includes(searchLower))
      );
      if (filteredFields.length > 0) {
        result[category] = filteredFields;
      }
    });

    return result;
  }, [search, excludeIds]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg w-full text-left',
          'bg-gray-100 dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700',
          'hover:border-gray-300 dark:hover:border-gray-600 transition-colors',
          isOpen && 'ring-2 ring-mint/40 border-mint'
        )}
      >
        {selectedField ? (
          <>
            <selectedField.icon className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-primary flex-1">{selectedField.label}</span>
          </>
        ) : (
          <>
            <Search className="w-4 h-4 text-text-muted" />
            <span className="text-sm text-text-muted flex-1">Select field...</span>
          </>
        )}
        <ChevronDown
          className={cn(
            'w-4 h-4 text-text-muted transition-transform',
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
            className="absolute top-full left-0 right-0 mt-2 z-60 max-h-80 overflow-hidden flex flex-col rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg"
          >
            {/* Search input */}
            <div className="p-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-mint/40 focus:border-mint"
                />
              </div>
            </div>

            {/* Field list */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
              {Object.entries(filteredGroupedFields).map(([category, fields]) => (
                <div key={category}>
                  <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-1.5">
                    {category}
                  </p>
                  <div className="space-y-0.5">
                    {fields.map((field) => (
                      <button
                        key={field.id}
                        onClick={() => {
                          onChange(field.id);
                          setIsOpen(false);
                          setSearch('');
                        }}
                        className={cn(
                          'flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-left',
                          'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
                          value === field.id && 'bg-mint/10 dark:bg-mint/20'
                        )}
                      >
                        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <field.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <span className="text-sm text-text-primary flex-1">{field.label}</span>
                        {value === field.id && (
                          <Check className="w-4 h-4 text-mint" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {Object.keys(filteredGroupedFields).length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No fields match your search
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===========================================
// Operator Selector Component
// ===========================================

interface OperatorSelectorProps {
  operators: FilterOperator[];
  value: string;
  onChange: (operator: string) => void;
}

function OperatorSelector({ operators, value, onChange }: OperatorSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/40 focus:border-mint transition-colors cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
    >
      {operators.map((op) => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
    </select>
  );
}

// ===========================================
// Value Input Component
// ===========================================

interface ValueInputProps {
  field: FilterField;
  operator: string;
  value: string | string[] | boolean;
  onChange: (value: string | string[] | boolean) => void;
}

function ValueInput({ field, operator, value, onChange }: ValueInputProps) {
  // No value input needed for empty checks
  if (operator === 'is_empty' || operator === 'is_not_empty') {
    return null;
  }

  // Boolean values
  if (field.valueType === 'boolean' || operator === 'is_true' || operator === 'is_false') {
    return null; // Operator itself determines the value
  }

  // Multi-select
  if (field.valueType === 'multi-select' && field.options) {
    const selectedValues = Array.isArray(value) ? value : [];
    return (
      <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 min-h-[42px]">
        {field.options.map((opt) => {
          const isSelected = selectedValues.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                const newValues = isSelected
                  ? selectedValues.filter((v) => v !== opt.value)
                  : [...selectedValues, opt.value];
                onChange(newValues);
              }}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
                isSelected
                  ? 'bg-mint text-white shadow-sm'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  // Single select
  if (field.valueType === 'select' && field.options) {
    return (
      <select
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/40 focus:border-mint transition-colors cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
      >
        <option value="">Select value...</option>
        {field.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  // Date input
  if (field.valueType === 'date') {
    return (
      <input
        type="date"
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/40 focus:border-mint transition-colors"
      />
    );
  }

  // Number input
  if (field.valueType === 'number') {
    return (
      <input
        type="number"
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter value..."
        className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-mint/40 focus:border-mint transition-colors"
      />
    );
  }

  // Default: text input
  return (
    <input
      type="text"
      value={value as string}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter value..."
      className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-mint/40 focus:border-mint transition-colors"
    />
  );
}

// ===========================================
// Filter Condition Row Component
// ===========================================

interface ConditionRowProps {
  condition: FilterCondition;
  onChange: (condition: FilterCondition) => void;
  onRemove: () => void;
  showLogic: boolean;
  logic: 'and' | 'or';
  onLogicChange?: (logic: 'and' | 'or') => void;
}

function ConditionRow({
  condition,
  onChange,
  onRemove,
  showLogic,
  logic,
  onLogicChange,
}: ConditionRowProps) {
  const field = FILTER_FIELDS.find((f) => f.id === condition.fieldId);

  const handleFieldChange = (fieldId: string) => {
    const newField = FILTER_FIELDS.find((f) => f.id === fieldId);
    onChange({
      ...condition,
      fieldId,
      operator: newField?.operators[0]?.value || 'equals',
      value: '',
    });
  };

  return (
    <div className="space-y-2">
      {/* Logic connector */}
      {showLogic && onLogicChange && (
        <div className="flex items-center gap-2 pl-4">
          <button
            onClick={() => onLogicChange(logic === 'and' ? 'or' : 'and')}
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-md transition-colors',
              logic === 'and'
                ? 'bg-mint/15 text-mint dark:bg-mint/20'
                : 'bg-vista-blue/15 text-vista-blue dark:bg-vista-blue/20'
            )}
          >
            {logic.toUpperCase()}
          </button>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>
      )}

      {/* Condition inputs */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
        <div className="flex-1 space-y-2">
          {/* Field selector */}
          <FieldSelector
            value={condition.fieldId}
            onChange={handleFieldChange}
          />

          {/* Operator and value row */}
          {condition.fieldId && field && (
            <div className="flex items-start gap-2 flex-wrap">
              <OperatorSelector
                operators={field.operators}
                value={condition.operator}
                onChange={(operator) => onChange({ ...condition, operator })}
              />
              <div className="flex-1 min-w-[150px]">
                <ValueInput
                  field={field}
                  operator={condition.operator}
                  value={condition.value}
                  onChange={(value) => onChange({ ...condition, value })}
                />
              </div>
            </div>
          )}
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="p-2 rounded-lg text-gray-400 hover:text-error hover:bg-error/10 transition-colors"
          title="Remove filter"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ===========================================
// Filter Group Component
// ===========================================

interface FilterGroupComponentProps {
  group: FilterGroup;
  onChange: (group: FilterGroup) => void;
  onRemove?: () => void;
  showGroupLogic: boolean;
  groupLogic: 'and' | 'or';
  onGroupLogicChange?: (logic: 'and' | 'or') => void;
}

function FilterGroupComponent({
  group,
  onChange,
  onRemove,
  showGroupLogic,
  groupLogic,
  onGroupLogicChange,
}: FilterGroupComponentProps) {
  const handleAddCondition = () => {
    const newCondition: FilterCondition = {
      id: `cond-${Date.now()}`,
      fieldId: '',
      operator: 'equals',
      value: '',
    };
    onChange({
      ...group,
      conditions: [...group.conditions, newCondition],
    });
  };

  const handleUpdateCondition = (index: number, condition: FilterCondition) => {
    const newConditions = [...group.conditions];
    newConditions[index] = condition;
    onChange({ ...group, conditions: newConditions });
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = group.conditions.filter((_, i) => i !== index);
    onChange({ ...group, conditions: newConditions });
  };

  return (
    <div className="space-y-2">
      {/* Group logic connector */}
      {showGroupLogic && onGroupLogicChange && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onGroupLogicChange(groupLogic === 'and' ? 'or' : 'and')}
            className={cn(
              'px-3 py-1 text-xs font-semibold rounded-md transition-colors',
              groupLogic === 'and'
                ? 'bg-mint/15 text-mint dark:bg-mint/20'
                : 'bg-vista-blue/15 text-vista-blue dark:bg-vista-blue/20'
            )}
          >
            {groupLogic.toUpperCase()}
          </button>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>
      )}

      {/* Group container */}
      <div className="p-4 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-3 shadow-sm">
        {/* Conditions */}
        {group.conditions.map((condition, index) => (
          <ConditionRow
            key={condition.id}
            condition={condition}
            onChange={(c) => handleUpdateCondition(index, c)}
            onRemove={() => handleRemoveCondition(index)}
            showLogic={index > 0}
            logic={group.logic}
            onLogicChange={index > 0 ? (logic) => onChange({ ...group, logic }) : undefined}
          />
        ))}

        {/* Add condition button */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleAddCondition}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-mint hover:bg-mint/10 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add filter
          </button>

          {onRemove && group.conditions.length > 0 && (
            <button
              onClick={onRemove}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors ml-auto"
            >
              <Trash2 className="w-4 h-4" />
              Remove group
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ===========================================
// Main Panel Component
// ===========================================

function createEmptyGroup(): FilterGroup {
  return {
    id: `group-${Date.now()}`,
    logic: 'and',
    conditions: [
      {
        id: `cond-${Date.now()}`,
        fieldId: '',
        operator: 'equals',
        value: '',
      },
    ],
  };
}

export function AdvancedFiltersPanel({ isOpen, onClose }: AdvancedFiltersPanelProps) {
  const [filters, setFilters] = useState<AdvancedFiltersState>({
    groups: [createEmptyGroup()],
    groupLogic: 'and',
  });

  const handleUpdateGroup = (index: number, group: FilterGroup) => {
    const newGroups = [...filters.groups];
    newGroups[index] = group;
    setFilters({ ...filters, groups: newGroups });
  };

  const handleRemoveGroup = (index: number) => {
    const newGroups = filters.groups.filter((_, i) => i !== index);
    setFilters({ ...filters, groups: newGroups });
  };

  const handleAddGroup = () => {
    setFilters({
      ...filters,
      groups: [...filters.groups, createEmptyGroup()],
    });
  };

  const handleClearAll = () => {
    setFilters({
      groups: [createEmptyGroup()],
      groupLogic: 'and',
    });
  };

  const activeFilterCount = filters.groups.reduce(
    (count, group) => count + group.conditions.filter((c) => c.fieldId).length,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 bottom-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel - Floating card */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-6 top-24 bottom-6 w-[480px] bg-white dark:bg-gray-900 rounded-2xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Advanced Filters
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activeFilterCount > 0
                    ? `${activeFilterCount} filter${activeFilterCount === 1 ? '' : 's'} active`
                    : 'Build complex filter queries'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 dark:bg-gray-900">
              {/* Filter Groups */}
              {filters.groups.map((group, index) => (
                <FilterGroupComponent
                  key={group.id}
                  group={group}
                  onChange={(g) => handleUpdateGroup(index, g)}
                  onRemove={filters.groups.length > 1 ? () => handleRemoveGroup(index) : undefined}
                  showGroupLogic={index > 0}
                  groupLogic={filters.groupLogic}
                  onGroupLogicChange={
                    index > 0
                      ? (logic) => setFilters({ ...filters, groupLogic: logic })
                      : undefined
                  }
                />
              ))}

              {/* Add Group Button */}
              <button
                onClick={handleAddGroup}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-vista-blue bg-vista-blue/10 hover:bg-vista-blue/15 dark:bg-vista-blue/20 dark:hover:bg-vista-blue/25 rounded-lg border border-vista-blue/20 dark:border-vista-blue/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add filter group
              </button>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800/50">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-error transition-colors"
              >
                Clear all
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-mint hover:bg-mint-dark rounded-lg shadow-sm transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
