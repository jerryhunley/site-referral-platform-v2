'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { useQualificationBuilder } from '@/lib/context/QualificationBuilderContext';
import { FormSelector } from './FormSelector';
import { SituationCard } from './SituationCard';
import { SituationPriorityPanel } from './SituationPriorityPanel';
import { cn } from '@/lib/utils';

export function QualificationBuilder() {
  const router = useRouter();
  const {
    state,
    selectForm,
    addSituation,
    save,
    hasUnsavedChanges,
  } = useQualificationBuilder();

  const handleSave = () => {
    save();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className={cn(
              'p-2 rounded-xl transition-colors',
              'hover:bg-white/50 dark:hover:bg-white/10',
              'text-text-secondary hover:text-text-primary'
            )}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Qualification Builder</h1>
            <p className="text-sm text-text-muted">
              {state.selectedForm
                ? `Building qualifications for: ${state.selectedForm.name}`
                : 'Select a form to start building qualifications'}
            </p>
          </div>
        </div>

        {state.selectedForm && (
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={cn(
              'flex items-center gap-2 px-5 py-1.5 text-xs font-medium rounded-full shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all',
              hasUnsavedChanges
                ? 'text-white bg-[linear-gradient(135deg,#36A67E_0%,#2E9B73_50%,#1F7A58_100%)] hover:bg-[linear-gradient(135deg,#4AC498_0%,#36A67E_50%,#2E9B73_100%)]'
                : 'text-text-muted bg-white/30 dark:bg-white/10 cursor-not-allowed hover:scale-100 active:scale-100'
            )}
          >
            <Save className="w-3.5 h-3.5" />
            Save Situations
          </button>
        )}
      </div>

      {/* Form Selector */}
      <div className="px-6 py-4">
        <FormSelector
          selectedFormId={state.selectedFormId}
          onSelectForm={selectForm}
        />
      </div>

      {/* Main Content */}
      {state.selectedForm && state.config ? (
        <div className="flex-1 flex gap-6 px-6 pb-6 min-h-0">
          {/* Left: Situations List */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {state.config.situations.map((situation, index) => (
                <motion.div
                  key={situation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SituationCard situation={situation} index={index} />
                </motion.div>
              ))}
            </div>

            {/* Add Situation Button */}
            <div className="pt-4">
              <button
                onClick={addSituation}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-xs font-medium text-text-primary glass-button rounded-full hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Situation
              </button>
            </div>
          </div>

          {/* Right: Priority Panel */}
          <div className="w-80 shrink-0">
            <SituationPriorityPanel />
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-mint/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-mint"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-text-primary mb-2">
              No Form Selected
            </h2>
            <p className="text-sm text-text-muted">
              Select a form above to start building qualification rules. Each situation defines
              conditions that determine how referrals are qualified.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
