'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { useFormBuilder } from '@/lib/context/FormBuilderContext';
import { FieldRenderer } from './fields/FieldRenderer';
import { cn } from '@/lib/utils';
import { shouldShowField } from '@/lib/utils/condition-evaluator';

type FormValues = Record<string, unknown>;
type FormErrors = Record<string, string>;

export function FormTestPanel() {
  const { state, toggleTestPanel } = useFormBuilder();
  const { isTestPanelOpen, form } = state;

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

  const currentPage = form.mode === 'wizard'
    ? form.pages[currentPageIndex]
    : form.pages[0];

  const fields = currentPage?.fieldIds
    .map((id) => form.fields[id])
    .filter(Boolean) || [];

  const totalPages = form.pages.length;

  const handleFieldChange = useCallback((fieldId: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error when field is changed
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
  }, []);

  const validateCurrentPage = useCallback((): boolean => {
    const errors: FormErrors = {};

    fields.forEach((field) => {
      // Skip validation for hidden fields
      if (!shouldShowField(field, formValues)) {
        return;
      }

      if (field.required) {
        const value = formValues[field.id];
        if (value === undefined || value === null || value === '' ||
            (Array.isArray(value) && value.length === 0)) {
          errors[field.id] = `${field.label} is required`;
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [fields, formValues]);

  const handleNext = useCallback(() => {
    if (validateCurrentPage() && currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  }, [currentPageIndex, totalPages, validateCurrentPage]);

  const handlePrev = useCallback(() => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  }, [currentPageIndex]);

  const handleSubmit = useCallback(() => {
    if (validateCurrentPage()) {
      // Build submission data with field names
      const submission: FormValues = {};
      Object.entries(formValues).forEach(([fieldId, value]) => {
        const field = form.fields[fieldId];
        if (field) {
          submission[field.name] = value;
        }
      });
      setSubmittedData(submission);
      setIsSubmitted(true);
    }
  }, [form.fields, formValues, validateCurrentPage]);

  const handleReset = useCallback(() => {
    setFormValues({});
    setFormErrors({});
    setCurrentPageIndex(0);
    setIsSubmitted(false);
    setSubmittedData(null);
  }, []);

  const handleClose = useCallback(() => {
    toggleTestPanel();
    handleReset();
  }, [toggleTestPanel, handleReset]);

  return (
    <AnimatePresence>
      {isTestPanelOpen && (
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
            className="fixed right-6 top-6 bottom-6 w-1/2 glass-modal-panel z-9999 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Test Form
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Preview how your form works
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-2 rounded-full text-text-secondary hover:text-text-primary glass-button hover:scale-105 active:scale-95 transition-all"
                  title="Reset form"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full text-text-secondary hover:text-text-primary glass-button hover:scale-105 active:scale-95 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Header divider */}
            <div className="mx-6 dotted-divider" />

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isSubmitted ? (
                // Success State
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-mint/10 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-mint" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Form Submitted!
                  </h3>
                  <p className="text-text-muted mb-6">
                    {form.settings.submitMessage || 'Thank you for your submission!'}
                  </p>

                  {/* Submitted Data */}
                  {submittedData && (
                    <div className="w-full mt-4 p-4 rounded-xl bg-bg-tertiary border border-glass-border text-left">
                      <h4 className="text-sm font-medium text-text-primary mb-2">
                        Submitted Data:
                      </h4>
                      <pre className="text-xs text-text-muted overflow-x-auto">
                        {JSON.stringify(submittedData, null, 2)}
                      </pre>
                    </div>
                  )}

                  <button
                    onClick={handleReset}
                    className="mt-6 px-6 py-2 rounded-xl bg-mint text-white font-medium hover:bg-mint-dark transition-colors"
                  >
                    Test Again
                  </button>
                </div>
              ) : (
                // Form
                <div
                  className={cn(
                    'rounded-xl p-6',
                    form.styling.useGlassEffect
                      ? 'glass-card'
                      : 'bg-bg-tertiary border border-glass-border'
                  )}
                >
                  {/* Progress Bar (Wizard Mode) */}
                  {form.mode === 'wizard' && form.styling.showProgressBar && totalPages > 1 && (
                    <div className="mb-6">
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

                  {/* Fields */}
                  {fields.length === 0 ? (
                    <div className="py-8 text-center">
                      <AlertCircle className="w-12 h-12 text-text-muted mx-auto mb-3" />
                      <p className="text-text-muted">No fields on this page</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-4">
                      {fields.map((field) => (
                        <FieldRenderer
                          key={field.id}
                          field={field}
                          isPreview={false}
                          value={formValues[field.id]}
                          onChange={(value) => handleFieldChange(field.id, value)}
                          error={formErrors[field.id]}
                          styling={form.styling}
                          formValues={formValues}
                        />
                      ))}
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-glass-border">
                    {form.mode === 'wizard' && totalPages > 1 ? (
                      <>
                        <button
                          onClick={handlePrev}
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
                            onClick={handleSubmit}
                            className="px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                            style={{ backgroundColor: form.styling.primaryColor }}
                          >
                            Submit
                          </button>
                        ) : (
                          <button
                            onClick={handleNext}
                            className="px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                            style={{ backgroundColor: form.styling.primaryColor }}
                          >
                            Next
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        className="w-full px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
                        style={{ backgroundColor: form.styling.primaryColor }}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
