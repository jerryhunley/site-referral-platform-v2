'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, ExternalLink, Globe, ChevronDown, Paintbrush } from 'lucide-react';
import { useFormBuilder } from '@/lib/context/FormBuilderContext';
import { cn } from '@/lib/utils';
import {
  type FormMode,
  type RadiusSize,
  type SpacingSize,
  type LabelPosition,
  type ProgressBarStyle,
  type AdvancedFieldStyles,
} from '@/lib/types/form-builder';
import { cssObjectToString, cssStringToObject, getStyleKeyDisplayName } from '@/lib/utils/css-parser';

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
];

// All available style keys for global defaults
const allStyleKeys: (keyof AdvancedFieldStyles)[] = [
  'label',
  'input',
  'checkbox',
  'radioGroup',
  'button',
  'inputAddon',
  'container',
  'divider',
  'dividerContainer',
  'dividerLabel',
];

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
    <div className="pt-6">
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
            <div className="pt-4 space-y-4">{children}</div>
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

const colorPresets = [
  '#2E9B73', // Mint (default)
  '#7991C6', // Vista Blue
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#10B981', // Emerald
];

export function FormSettingsPanel() {
  const {
    state,
    toggleSettingsPanel,
    setFormMode,
    updateStyling,
    updateFormDescription,
    updateSettings,
  } = useFormBuilder();
  const { isSettingsPanelOpen, form } = state;
  const { styling, settings } = form;

  const handleGlobalStyleChange = (styleKey: keyof AdvancedFieldStyles, styles: React.CSSProperties) => {
    const currentStyles = styling.defaultAdvancedStyles || {};
    updateStyling({
      defaultAdvancedStyles: {
        ...currentStyles,
        [styleKey]: styles,
      },
    });
  };

  const handleClose = () => {
    toggleSettingsPanel();
  };

  return (
    <AnimatePresence>
      {isSettingsPanelOpen && (
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
                  Form Settings
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Customize your form&apos;s appearance
                </p>
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
              {/* Form Mode */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Form Type
                </label>
                <div className="flex gap-2">
                  {(['inline', 'wizard'] as FormMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFormMode(mode)}
                      className={cn(
                        'flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors',
                        form.mode === mode
                          ? 'bg-mint text-white'
                          : 'bg-white/40 dark:bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/15'
                      )}
                    >
                      {mode === 'inline' ? 'Single Page' : 'Multi-Step Wizard'}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-text-muted">
                  {form.mode === 'inline'
                    ? 'All fields on one page'
                    : 'Split form into multiple steps'}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Form Description
                </label>
                <textarea
                  value={form.description || ''}
                  onChange={(e) => updateFormDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-colors resize-none text-sm"
                  placeholder="Add a description for your form..."
                />
              </div>

              {/* Default Language */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-mint" />
                  <label className="text-sm font-medium text-text-primary">
                    Default Language
                  </label>
                </div>
                <select
                  value={settings.defaultLanguage || 'en'}
                  onChange={(e) => updateSettings({ defaultLanguage: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/10 text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-colors text-sm"
                >
                  {languageOptions.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Redirect URLs */}
              <div className="pt-6">
                <div className="mb-4 dotted-divider" />
                <div className="flex items-center gap-2 mb-4">
                  <ExternalLink className="w-4 h-4 text-mint" />
                  <h3 className="text-sm font-semibold text-text-primary">
                    Redirect URLs
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Qualifying URL */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Qualifying URL
                    </label>
                    <input
                      type="url"
                      value={settings.qualifyingUrl || ''}
                      onChange={(e) => updateSettings({ qualifyingUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-colors text-sm"
                      placeholder="https://example.com/thank-you"
                    />
                    <p className="mt-1 text-xs text-text-muted">
                      Redirect qualified leads here after submission
                    </p>
                  </div>

                  {/* Disqualifying URL */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Disqualifying URL
                    </label>
                    <input
                      type="url"
                      value={settings.disqualifyingUrl || ''}
                      onChange={(e) => updateSettings({ disqualifyingUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-colors text-sm"
                      placeholder="https://example.com/not-eligible"
                    />
                    <p className="mt-1 text-xs text-text-muted">
                      Redirect disqualified leads here after submission
                    </p>
                  </div>
                </div>
              </div>

              {/* Styling */}
              <div className="pt-6">
                <div className="mb-4 dotted-divider" />
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-4 h-4 text-mint" />
                  <h3 className="text-sm font-semibold text-text-primary">
                    Styling
                  </h3>
                </div>

                {/* Primary Color */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Primary Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorPresets.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateStyling({ primaryColor: color })}
                        className={cn(
                          'w-8 h-8 rounded-lg transition-transform hover:scale-110',
                          styling.primaryColor === color && 'ring-2 ring-offset-2 ring-offset-bg-secondary ring-text-primary'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <div className="relative">
                      <input
                        type="color"
                        value={styling.primaryColor}
                        onChange={(e) => updateStyling({ primaryColor: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-dashed border-glass-border flex items-center justify-center text-text-muted"
                        title="Custom color"
                      >
                        +
                      </div>
                    </div>
                  </div>
                </div>

                {/* Field Radius */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Corner Radius
                  </label>
                  <div className="flex gap-2">
                    {(['sm', 'md', 'lg', 'xl'] as RadiusSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => updateStyling({ fieldRadius: size })}
                        className={cn(
                          'flex-1 py-2 text-sm font-medium transition-colors',
                          styling.fieldRadius === size
                            ? 'bg-mint text-white'
                            : 'bg-white/40 dark:bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/15',
                          size === 'sm' && 'rounded-lg',
                          size === 'md' && 'rounded-xl',
                          size === 'lg' && 'rounded-2xl',
                          size === 'xl' && 'rounded-3xl'
                        )}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Field Spacing */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Field Spacing
                  </label>
                  <div className="flex gap-2">
                    {(['compact', 'normal', 'relaxed'] as SpacingSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => updateStyling({ fieldSpacing: size })}
                        className={cn(
                          'flex-1 py-2 rounded-xl text-sm font-medium transition-colors capitalize',
                          styling.fieldSpacing === size
                            ? 'bg-mint text-white'
                            : 'bg-white/40 dark:bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/15'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Label Position */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Label Position
                  </label>
                  <div className="flex gap-2">
                    {(['top', 'inline'] as LabelPosition[]).map((position) => (
                      <button
                        key={position}
                        onClick={() => updateStyling({ labelPosition: position })}
                        className={cn(
                          'flex-1 py-2 rounded-xl text-sm font-medium transition-colors capitalize',
                          styling.labelPosition === position
                            ? 'bg-mint text-white'
                            : 'bg-white/40 dark:bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/15'
                        )}
                      >
                        {position === 'top' ? 'Above Field' : 'Inline'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Glass Effect Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-text-primary">
                    Glass Effect
                  </label>
                  <button
                    onClick={() => updateStyling({ useGlassEffect: !styling.useGlassEffect })}
                    className={cn(
                      'relative w-11 h-6 rounded-full transition-colors',
                      styling.useGlassEffect ? 'bg-mint' : 'bg-white/40 dark:bg-white/10'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
                        styling.useGlassEffect ? 'left-6' : 'left-1'
                      )}
                    />
                  </button>
                </div>

                {/* Wizard-specific settings */}
                {form.mode === 'wizard' && (
                  <>
                    {/* Show Progress Bar */}
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-text-primary">
                        Show Progress Bar
                      </label>
                      <button
                        onClick={() => updateStyling({ showProgressBar: !styling.showProgressBar })}
                        className={cn(
                          'relative w-11 h-6 rounded-full transition-colors',
                          styling.showProgressBar ? 'bg-mint' : 'bg-white/40 dark:bg-white/10'
                        )}
                      >
                        <span
                          className={cn(
                            'absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform',
                            styling.showProgressBar ? 'left-6' : 'left-1'
                          )}
                        />
                      </button>
                    </div>

                    {/* Progress Bar Style */}
                    {styling.showProgressBar && (
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Progress Style
                        </label>
                        <div className="flex gap-2">
                          {(['steps', 'bar', 'dots'] as ProgressBarStyle[]).map((style) => (
                            <button
                              key={style}
                              onClick={() => updateStyling({ progressBarStyle: style })}
                              className={cn(
                                'flex-1 py-2 rounded-xl text-sm font-medium transition-colors capitalize',
                                styling.progressBarStyle === style
                                  ? 'bg-mint text-white'
                                  : 'bg-white/40 dark:bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/15'
                              )}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Global Style Defaults */}
              <CollapsibleSection
                title="Global Style Defaults"
                icon={<Paintbrush className="w-4 h-4 text-vista-blue" />}
                defaultOpen={false}
              >
                <p className="text-xs text-text-muted mb-3">
                  These CSS styles apply to all fields unless overridden individually.
                </p>
                {allStyleKeys.map((key) => (
                  <StyleInput
                    key={key}
                    label={getStyleKeyDisplayName(key)}
                    value={styling.defaultAdvancedStyles?.[key]}
                    onChange={(styles) => handleGlobalStyleChange(key, styles)}
                  />
                ))}
              </CollapsibleSection>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
