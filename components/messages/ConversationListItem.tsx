'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onSelect: () => void;
  animationDelay?: number;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ConversationListItem({
  conversation,
  isSelected,
  onSelect,
  animationDelay = 0,
}: ConversationListItemProps) {
  const hasUnread = conversation.unreadCount > 0;

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: animationDelay }}
      onClick={onSelect}
      className={cn(
        'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all',
        'hover:bg-white/50 dark:hover:bg-white/5',
        isSelected && 'bg-mint/10 ring-1 ring-mint/30',
        hasUnread && !isSelected && 'bg-white/30 dark:bg-white/5'
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
            hasUnread
              ? 'bg-mint/20 text-mint'
              : 'bg-white/60 dark:bg-white/10 text-text-secondary'
          )}
        >
          {getInitials(conversation.referralName)}
        </div>
        {conversation.isUrgent && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-warning flex items-center justify-center">
            <AlertTriangle className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              'text-sm truncate',
              hasUnread ? 'font-semibold text-text-primary' : 'font-medium text-text-primary'
            )}
          >
            {conversation.referralName}
          </span>
          <span className="text-xs text-text-muted shrink-0">
            {formatRelativeTime(conversation.lastMessageAt)}
          </span>
        </div>
        <p className="text-xs text-text-muted truncate mt-0.5">{conversation.studyName}</p>
        <p
          className={cn(
            'text-sm truncate mt-1',
            hasUnread ? 'text-text-primary font-medium' : 'text-text-secondary'
          )}
        >
          {conversation.lastMessageDirection === 'outbound' && (
            <span className="text-text-muted">You: </span>
          )}
          {conversation.lastMessagePreview}
        </p>
      </div>

      {/* Unread Badge */}
      {hasUnread && (
        <div className="shrink-0 mt-1">
          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-mint text-white text-xs font-medium">
            {conversation.unreadCount}
          </span>
        </div>
      )}
    </motion.button>
  );
}
