'use client';

import { Search, X } from 'lucide-react';
import type { MessagesFilterState } from '@/lib/types';
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

export function MessagesFilterBar({
  filters,
  onFiltersChange,
  counts,
}: MessagesFilterBarProps) {
  const getCount = (view: 'all' | 'unread' | 'archived') => {
    return counts[view];
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

      {/* Search */}
      <div className="relative">
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
    </div>
  );
}
