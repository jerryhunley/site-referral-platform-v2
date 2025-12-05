'use client';

import { motion } from 'framer-motion';
import {
  Phone,
  MessageSquare,
  RefreshCcw,
  Eye,
  Calendar,
  Clock,
  MoreHorizontal,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Checkbox } from '@/components/ui/Checkbox';
import type { Referral, ReferralStatus } from '@/lib/types';
import { statusConfigs } from '@/lib/types';
import { mockStudies } from '@/lib/mock-data/studies';
import { mockUsers } from '@/lib/mock-data/users';

interface ReferralCardProps {
  referral: Referral;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onView?: (id: string) => void;
  onCall?: (id: string) => void;
  onSMS?: (id: string) => void;
  onStatusChange?: (id: string) => void;
  viewMode?: 'grid' | 'list';
  delay?: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function ReferralCard({
  referral,
  isSelected = false,
  onSelect,
  onView,
  onCall,
  onSMS,
  onStatusChange,
  viewMode = 'grid',
  delay = 0,
}: ReferralCardProps) {
  const study = mockStudies.find((s) => s.id === referral.studyId);
  const assignedUser = referral.assignedTo
    ? mockUsers.find((u) => u.id === referral.assignedTo)
    : null;
  const statusConfig = statusConfigs[referral.status];

  const cardContent = (
    <div className="text-left relative">
      {/* Selection Checkbox */}
      {onSelect && (
        <div
          className="absolute top-0 left-0 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={isSelected}
            onChange={(e) => onSelect(referral.id, e.target.checked)}
          />
        </div>
      )}

      {/* Content wrapper with consistent left margin when checkbox present */}
      <div className={onSelect ? 'ml-8' : ''}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              firstName={referral.firstName}
              lastName={referral.lastName}
              size="lg"
            />
            <div className="text-left">
              <h3 className="font-semibold text-text-primary text-left">
                {referral.firstName} {referral.lastName}
              </h3>
              <p className="text-sm text-text-secondary text-left">{formatPhone(referral.phone)}</p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${statusConfig.bgClass} ${statusConfig.textClass}`}
          >
            {statusConfig.label}
          </span>
        </div>

        {/* Study & Info */}
        <div className="mt-4 space-y-2 text-left">
          <div className="flex items-center gap-2 justify-start">
            <span className="text-xs text-text-muted">Study:</span>
            <span className="text-sm font-medium text-text-primary">
              {study?.name || 'Unknown Study'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-text-muted justify-start">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Submitted {formatDate(referral.submittedAt)}
            </span>
            {referral.lastContactedAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Contacted {formatDate(referral.lastContactedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Assigned User */}
        {assignedUser && (
          <div className="mt-3 flex items-center gap-2 justify-start">
            <Avatar
              firstName={assignedUser.firstName}
              lastName={assignedUser.lastName}
              size="xs"
            />
            <span className="text-xs text-text-muted">
              Assigned to {assignedUser.firstName}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-glass-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onCall?.(referral.id);
            }}
            className="p-2 rounded-lg text-text-secondary hover:text-mint hover:bg-mint/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Call"
          >
            <Phone className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onSMS?.(referral.id);
            }}
            className="p-2 rounded-lg text-text-secondary hover:text-vista-blue hover:bg-vista-blue/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Send SMS"
          >
            <MessageSquare className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange?.(referral.id);
            }}
            className="p-2 rounded-lg text-text-secondary hover:text-purple-500 hover:bg-purple-500/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Update Status"
          >
            <RefreshCcw className="w-4 h-4" />
          </motion.button>
        </div>

        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onView?.(referral.id);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-mint hover:bg-mint/10 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Eye className="w-4 h-4" />
          View
        </motion.button>
        </div>
      </div>
    </div>
  );

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.2 }}
        className="relative"
      >
        <div
          onClick={() => onView?.(referral.id)}
          className={`
            flex items-center gap-4 p-4
            bg-bg-primary/50 hover:bg-bg-tertiary/50
            border border-glass-border rounded-xl
            cursor-pointer transition-all duration-200
            ${isSelected ? 'ring-2 ring-mint' : ''}
          `}
        >
          {/* Selection Checkbox */}
          {onSelect && (
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isSelected}
                onChange={(e) => onSelect(referral.id, e.target.checked)}
              />
            </div>
          )}

          {/* Avatar */}
          <Avatar
            firstName={referral.firstName}
            lastName={referral.lastName}
            size="md"
          />

          {/* Name & Phone */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary truncate">
              {referral.firstName} {referral.lastName}
            </h3>
            <p className="text-sm text-text-secondary">
              {formatPhone(referral.phone)}
            </p>
          </div>

          {/* Study */}
          <div className="w-32 hidden lg:block">
            <span className="text-sm text-text-primary truncate block">
              {study?.name}
            </span>
          </div>

          {/* Status */}
          <div className="w-32">
            <span
              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgClass} ${statusConfig.textClass}`}
            >
              {statusConfig.label}
            </span>
          </div>

          {/* Submitted */}
          <div className="w-24 hidden md:block text-right">
            <span className="text-sm text-text-muted">
              {formatDate(referral.submittedAt)}
            </span>
          </div>

          {/* Assigned */}
          <div className="w-16 hidden lg:flex justify-center">
            {assignedUser ? (
              <Avatar
                firstName={assignedUser.firstName}
                lastName={assignedUser.lastName}
                size="sm"
              />
            ) : (
              <span className="text-text-muted">—</span>
            )}
          </div>

          {/* Actions */}
          <div className="w-24 flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            <motion.button
              onClick={() => onCall?.(referral.id)}
              className="p-2 rounded-lg text-text-secondary hover:text-mint hover:bg-mint/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Phone className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => onSMS?.(referral.id)}
              className="p-2 rounded-lg text-text-secondary hover:text-vista-blue hover:bg-vista-blue/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageSquare className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => onView?.(referral.id)}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      onClick={() => onView?.(referral.id)}
      className="cursor-pointer"
    >
      <GlassCard
        padding="lg"
        animate={false}
        className={`relative h-full hover:bg-bg-tertiary/50 transition-colors ${isSelected ? 'ring-2 ring-mint' : ''}`}
      >
        {cardContent}
      </GlassCard>
    </motion.div>
  );
}

// Compact list header for list view
export function ReferralListHeader() {
  return (
    <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-text-muted uppercase tracking-wider">
      <div className="w-5" /> {/* Checkbox space */}
      <div className="w-10" /> {/* Avatar space */}
      <div className="flex-1">Name</div>
      <div className="w-32 hidden lg:block">Study</div>
      <div className="w-32">Status</div>
      <div className="w-24 hidden md:block text-right">Submitted</div>
      <div className="w-16 hidden lg:block text-center">Assignee</div>
      <div className="w-24 text-right">Actions</div>
    </div>
  );
}
