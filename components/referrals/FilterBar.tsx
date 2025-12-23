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
import { AdvancedFiltersPanel } from './AdvancedFiltersPanel';
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
  variant?: 'standalone' | 'integrated';
}

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
  variant = 'standalone',
}: FilterBarProps) {
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showStudyPicker, setShowStudyPicker] = useState(false);
  const [statusSearchQuery, setStatusSearchQuery] = useState('');
  const [studySearchQuery, setStudySearchQuery] = useState('');
  const isIntegrated = variant === 'integrated';

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

  const toggleStudy = (studyId: string) => {
    const newStudyIds = filters.studyIds.includes(studyId)
      ? filters.studyIds.filter((id) => id !== studyId)
      : [...filters.studyIds, studyId];
    onFiltersChange({ ...filters, studyIds: newStudyIds });
  };

  const removeStudy = (studyId: string) => {
    onFiltersChange({
      ...filters,
      studyIds: filters.studyIds.filter((id) => id !== studyId),
    });
  };

  // Filter studies by search query
  const filteredStudies = mockStudies.filter((study) =>
    study.name.toLowerCase().includes(studySearchQuery.toLowerCase())
  );

  // Get all statuses as a flat list with their configs
  const allStatuses = [
    ...statusGroups.active,
    ...statusGroups.scheduled,
    ...statusGroups.completed,
  ];

  // Filter statuses by search query
  const filteredStatuses = allStatuses.filter((status) => {
    const config = statusConfigs[status];
    return config.label.toLowerCase().includes(statusSearchQuery.toLowerCase());
  });

  // Render status picker dropdown (shared between variants)
  const renderStatusPicker = () => (
    <AnimatePresence>
      {showStatusPicker && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowStatusPicker(false);
              setStatusSearchQuery('');
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 z-50 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-glass-border rounded-xl shadow-xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-3 border-b border-glass-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search statuses..."
                  value={statusSearchQuery}
                  onChange={(e) => setStatusSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 bg-bg-tertiary/50 border border-glass-border rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-mint/50"
                  autoFocus
                />
              </div>
            </div>

            {/* Status List */}
            <div className="max-h-64 overflow-y-auto p-2">
              {filteredStatuses.length === 0 ? (
                <p className="px-3 py-4 text-sm text-text-muted text-center">No statuses found</p>
              ) : (
                <div className="space-y-0.5">
                  {filteredStatuses.map((status) => {
                    const config = statusConfigs[status];
                    const isSelected = filters.statuses.includes(status);
                    return (
                      <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
                          transition-all duration-150
                          ${isSelected
                            ? 'bg-mint/10'
                            : 'hover:bg-bg-tertiary/50'
                          }
                        `}
                      >
                        {/* Checkbox indicator */}
                        <div className={`
                          w-4 h-4 rounded border-2 flex items-center justify-center shrink-0
                          transition-colors
                          ${isSelected
                            ? 'bg-mint border-mint'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                          }
                        `}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        {/* Status badge */}
                        <span className={`px-2 py-0.5 rounded text-xs font-medium truncate ${config.bgClass} ${config.textClass}`}>
                          {config.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with clear action */}
            {filters.statuses.length > 0 && (
              <div className="p-2 border-t border-glass-border">
                <button
                  onClick={() => {
                    onFiltersChange({ ...filters, statuses: [] });
                    setStatusSearchQuery('');
                  }}
                  className="w-full px-3 py-2 text-xs text-text-muted hover:text-text-primary hover:bg-bg-tertiary/50 rounded-lg transition-colors text-center"
                >
                  Clear all ({filters.statuses.length} selected)
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Render study picker dropdown (shared between variants)
  const renderStudyPicker = () => (
    <AnimatePresence>
      {showStudyPicker && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowStudyPicker(false);
              setStudySearchQuery('');
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 z-50 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-glass-border rounded-xl shadow-xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-3 border-b border-glass-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search studies..."
                  value={studySearchQuery}
                  onChange={(e) => setStudySearchQuery(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 bg-bg-tertiary/50 border border-glass-border rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-mint/50"
                  autoFocus
                />
              </div>
            </div>

            {/* Study List */}
            <div className="max-h-72 overflow-y-auto p-2">
              {filteredStudies.length === 0 ? (
                <p className="px-3 py-4 text-sm text-text-muted text-center">No studies found</p>
              ) : (
                <div className="space-y-0.5">
                  {filteredStudies.map((study) => {
                    const isSelected = filters.studyIds.includes(study.id);
                    return (
                      <button
                        key={study.id}
                        onClick={() => toggleStudy(study.id)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                          transition-all duration-150
                          ${isSelected
                            ? 'bg-mint/10'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                          }
                        `}
                      >
                        {/* Checkbox indicator */}
                        <div className={`
                          w-4 h-4 rounded border-2 flex items-center justify-center shrink-0
                          transition-colors
                          ${isSelected
                            ? 'bg-mint border-mint'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                          }
                        `}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        {/* Study name */}
                        <span className="text-sm text-text-primary truncate">
                          {study.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with clear action */}
            {filters.studyIds.length > 0 && (
              <div className="p-2 border-t border-glass-border">
                <button
                  onClick={() => {
                    onFiltersChange({ ...filters, studyIds: [] });
                    setStudySearchQuery('');
                  }}
                  className="w-full px-3 py-2 text-xs text-text-muted hover:text-text-primary hover:bg-bg-tertiary/50 rounded-lg transition-colors text-center"
                >
                  Clear all ({filters.studyIds.length} selected)
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Integrated variant - compact single row
  if (isIntegrated) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Group */}
          <div className="flex items-center gap-1.5">
            {/* Status Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowStatusPicker(!showStatusPicker)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5
                  bg-white/80 dark:bg-white/20
                  border border-white/90 dark:border-white/25
                  rounded-full
                  text-xs font-medium text-text-primary
                  transition-all duration-200
                  hover:bg-white/90 dark:hover:bg-white/25
                  ${showStatusPicker ? 'ring-1 ring-mint/50' : ''}
                  ${filters.statuses.length > 0 ? 'bg-mint/15 border-mint/40' : ''}
                `}
              >
                <span>Status</span>
                {filters.statuses.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-mint text-white text-[10px] font-semibold rounded-full">
                    {filters.statuses.length}
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${showStatusPicker ? 'rotate-180' : ''}`} />
              </button>
              {renderStatusPicker()}
            </div>

            {/* Study Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowStudyPicker(!showStudyPicker)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5
                  bg-white/80 dark:bg-white/20
                  border border-white/90 dark:border-white/25
                  rounded-full
                  text-xs font-medium text-text-primary
                  transition-all duration-200
                  hover:bg-white/90 dark:hover:bg-white/25
                  ${showStudyPicker ? 'ring-1 ring-mint/50' : ''}
                  ${filters.studyIds.length > 0 ? 'bg-mint/15 border-mint/40' : ''}
                `}
              >
                <span>Study</span>
                {filters.studyIds.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-mint text-white text-[10px] font-semibold rounded-full">
                    {filters.studyIds.length}
                  </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${showStudyPicker ? 'rotate-180' : ''}`} />
              </button>
              {renderStudyPicker()}
            </div>

            {/* More Filters */}
            <button
              onClick={() => setShowAdvancedPanel(true)}
              className={`
                relative flex items-center justify-center p-1.5
                bg-white/80 dark:bg-white/20
                border border-white/90 dark:border-white/25
                rounded-full
                text-text-primary
                transition-all duration-200
                hover:bg-white/90 dark:hover:bg-white/25
                ${filters.assignedTo.length > 0 ? 'bg-mint/15 border-mint/40 text-mint' : ''}
              `}
              title="More filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {filters.assignedTo.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-mint text-white text-[9px] font-semibold rounded-full">
                  {filters.assignedTo.length}
                </span>
              )}
            </button>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2 py-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[200px] max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search referrals..."
              value={filters.search}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              className="
                w-full pl-9 pr-8 py-1.5
                bg-white/80 dark:bg-white/20
                border border-white/90 dark:border-white/25
                rounded-full
                text-xs text-text-primary
                placeholder:text-text-muted
                transition-all duration-200
                hover:bg-white/90 dark:hover:bg-white/25
                focus:outline-none focus:ring-1 focus:ring-mint/50 focus:bg-white/90
              "
            />
            {filters.search && (
              <button
                onClick={() => onFiltersChange({ ...filters, search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions Group */}
          <div className="flex items-center gap-1.5">
            {/* Sort */}
            <div className="w-32">
              <Dropdown
                options={sortOptions}
                value={filters.sortBy}
                onChange={(value) =>
                  onFiltersChange({ ...filters, sortBy: value as FilterState['sortBy'] })
                }
                size="sm"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-0.5 p-0.5 bg-white/80 dark:bg-white/20 rounded-full border border-white/90 dark:border-white/25">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-mint text-white'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'list'
                    ? 'bg-mint text-white'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Pills (compact) */}
        {(filters.statuses.length > 0 || filters.studyIds.length > 0) && (
          <div className="flex items-center gap-2 flex-wrap">
            {filters.statuses.map((status) => {
              const config = statusConfigs[status];
              return (
                <span
                  key={status}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${config.bgClass} ${config.textClass}`}
                >
                  {config.label}
                  <button
                    onClick={() => removeStatus(status)}
                    className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            {filters.studyIds.map((studyId) => {
              const study = mockStudies.find((s) => s.id === studyId);
              return study ? (
                <span
                  key={studyId}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded text-[11px] font-medium"
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
        )}

        {/* Advanced Filters Panel (Slide-out) */}
        <AdvancedFiltersPanel
          isOpen={showAdvancedPanel}
          onClose={() => setShowAdvancedPanel(false)}
        />
      </div>
    );
  }

  // Standalone variant (original layout)
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
              w-full pl-10 pr-4 py-1.5
              bg-bg-secondary/50 dark:bg-bg-tertiary/50
              border border-glass-border
              rounded-xl
              text-sm text-text-primary
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
              flex items-center gap-2 px-3 py-1.5
              bg-bg-secondary/50 dark:bg-bg-tertiary/50
              border border-glass-border
              rounded-xl
              text-sm text-text-primary
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
          {renderStatusPicker()}
        </div>

        {/* Study Filter Button */}
        <div className="relative">
          <button
            onClick={() => setShowStudyPicker(!showStudyPicker)}
            className={`
              flex items-center gap-2 px-3 py-1.5
              bg-bg-secondary/50 dark:bg-bg-tertiary/50
              border border-glass-border
              rounded-xl
              text-sm text-text-primary
              transition-all duration-200
              hover:border-mint/50
              ${showStudyPicker ? 'ring-2 ring-mint/50 border-mint' : ''}
              ${filters.studyIds.length > 0 ? 'border-mint/30' : ''}
            `}
          >
            <span>Study</span>
            {filters.studyIds.length > 0 && (
              <span className="px-1.5 py-0.5 bg-mint/20 text-mint text-xs font-medium rounded-md">
                {filters.studyIds.length}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${showStudyPicker ? 'rotate-180' : ''}`} />
          </button>
          {renderStudyPicker()}
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant={showAdvancedPanel ? 'secondary' : 'ghost'}
          leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          onClick={() => setShowAdvancedPanel(true)}
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
        <div className="flex items-center gap-0.5 p-0.5 bg-white/30 dark:bg-white/10 backdrop-blur-sm rounded-xl">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-mint/80 text-white backdrop-blur-sm shadow-sm'
                : 'text-text-muted glass-hover'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-mint/80 text-white backdrop-blur-sm shadow-sm'
                : 'text-text-muted glass-hover'
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

      {/* Advanced Filters Panel (Slide-out) */}
      <AdvancedFiltersPanel
        isOpen={showAdvancedPanel}
        onClose={() => setShowAdvancedPanel(false)}
      />

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
