'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download, Trash2, RefreshCcw, CheckSquare, MessageSquare, Sparkles, Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { FilterBar, type FilterState } from '@/components/referrals/FilterBar';
import { ReferralCard, ReferralListHeader } from '@/components/referrals/ReferralCard';
import { BulkSMSModal } from '@/components/referrals/BulkSMSModal';
import { mockReferrals } from '@/lib/mock-data/referrals';
import { useProTier } from '@/lib/context/ProTierContext';
import type { Referral } from '@/lib/types';

export default function ReferralsPage() {
  const router = useRouter();
  const { isPro, setShowUpgradeModal } = useProTier();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    statuses: [],
    studyIds: [],
    assignedTo: [],
    sortBy: 'newest',
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkSMS, setShowBulkSMS] = useState(false);

  // Column sorting for list view header
  type SortKey = 'name' | 'study' | 'status' | 'submitted' | 'assignee';
  type SortDirection = 'asc' | 'desc' | null;
  const [columnSort, setColumnSort] = useState<{ key: SortKey | null; direction: SortDirection }>({
    key: null,
    direction: null,
  });

  const handleColumnSort = (key: SortKey) => {
    setColumnSort((prev) => {
      if (prev.key !== key) {
        // New column: start with ascending
        return { key, direction: 'asc' };
      }
      // Same column: cycle through asc → desc → none
      if (prev.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      if (prev.direction === 'desc') {
        return { key: null, direction: null };
      }
      return { key, direction: 'asc' };
    });
  };

  // Filter and sort referrals
  const filteredReferrals = useMemo(() => {
    let result = [...mockReferrals];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.firstName.toLowerCase().includes(searchLower) ||
          r.lastName.toLowerCase().includes(searchLower) ||
          r.email.toLowerCase().includes(searchLower) ||
          r.phone.includes(filters.search)
      );
    }

    // Status filter
    if (filters.statuses.length > 0) {
      result = result.filter((r) => filters.statuses.includes(r.status));
    }

    // Study filter
    if (filters.studyIds.length > 0) {
      result = result.filter((r) => filters.studyIds.includes(r.studyId));
    }

    // Assigned to filter
    if (filters.assignedTo.length > 0) {
      result = result.filter((r) => {
        if (filters.assignedTo.includes('unassigned')) {
          return r.assignedTo === null || filters.assignedTo.includes(r.assignedTo || '');
        }
        return r.assignedTo && filters.assignedTo.includes(r.assignedTo);
      });
    }

    // Sort - use column sorting in list view, otherwise use filter bar sort
    if (viewMode === 'list') {
      const { key, direction } = columnSort;

      if (key && direction) {
        const multiplier = direction === 'asc' ? 1 : -1;
        result.sort((a, b) => {
          switch (key) {
            case 'name':
              return multiplier * `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
            case 'study':
              return multiplier * (a.studyId || '').localeCompare(b.studyId || '');
            case 'status':
              return multiplier * a.status.localeCompare(b.status);
            case 'submitted':
              return multiplier * (new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
            case 'assignee':
              return multiplier * (a.assignedTo || 'zzz').localeCompare(b.assignedTo || 'zzz');
            default:
              return 0;
          }
        });
      } else {
        // Default: newest first when no column sort active
        result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      }
    } else {
      // Grid view uses filter bar sorting
      switch (filters.sortBy) {
        case 'newest':
          result.sort(
            (a, b) =>
              new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
          );
          break;
        case 'oldest':
          result.sort(
            (a, b) =>
              new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
          );
          break;
        case 'name_asc':
          result.sort((a, b) =>
            `${a.firstName} ${a.lastName}`.localeCompare(
              `${b.firstName} ${b.lastName}`
            )
          );
          break;
        case 'name_desc':
          result.sort((a, b) =>
            `${b.firstName} ${b.lastName}`.localeCompare(
              `${a.firstName} ${a.lastName}`
            )
          );
          break;
        case 'last_contacted':
          result.sort((a, b) => {
            if (!a.lastContactedAt) return 1;
            if (!b.lastContactedAt) return -1;
            return (
              new Date(b.lastContactedAt).getTime() -
              new Date(a.lastContactedAt).getTime()
            );
          });
          break;
      }
    }

    return result;
  }, [filters, viewMode, columnSort]);

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredReferrals.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredReferrals.map((r) => r.id)));
    }
  };

  const handleView = (id: string) => {
    router.push(`/referrals/${id}`);
  };

  const handleCall = (id: string) => {
    console.log('Call referral:', id);
  };

  const handleSMS = (id: string) => {
    console.log('SMS referral:', id);
  };

  const handleStatusChange = (id: string) => {
    console.log('Change status:', id);
  };

  const handleBulkStatusChange = () => {
    console.log('Bulk status change:', Array.from(selectedIds));
  };

  const handleBulkExport = () => {
    console.log('Export selected:', Array.from(selectedIds));
  };

  return (
    <div className="space-y-6">
      {/* Header - stays outside the card */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Referrals</h1>
          <p className="text-text-secondary mt-1">
            Manage and track all patient referrals.
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Add Referral
        </Button>
      </div>

      {/* Unified Container Card */}
      <GlassCard variant="elevated" padding="none" className="overflow-hidden">
        {/* Integrated Filter Header */}
        <div className="p-4">
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalCount={mockReferrals.length}
            filteredCount={filteredReferrals.length}
            variant="integrated"
          />
        </div>

        {/* Bulk Actions (conditional) */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="mx-4 mb-4 px-4 py-2 rounded-full backdrop-blur-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    {selectedIds.size === filteredReferrals.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                  <span className="text-xs font-medium text-mint">
                    {selectedIds.size} selected
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleBulkStatusChange}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    Status
                  </button>
                  {/* Bulk SMS - Pro Feature */}
                  <button
                    onClick={() => isPro ? setShowBulkSMS(true) : setShowUpgradeModal(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    SMS
                    {!isPro && (
                      <span className="flex items-center gap-0.5 px-1 py-0.5 rounded-full text-[8px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Lock className="w-2 h-2" />
                        PRO
                      </span>
                    )}
                    {isPro && (
                      <Sparkles className="w-2.5 h-2.5 text-mint" />
                    )}
                  </button>
                  <button
                    onClick={handleBulkExport}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-error hover:bg-error/10 rounded-full transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-1"
                    title="Clear selection"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List/Grid Content */}
        <AnimatePresence mode="wait">
          {filteredReferrals.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-8"
            >
              <EmptyState
                type="no-results"
                title="No referrals found"
                description="Try adjusting your filters or add a new referral."
                action={
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setFilters({
                        search: '',
                        statuses: [],
                        studyIds: [],
                        assignedTo: [],
                        sortBy: 'newest',
                      })
                    }
                  >
                    Clear Filters
                  </Button>
                }
              />
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredReferrals.map((referral, index) => (
                  <ReferralCard
                    key={referral.id}
                    referral={referral}
                    isSelected={selectedIds.has(referral.id)}
                    onSelect={handleSelect}
                    onView={handleView}
                    onCall={handleCall}
                    onSMS={handleSMS}
                    onStatusChange={handleStatusChange}
                    viewMode="grid"
                    delay={index * 0.02}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="px-4 pb-4"
            >
              {/* Inner card container for list view */}
              <div className="glass-card overflow-hidden p-3 outline-none rounded-[32px]">
                <ReferralListHeader
                  sortBy={columnSort.key}
                  sortDirection={columnSort.direction}
                  onSort={handleColumnSort}
                  isAllSelected={selectedIds.size === filteredReferrals.length && filteredReferrals.length > 0}
                  isPartialSelected={selectedIds.size > 0 && selectedIds.size < filteredReferrals.length}
                  onSelectAll={handleSelectAll}
                />
                <div>
                  {filteredReferrals.map((referral, index) => (
                    <ReferralCard
                      key={referral.id}
                      referral={referral}
                      isSelected={selectedIds.has(referral.id)}
                      onSelect={handleSelect}
                      onView={handleView}
                      onCall={handleCall}
                      onSMS={handleSMS}
                      onStatusChange={handleStatusChange}
                      viewMode="list"
                      delay={index * 0.01}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count Footer */}
        {filteredReferrals.length > 0 && (
          <div className="px-4 py-3 border-t border-glass-border text-sm text-text-muted">
            Showing <span className="font-medium text-text-primary">{filteredReferrals.length}</span>
            {filteredReferrals.length !== mockReferrals.length && (
              <> of <span className="font-medium text-text-primary">{mockReferrals.length}</span></>
            )}{' '}
            referrals
          </div>
        )}
      </GlassCard>

      {/* Bulk SMS Modal */}
      <BulkSMSModal
        isOpen={showBulkSMS}
        onClose={() => setShowBulkSMS(false)}
        selectedReferrals={filteredReferrals.filter((r) => selectedIds.has(r.id))}
      />
    </div>
  );
}
