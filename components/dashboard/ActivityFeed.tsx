'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw,
  StickyNote,
  MessageSquare,
  Calendar,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ActivityItem } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data/users';

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  maxItems?: number;
  showFilters?: boolean;
}

type ActivityType = ActivityItem['type'] | 'all';

const activityConfig = {
  status_change: {
    icon: RefreshCcw,
    color: 'text-vista-blue',
    bgColor: 'bg-vista-blue/10',
    label: 'Status Change',
  },
  note_added: {
    icon: StickyNote,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    label: 'Note Added',
  },
  sms_sent: {
    icon: MessageSquare,
    color: 'text-mint',
    bgColor: 'bg-mint/10',
    label: 'SMS Sent',
  },
  appointment_scheduled: {
    icon: Calendar,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    label: 'Appointment',
  },
};

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 172800) return 'yesterday';
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getUserName(userId: string): string {
  const user = mockUsers.find((u) => u.id === userId);
  return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
}

function getUserInitials(userId: string): string {
  const user = mockUsers.find((u) => u.id === userId);
  return user ? `${user.firstName[0]}${user.lastName[0]}` : '??';
}

export function ActivityFeed({
  activities,
  title = 'Recent Activity',
  maxItems = 10,
  showFilters = true,
}: ActivityFeedProps) {
  const [filter, setFilter] = useState<ActivityType>('all');
  const [showAll, setShowAll] = useState(false);

  const filteredActivities = activities
    .filter((a) => filter === 'all' || a.type === filter)
    .slice(0, showAll ? undefined : maxItems);

  const filterOptions: { value: ActivityType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'status_change', label: 'Status' },
    { value: 'note_added', label: 'Notes' },
    { value: 'sms_sent', label: 'SMS' },
    { value: 'appointment_scheduled', label: 'Appts' },
  ];

  return (
    <GlassCard padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {showFilters && (
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-text-muted mr-1" />
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                  filter === option.value
                    ? 'bg-white/50 dark:bg-white/15 text-text-primary backdrop-blur-sm shadow-sm'
                    : 'text-text-secondary glass-hover'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredActivities.length === 0 ? (
        <EmptyState
          type="empty-inbox"
          title="No activity yet"
          description="Actions will appear here as they happen"
        />
      ) : (
        <>
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((activity, index) => {
                const config = activityConfig[activity.type];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={activity.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-start gap-3 p-3 rounded-xl glass-hover group cursor-pointer"
                  >
                    {/* User Avatar */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center text-xs font-medium text-text-secondary">
                      {getUserInitials(activity.userId)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary text-sm">
                          {getUserName(activity.userId)}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${config.bgColor} ${config.color}`}>
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mt-0.5 truncate">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-text-muted">
                          {activity.referralName}
                        </span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Load More */}
          {activities.length > maxItems && !showAll && (
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(true)}
              >
                Show {activities.length - maxItems} more
              </Button>
            </div>
          )}
        </>
      )}
    </GlassCard>
  );
}
