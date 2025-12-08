'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  LayoutGrid,
  List,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown';
import { GlassCard } from '@/components/ui/GlassCard';
import { mockStudies } from '@/lib/mock-data/studies';
import { mockUsers } from '@/lib/mock-data/users';
import type { ReferralStatus } from '@/lib/types';
import { statusConfigs } from '@/lib/types';

export interface FilterState {
  search: string;
  statuses: ReferralStatus[];
  studyIds: string[];
  assignedTo: string[];
  sortBy: 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'last_contacted';
}

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalCount: number;
  filteredCount: number;
}

const studyOptions: DropdownOption[] = mockStudies.map((study) => ({
  value: study.id,
  label: study.name,
}));

const userOptions: DropdownOption[] = [
  { value: 'unassigned', label: 'Unassigned' },
  ...mockUsers.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
  })),
];

const sortOptions: DropdownOption[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'last_contacted', label: 'Last Contacted' },
];

// Group statuses for better organization
const statusGroups = {
  active: ['new', 'attempt_1', 'attempt_2', 'attempt_3', 'attempt_4', 'attempt_5', 'sent_sms'] as ReferralStatus[],
  scheduled: ['appointment_scheduled'] as ReferralStatus[],
  completed: ['signed_icf', 'phone_screen_failed', 'not_interested'] as ReferralStatus[],
};

export function FilterBar({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const hasActiveFilters =
    filters.search ||
    filters.statuses.length > 0 ||
    filters.studyIds.length > 0 ||
    filters.assignedTo.length > 0;

  const handleReset = () => {
    onFiltersChange({
      search: '',
      statuses: [],
      studyIds: [],
      assignedTo: [],
      sortBy: 'newest',
    });
  };

  const toggleStatus = (status: ReferralStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const removeStatus = (status: ReferralStatus) => {
    onFiltersChange({
      ...filters,
      statuses: filters.statuses.filter((s) => s !== status),
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Filter Row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-[280px] max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="
              w-full pl-10 pr-4 py-2.5
              bg-bg-secondary/50 dark:bg-bg-tertiary/50
              border border-glass-border
              rounded-xl
              text-text-primary
              placeholder:text-text-muted
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint
            "
          />
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowStatusPicker(!showStatusPicker)}
            className={`
              flex items-center gap-2 px-4 py-2.5
              bg-bg-secondary/50 dark:bg-bg-tertiary/50
              border border-glass-border
              rounded-xl
              text-text-primary
              transition-all duration-200
              hover:border-mint/50
              ${showStatusPicker ? 'ring-2 ring-mint/50 border-mint' : ''}
              ${filters.statuses.length > 0 ? 'border-mint/30' : ''}
            `}
          >
            <Filter className="w-4 h-4 text-text-muted" />
            <span>Status</span>
            {filters.statuses.length > 0 && (
              <span className="px-1.5 py-0.5 bg-mint/20 text-mint text-xs font-medium rounded-md">
                {filters.statuses.length}
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
                    {/* Active Statuses */}
                    <div>
                      <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Active</p>
                      <div className="flex flex-wrap gap-2">
                        {statusGroups.active.map((status) => {
                          const config = statusConfigs[status];
                          const isSelected = filters.statuses.includes(status);
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

                    {/* Scheduled */}
                    <div>
                      <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Scheduled</p>
                      <div className="flex flex-wrap gap-2">
                        {statusGroups.scheduled.map((status) => {
                          const config = statusConfigs[status];
                          const isSelected = filters.statuses.includes(status);
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

                    {/* Completed/Closed */}
                    <div>
                      <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">Completed</p>
                      <div className="flex flex-wrap gap-2">
                        {statusGroups.completed.map((status) => {
                          const config = statusConfigs[status];
                          const isSelected = filters.statuses.includes(status);
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
                    {filters.statuses.length > 0 && (
                      <button
                        onClick={() => onFiltersChange({ ...filters, statuses: [] })}
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
            options={studyOptions}
            value={filters.studyIds}
            onChange={(value) =>
              onFiltersChange({ ...filters, studyIds: value as string[] })
            }
            placeholder="Study"
            multiple
            searchable
          />
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant={showAdvanced ? 'secondary' : 'ghost'}
          leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="relative"
        >
          More
          {filters.assignedTo.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-mint text-white text-xs rounded-full flex items-center justify-center">
              {filters.assignedTo.length}
            </span>
          )}
        </Button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Sort */}
        <div className="w-40">
          <Dropdown
            options={sortOptions}
            value={filters.sortBy}
            onChange={(value) =>
              onFiltersChange({ ...filters, sortBy: value as FilterState['sortBy'] })
            }
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-bg-tertiary/50 rounded-xl">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Status Pills - Show selected statuses with proper colors */}
      {filters.statuses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-2 flex-wrap"
        >
          <span className="text-xs text-text-muted">Filtering by:</span>
          {filters.statuses.map((status) => {
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
            onClick={() => onFiltersChange({ ...filters, statuses: [] })}
            className="text-xs text-text-muted hover:text-text-primary transition-colors ml-2"
          >
            Clear all
          </button>
        </motion.div>
      )}

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard padding="md" className="mt-2">
              <div className="flex items-end gap-4">
                {/* Assigned To */}
                <div className="w-56">
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Assigned To
                  </label>
                  <Dropdown
                    options={userOptions}
                    value={filters.assignedTo}
                    onChange={(value) =>
                      onFiltersChange({ ...filters, assignedTo: value as string[] })
                    }
                    placeholder="Anyone"
                    multiple
                  />
                </div>

                {/* Reset Button */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    leftIcon={<RotateCcw className="w-4 h-4" />}
                    onClick={handleReset}
                  >
                    Reset All Filters
                  </Button>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>
          Showing <span className="font-medium text-text-primary">{filteredCount}</span>
          {filteredCount !== totalCount && (
            <> of <span className="font-medium text-text-primary">{totalCount}</span></>
          )}{' '}
          referrals
        </span>

        {/* Study Filter Tags */}
        {filters.studyIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-text-muted">Studies:</span>
            <div className="flex gap-1.5">
              {filters.studyIds.map((studyId) => {
                const study = mockStudies.find((s) => s.id === studyId);
                return study ? (
                  <span
                    key={studyId}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg text-xs"
                  >
                    {study.name}
                    <button
                      onClick={() =>
                        onFiltersChange({
                          ...filters,
                          studyIds: filters.studyIds.filter((id) => id !== studyId),
                        })
                      }
                      className="hover:bg-purple-500/30 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
