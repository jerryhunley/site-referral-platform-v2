'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import {
  Calendar,
  Search,
  Users,
  FileText,
  Inbox,
  CheckCircle,
} from 'lucide-react';

type EmptyStateType =
  | 'no-appointments'
  | 'no-results'
  | 'no-referrals'
  | 'no-notes'
  | 'empty-inbox'
  | 'all-done'
  | 'custom';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const defaultContent: Record<
  Exclude<EmptyStateType, 'custom'>,
  { title: string; description: string; Icon: typeof Calendar }
> = {
  'no-appointments': {
    title: 'No appointments',
    description: 'No appointments scheduled for this period',
    Icon: Calendar,
  },
  'no-results': {
    title: 'No results found',
    description: 'Try adjusting your search or filters',
    Icon: Search,
  },
  'no-referrals': {
    title: 'No referrals yet',
    description: 'New referrals will appear here',
    Icon: Users,
  },
  'no-notes': {
    title: 'No notes',
    description: 'Add a note to keep track of important details',
    Icon: FileText,
  },
  'empty-inbox': {
    title: 'Inbox is empty',
    description: 'No new messages or notifications',
    Icon: Inbox,
  },
  'all-done': {
    title: 'All caught up!',
    description: "Great work! You've completed everything",
    Icon: CheckCircle,
  },
};

export function EmptyState({
  type = 'custom',
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  const content = type !== 'custom' ? defaultContent[type] : null;
  const displayTitle = title || content?.title || 'Nothing here';
  const displayDescription =
    description || content?.description || 'No content to display';
  const IconComponent = content?.Icon;

  return (
    <motion.div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Icon */}
      <motion.div
        className="mb-4 p-4 rounded-2xl bg-bg-tertiary"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
      >
        {icon || (IconComponent && (
          <IconComponent className="w-8 h-8 text-text-muted" />
        ))}
      </motion.div>

      {/* Title */}
      <motion.h3
        className="text-lg font-semibold text-text-primary mb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {displayTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        className="text-sm text-text-secondary max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {displayDescription}
      </motion.p>

      {/* Action */}
      {action && (
        <motion.div
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
