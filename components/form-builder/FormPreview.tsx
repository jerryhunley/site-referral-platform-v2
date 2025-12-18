'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormBuilder } from '@/lib/context/FormBuilderContext';
import { FieldRenderer } from './fields/FieldRenderer';

type DeviceMode = 'desktop' | 'mobile';

export function FormPreview() {
  const { state } = useFormBuilder();
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const { form } = state;
  const styling = form.styling;

  // Get fields for current page (or all fields for inline mode)
  const currentPage = form.mode === 'wizard'
    ? form.pages[currentPageIndex]
    : form.pages[0];

  const fields = currentPage?.fieldIds
    .map((id) => form.fields[id])
    .filter(Boolean) || [];

  const totalPages = form.pages.length;

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  // Dynamic styling based on form settings
  const previewStyles = {
    '--form-primary': styling.primaryColor,
    '--form-radius-sm': '8px',
    '--form-radius-md': '12px',
    '--form-radius-lg': '16px',
    '--form-radius-xl': '24px',
    '--form-radius': `var(--form-radius-${styling.fieldRadius})`,
  } as React.CSSProperties;

  const spacingClasses = {
    compact: 'space-y-2',
    normal: 'space-y-4',
    relaxed: 'space-y-6',
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-glass-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">Preview</h2>
        <div className="flex items-center gap-1 p-1 bg-bg-tertiary rounded-lg">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              deviceMode === 'desktop'
                ? 'bg-bg-secondary text-mint shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            )}
            title="Desktop preview"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              deviceMode === 'mobile'
                ? 'bg-bg-secondary text-mint shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            )}
            title="Mobile preview"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div
          className={cn(
            'mx-auto transition-all duration-300',
            deviceMode === 'mobile' ? 'max-w-[320px]' : 'max-w-full'
          )}
        >
          <motion.div
            layout
            style={previewStyles}
            className={cn(
              'rounded-xl p-6',
              styling.useGlassEffect
                ? 'glass-card'
                : 'bg-bg-secondary border border-glass-border'
            )}
          >
            {/* Form Title */}
            {form.name && form.name !== 'Untitled Form' && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-text-primary">
                  {form.name}
                </h3>
                {form.description && (
                  <p className="text-sm text-text-secondary mt-1">
                    {form.description}
                  </p>
                )}
              </div>
            )}

            {/* Progress Bar (Wizard Mode) */}
            {form.mode === 'wizard' && styling.showProgressBar && totalPages > 1 && (
              <div className="mb-6">
                {styling.progressBarStyle === 'steps' && (
                  <div className="flex items-center gap-2">
                    {form.pages.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex-1 h-2 rounded-full transition-colors',
                          index <= currentPageIndex
                            ? 'bg-mint'
                            : 'bg-bg-tertiary'
                        )}
                      />
                    ))}
                  </div>
                )}
                {styling.progressBarStyle === 'bar' && (
                  <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-mint transition-all duration-300 rounded-full"
                      style={{
                        width: `${((currentPageIndex + 1) / totalPages) * 100}%`,
                      }}
                    />
                  </div>
                )}
                {styling.progressBarStyle === 'dots' && (
                  <div className="flex items-center justify-center gap-2">
                    {form.pages.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          'w-2.5 h-2.5 rounded-full transition-colors',
                          index === currentPageIndex
                            ? 'bg-mint'
                            : index < currentPageIndex
                            ? 'bg-mint/50'
                            : 'bg-bg-tertiary'
                        )}
                      />
                    ))}
                  </div>
                )}
                <p className="text-xs text-text-muted text-center mt-2">
                  Step {currentPageIndex + 1} of {totalPages}
                </p>
              </div>
            )}

            {/* Page Title (Wizard Mode) */}
            {form.mode === 'wizard' && currentPage && (
              <div className="mb-4">
                <h4 className="text-lg font-medium text-text-primary">
                  {currentPage.title}
                </h4>
                {currentPage.description && (
                  <p className="text-sm text-text-muted mt-0.5">
                    {currentPage.description}
                  </p>
                )}
              </div>
            )}

            {/* Form Fields */}
            {fields.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-text-muted">
                  No fields added yet
                </p>
              </div>
            ) : (
              <div className={cn(spacingClasses[styling.fieldSpacing])}>
                {fields.map((field) => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    isPreview
                    styling={styling}
                  />
                ))}
              </div>
            )}

            {/* Navigation Buttons (Wizard Mode) */}
            {form.mode === 'wizard' && totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-glass-border">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPageIndex === 0}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    currentPageIndex === 0
                      ? 'text-text-muted cursor-not-allowed'
                      : 'text-text-primary hover:bg-bg-tertiary'
                  )}
                >
                  Previous
                </button>
                {currentPageIndex === totalPages - 1 ? (
                  <button
                    className="px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: styling.primaryColor }}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={handleNextPage}
                    className="px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: styling.primaryColor }}
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Wizard Page Navigation */}
      {form.mode === 'wizard' && totalPages > 1 && (
        <div className="px-4 py-2 border-t border-glass-border">
          <div className="flex items-center justify-center gap-2">
            {form.pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => setCurrentPageIndex(index)}
                className={cn(
                  'w-8 h-8 rounded-full text-xs font-medium transition-colors',
                  currentPageIndex === index
                    ? 'bg-mint text-white'
                    : 'bg-bg-tertiary text-text-muted hover:text-text-primary'
                )}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
