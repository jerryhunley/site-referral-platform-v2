'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Shuffle,
  Filter,
  ChevronDown,
  GripVertical,
  X,
  Play,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Checkbox } from '@/components/ui/Checkbox';
import { Avatar } from '@/components/ui/Avatar';
import { mockReferrals } from '@/lib/mock-data/referrals';
import { mockStudies } from '@/lib/mock-data/studies';
import { statusConfigs, type ReferralStatus, type Referral } from '@/lib/types';

interface LeadSelectorProps {
  onStartSession: (leads: Referral[]) => void;
}

const workableStatuses: ReferralStatus[] = [
  'new',
  'attempt_1',
  'attempt_2',
  'attempt_3',
  'attempt_4',
  'attempt_5',
  'sent_sms',
];

// Group workable statuses for better organization
const statusGroups = {
  new: ['new'] as ReferralStatus[],
  attempts: ['attempt_1', 'attempt_2', 'attempt_3', 'attempt_4', 'attempt_5'] as ReferralStatus[],
  other: ['sent_sms'] as ReferralStatus[],
};

const studyOptions = mockStudies.map((study) => ({
  value: study.id,
  label: study.name,
}));

export function LeadSelector({ onStartSession }: LeadSelectorProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<ReferralStatus[]>(['new', 'attempt_1', 'attempt_2']);
  const [selectedStudies, setSelectedStudies] = useState<string[]>([]);
  const [maxLeads, setMaxLeads] = useState(15);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const toggleStatus = (status: ReferralStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const removeStatus = (status: ReferralStatus) => {
    setSelectedStatuses((prev) => prev.filter((s) => s !== status));
  };

  // Filter available leads
  const availableLeads = useMemo(() => {
    return mockReferrals.filter((referral) => {
      // Only workable statuses
      if (!workableStatuses.includes(referral.status)) return false;

      // Apply status filter
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(referral.status)) {
        return false;
      }

      // Apply study filter
      if (selectedStudies.length > 0 && !selectedStudies.includes(referral.studyId)) {
        return false;
      }

      return true;
    });
  }, [selectedStatuses, selectedStudies]);

  // Get selected leads in order
  const selectedLeads = useMemo(() => {
    return availableLeads.filter((lead) => selectedLeadIds.has(lead.id));
  }, [availableLeads, selectedLeadIds]);

  const handleAutoSelect = () => {
    // Smart prioritization: new first, then by attempt count, then by last contact date
    const sorted = [...availableLeads].sort((a, b) => {
      // New leads first
      if (a.status === 'new' && b.status !== 'new') return -1;
      if (b.status === 'new' && a.status !== 'new') return 1;

      // Then by attempt count (lower first)
      const attemptA = a.status.startsWith('attempt_') ? parseInt(a.status.split('_')[1]) : 0;
      const attemptB = b.status.startsWith('attempt_') ? parseInt(b.status.split('_')[1]) : 0;
      if (attemptA !== attemptB) return attemptA - attemptB;

      // Then by last contact date (older first)
      const dateA = a.lastContactedAt ? new Date(a.lastContactedAt).getTime() : 0;
      const dateB = b.lastContactedAt ? new Date(b.lastContactedAt).getTime() : 0;
      return dateA - dateB;
    });

    const toSelect = sorted.slice(0, maxLeads);
    setSelectedLeadIds(new Set(toSelect.map((lead) => lead.id)));
  };

  const handleToggleLead = (leadId: string) => {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else if (next.size < maxLeads) {
        next.add(leadId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    const toSelect = availableLeads.slice(0, maxLeads);
    setSelectedLeadIds(new Set(toSelect.map((lead) => lead.id)));
  };

  const handleClearAll = () => {
    setSelectedLeadIds(new Set());
  };

  const handleStartSession = () => {
    if (selectedLeads.length > 0) {
      onStartSession(selectedLeads);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary">Start Working Session</h2>
        <p className="text-text-secondary mt-1">
          Select leads to call and work through efficiently
        </p>
      </div>

      {/* Filters */}
      <GlassCard padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Lead Filters
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-wrap items-end gap-4">
                {/* Status Filter Button with Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Status
                  </label>
                  <button
                    onClick={() => setShowStatusPicker(!showStatusPicker)}
                    className={`
                      flex items-center gap-2 px-3 py-2
                      bg-white/40 dark:bg-white/10 backdrop-blur-sm
                      border border-white/50 dark:border-white/10
                      rounded-xl
                      text-sm text-text-primary
                      transition-all duration-200
                      hover:border-mint/50
                      ${showStatusPicker ? 'ring-2 ring-mint/50 border-mint' : ''}
                      ${selectedStatuses.length > 0 ? 'border-mint/30' : ''}
                    `}
                  >
                    <Filter className="w-4 h-4 text-text-muted" />
                    <span>Status</span>
                    {selectedStatuses.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-mint/20 text-mint text-xs font-medium rounded-md">
                        {selectedStatuses.length}
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${showStatusPicker ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Status Picker Dropdown */}
                  <AnimatePresence>
                    {showStatusPicker && (
                      <>
                        {/* Backdrop to close on click outside */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowStatusPicker(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 z-50 w-80 p-4 glass-dropdown"
                        >
                          <div className="space-y-4">
                            {/* New Status */}
                            <div>
                              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">New Leads</p>
                              <div className="flex flex-wrap gap-2">
                                {statusGroups.new.map((status) => {
                                  const config = statusConfigs[status];
                                  const isSelected = selectedStatuses.includes(status);
                                  return (
                                    <button
                                      key={status}
                                      onClick={() => toggleStatus(status)}
                                      className={`
                                        px-3 py-1.5 rounded-lg text-xs font-medium
                                        transition-all duration-150
                                        ${isSelected
                                          ? `${config.bgClass} ${config.textClass} ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-800 ring-current`
                                          : `${config.bgClass} ${config.textClass} opacity-70 hover:opacity-100`
                                        }
                                      `}
                                    >
                                      {config.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Attempt Statuses */}
                            <div>
                              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Attempt History</p>
                              <div className="flex flex-wrap gap-2">
                                {statusGroups.attempts.map((status) => {
                                  const config = statusConfigs[status];
                                  const isSelected = selectedStatuses.includes(status);
                                  return (
                                    <button
                                      key={status}
                                      onClick={() => toggleStatus(status)}
                                      className={`
                                        px-3 py-1.5 rounded-lg text-xs font-medium
                                        transition-all duration-150
                                        ${isSelected
                                          ? `${config.bgClass} ${config.textClass} ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-800 ring-current`
                                          : `${config.bgClass} ${config.textClass} opacity-70 hover:opacity-100`
                                        }
                                      `}
                                    >
                                      {config.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Other Statuses */}
                            <div>
                              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Other</p>
                              <div className="flex flex-wrap gap-2">
                                {statusGroups.other.map((status) => {
                                  const config = statusConfigs[status];
                                  const isSelected = selectedStatuses.includes(status);
                                  return (
                                    <button
                                      key={status}
                                      onClick={() => toggleStatus(status)}
                                      className={`
                                        px-3 py-1.5 rounded-lg text-xs font-medium
                                        transition-all duration-150
                                        ${isSelected
                                          ? `${config.bgClass} ${config.textClass} ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-800 ring-current`
                                          : `${config.bgClass} ${config.textClass} opacity-70 hover:opacity-100`
                                        }
                                      `}
                                    >
                                      {config.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Clear All */}
                            {selectedStatuses.length > 0 && (
                              <button
                                onClick={() => setSelectedStatuses([])}
                                className="text-xs text-text-muted hover:text-text-primary transition-colors"
                              >
                                Clear all status filters
                              </button>
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Study Filter */}
                <div className="w-44">
                  <Dropdown
                    label="Study"
                    options={studyOptions}
                    value={selectedStudies}
                    onChange={(v) => setSelectedStudies(v as string[])}
                    multiple
                    placeholder="All studies"
                  />
                </div>

                {/* Max Leads */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Max Leads
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={maxLeads}
                    onChange={(e) => setMaxLeads(Math.min(50, Math.max(1, parseInt(e.target.value) || 15)))}
                    className="w-20 px-3 py-2 bg-white/40 dark:bg-white/10 backdrop-blur-sm border border-white/50 dark:border-white/10 rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-mint/50"
                  />
                </div>
              </div>

              {/* Selected Status Pills */}
              {selectedStatuses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 flex-wrap pt-2"
                >
                  <span className="text-xs text-text-muted">Filtering by:</span>
                  {selectedStatuses.map((status) => {
                    const config = statusConfigs[status];
                    return (
                      <motion.span
                        key={status}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${config.bgClass} ${config.textClass}`}
                      >
                        {config.label}
                        <button
                          onClick={() => removeStatus(status)}
                          className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    );
                  })}
                  <button
                    onClick={() => setSelectedStatuses([])}
                    className="text-xs text-text-muted hover:text-text-primary transition-colors ml-2"
                  >
                    Clear all
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-glass-border">
          <span className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">{availableLeads.length}</span> leads available
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Shuffle className="w-4 h-4" />}
              onClick={handleAutoSelect}
            >
              Auto-Select Best {maxLeads}
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Lead Selection */}
      <GlassCard padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <Users className="w-5 h-5" />
            Selected Leads ({selectedLeadIds.size}/{maxLeads})
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              Clear
            </Button>
          </div>
        </div>

        {/* Lead List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {availableLeads.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              No leads match your filters
            </div>
          ) : (
            availableLeads.map((lead, index) => {
              const isSelected = selectedLeadIds.has(lead.id);
              const study = mockStudies.find((s) => s.id === lead.studyId);
              const statusConfig = statusConfigs[lead.status];

              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleToggleLead(lead.id)}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                    ${isSelected
                      ? 'bg-mint/10 ring-1 ring-mint/30'
                      : 'glass-hover'
                    }
                  `}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => {}}
                    disabled={!isSelected && selectedLeadIds.size >= maxLeads}
                  />

                  <Avatar
                    firstName={lead.firstName}
                    lastName={lead.lastName}
                    size="sm"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary">
                        {lead.firstName} {lead.lastName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgClass} ${statusConfig.textClass}`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                    <span className="text-sm text-text-muted">{study?.name}</span>
                  </div>

                  {isSelected && (
                    <div className="text-text-muted">
                      <GripVertical className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </GlassCard>

      {/* Start Button */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          size="lg"
          leftIcon={<Play className="w-5 h-5" />}
          onClick={handleStartSession}
          disabled={selectedLeadIds.size === 0}
          className="px-12"
        >
          Start Session with {selectedLeadIds.size} Leads
        </Button>
      </div>
    </div>
  );
}
