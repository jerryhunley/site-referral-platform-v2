'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MessagesFilterState } from '@/lib/types';
import { mockStudies } from '@/lib/mock-data/studies';
import { cn } from '@/lib/utils';

interface MessagesFilterBarProps {
  filters: MessagesFilterState;
  onFiltersChange: (filters: MessagesFilterState) => void;
  counts: { all: number; unread: number; archived: number };
}

const viewOptions = [
  { value: 'all' as const, label: 'All' },
  { value: 'unread' as const, label: 'Unread' },
  { value: 'archived' as const, label: 'Archived' },
];

const sortOptions = [
  { value: 'newest' as const, label: 'Newest First' },
  { value: 'oldest' as const, label: 'Oldest First' },
];

export function MessagesFilterBar({
  filters,
  onFiltersChange,
  counts,
}: MessagesFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCount = (view: 'all' | 'unread' | 'archived') => {
    return counts[view];
  };

  // Count active filters (excluding defaults)
  const activeFilterCount = [
    filters.studyId !== null,
    filters.sortBy !== 'newest',
    filters.urgentOnly,
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({
      ...filters,
      studyId: null,
      sortBy: 'newest',
      urgentOnly: false,
    });
  };

  return (
    <div className="p-3 border-b border-white/10 space-y-3">
      {/* View Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/30 dark:bg-white/5">
        {viewOptions.map((option) => {
          const count = getCount(option.value);
          const isActive = filters.view === option.value;

          return (
            <button
              key={option.value}
              onClick={() =>
                onFiltersChange({ ...filters, view: option.value })
              }
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-white dark:bg-white/15 text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {option.label}
              {count > 0 && (
                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded-full',
                    isActive
                      ? 'bg-mint/20 text-mint'
                      : 'bg-white/50 dark:bg-white/10 text-text-muted'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            placeholder="Search conversations..."
            className="
              w-full pl-9 pr-8 py-2
              bg-white/40 dark:bg-white/10
              border border-white/50 dark:border-white/10
              rounded-xl
              text-sm text-text-primary
              placeholder:text-text-muted
              focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint
            "
          />
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'p-2 rounded-xl transition-all relative',
              showFilters || activeFilterCount > 0
                ? 'bg-mint/20 text-mint'
                : 'bg-white/40 dark:bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/15'
            )}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-medium bg-mint text-white rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Filter Dropdown */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-64 glass-dropdown rounded-2xl p-3 z-50"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                  <span className="text-sm font-medium text-text-primary">Filters</span>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-mint hover:text-mint/80 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Study Filter */}
                <div className="mb-3">
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">
                    Study
                  </label>
                  <select
                    value={filters.studyId || ''}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        studyId: e.target.value || null,
                      })
                    }
                    className="
                      w-full px-3 py-2
                      bg-white/40 dark:bg-white/10
                      border border-white/50 dark:border-white/10
                      rounded-xl
                      text-sm text-text-primary
                      focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint
                      appearance-none
                      cursor-pointer
                    "
                  >
                    <option value="">All Studies</option>
                    {mockStudies.map((study) => (
                      <option key={study.id} value={study.id}>
                        {study.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Order */}
                <div className="mb-3">
                  <label className="text-xs font-medium text-text-muted mb-1.5 block">
                    Sort By
                  </label>
                  <div className="space-y-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          onFiltersChange({ ...filters, sortBy: option.value })
                        }
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                          filters.sortBy === option.value
                            ? 'bg-mint/10 text-mint'
                            : 'text-text-primary hover:bg-white/50 dark:hover:bg-white/10'
                        )}
                      >
                        {option.label}
                        {filters.sortBy === option.value && (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Urgent Only Toggle */}
                <div>
                  <button
                    onClick={() =>
                      onFiltersChange({ ...filters, urgentOnly: !filters.urgentOnly })
                    }
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                      filters.urgentOnly
                        ? 'bg-mint/10 text-mint'
                        : 'text-text-primary hover:bg-white/50 dark:hover:bg-white/10'
                    )}
                  >
                    <span>Urgent Only</span>
                    {filters.urgentOnly && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
