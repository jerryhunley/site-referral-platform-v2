'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette } from 'lucide-react';
import { useFormBuilder } from '@/lib/context/FormBuilderContext';
import { cn } from '@/lib/utils';
import {
  type FormMode,
  type RadiusSize,
  type SpacingSize,
  type LabelPosition,
  type ProgressBarStyle,
} from '@/lib/types/form-builder';

const colorPresets = [
  '#53CA97', // Mint (default)
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
  } = useFormBuilder();
  const { isSettingsPanelOpen, form } = state;
  const { styling } = form;

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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-bg-secondary border-l border-glass-border shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-glass-border">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Form Settings
                </h2>
                <p className="text-sm text-text-muted">
                  Customize your form's appearance
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
                          : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
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
                  className="w-full px-4 py-2.5 rounded-xl bg-bg-tertiary border border-glass-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-colors resize-none text-sm"
                  placeholder="Add a description for your form..."
                />
              </div>

              {/* Divider */}
              <div className="border-t border-glass-border pt-6">
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
                            : 'bg-bg-tertiary text-text-secondary hover:text-text-primary',
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
                            : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
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
                            : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
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
                      styling.useGlassEffect ? 'bg-mint' : 'bg-bg-tertiary'
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
                          styling.showProgressBar ? 'bg-mint' : 'bg-bg-tertiary'
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
                                  : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
