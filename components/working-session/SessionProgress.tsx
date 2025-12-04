'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  SkipForward,
  Users,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { Referral } from '@/lib/types';
import { statusConfigs } from '@/lib/types';

interface SessionProgressProps {
  currentIndex: number;
  totalLeads: number;
  completedCount: number;
  skippedCount: number;
  elapsedTime: number;
  leads: Referral[];
  completedIds: string[];
  skippedIds: string[];
}

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m ${secs}s`;
}

export function SessionProgress({
  currentIndex,
  totalLeads,
  completedCount,
  skippedCount,
  elapsedTime,
  leads,
  completedIds,
  skippedIds,
}: SessionProgressProps) {
  const [showQueue, setShowQueue] = useState(false);

  const progress = totalLeads > 0 ? ((currentIndex + 1) / totalLeads) * 100 : 0;
  const remainingCount = totalLeads - currentIndex - 1;

  return (
    <GlassCard padding="md">
      {/* Main Progress */}
      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">
              Lead {currentIndex + 1} of {totalLeads}
            </span>
            <span className="text-sm text-text-secondary">
              {Math.round(progress)}% complete
            </span>
          </div>
          <ProgressBar value={progress} />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-mint/10 mb-1">
              <CheckCircle className="w-4 h-4 text-mint" />
            </div>
            <p className="text-lg font-bold text-text-primary">{completedCount}</p>
            <p className="text-xs text-text-muted">Completed</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 mb-1">
              <SkipForward className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-lg font-bold text-text-primary">{skippedCount}</p>
            <p className="text-xs text-text-muted">Skipped</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-vista-blue/10 mb-1">
              <Users className="w-4 h-4 text-vista-blue" />
            </div>
            <p className="text-lg font-bold text-text-primary">{remainingCount}</p>
            <p className="text-xs text-text-muted">Remaining</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/10 mb-1">
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-lg font-bold text-text-primary">{formatTime(elapsedTime)}</p>
            <p className="text-xs text-text-muted">Elapsed</p>
          </div>
        </div>

        {/* Queue Toggle */}
        <button
          onClick={() => setShowQueue(!showQueue)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          {showQueue ? 'Hide' : 'Show'} Queue
          {showQueue ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Collapsible Queue */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-glass-border space-y-2 max-h-[200px] overflow-y-auto">
              {leads.map((lead, index) => {
                const isCompleted = completedIds.includes(lead.id);
                const isSkipped = skippedIds.includes(lead.id);
                const isCurrent = index === currentIndex;
                const statusConfig = statusConfigs[lead.status];

                return (
                  <div
                    key={lead.id}
                    className={`
                      flex items-center gap-3 p-2 rounded-lg
                      ${isCurrent ? 'bg-mint/10 ring-1 ring-mint/30' : ''}
                      ${isCompleted ? 'opacity-50' : ''}
                      ${isSkipped ? 'opacity-30' : ''}
                    `}
                  >
                    <span className="w-6 text-center text-sm text-text-muted">
                      {index + 1}
                    </span>
                    <Avatar
                      firstName={lead.firstName}
                      lastName={lead.lastName}
                      size="xs"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-text-primary truncate">
                        {lead.firstName} {lead.lastName}
                      </span>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-mint" />
                    )}
                    {isSkipped && (
                      <SkipForward className="w-4 h-4 text-amber-500" />
                    )}
                    {isCurrent && (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-mint"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                    )}
                    {!isCompleted && !isSkipped && !isCurrent && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${statusConfig.bgClass} ${statusConfig.textClass}`}
                      >
                        {statusConfig.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
