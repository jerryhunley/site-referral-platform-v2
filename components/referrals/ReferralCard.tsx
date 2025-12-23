'use client';

import { motion } from 'framer-motion';
import {
  Phone,
  MessageSquare,
  RefreshCcw,
  Eye,
  Calendar,
  Clock,
  ChevronUp,
  ChevronDown,
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

// Check if referral has unread messages (last message is inbound)
function hasUnreadMessages(referral: Referral): boolean {
  if (!referral.messages || referral.messages.length === 0) return false;
  const lastMessage = referral.messages[referral.messages.length - 1];
  return lastMessage.direction === 'inbound';
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
  const hasUnread = hasUnreadMessages(referral);
  const assignedUser = referral.assignedTo
    ? mockUsers.find((u) => u.id === referral.assignedTo)
    : null;
  const statusConfig = statusConfigs[referral.status];

  const cardContent = (
    <div className="text-left">
      {/* Top row: Checkbox (left) + Status Badge (right) */}
      <div className="flex items-center justify-between mb-3">
        {/* Selection Checkbox */}
        {onSelect ? (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              onChange={(e) => onSelect(referral.id, e.target.checked)}
            />
          </div>
        ) : (
          <div />
        )}

        {/* Status Badge */}
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgClass} ${statusConfig.textClass}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Avatar + Name + Phone */}
      <div className="flex items-center gap-3">
        <Avatar
          firstName={referral.firstName}
          lastName={referral.lastName}
          size="lg"
        />
        <div className="text-left min-w-0 flex-1">
          <h3 className="font-semibold text-text-primary truncate">
            {referral.firstName} {referral.lastName}
          </h3>
          <p className="text-sm text-text-secondary">{formatPhone(referral.phone)}</p>
        </div>
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
        <div className="mt-4 pt-4 border-t card-divider flex items-center justify-between">
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
            className="relative p-2 rounded-lg text-text-secondary hover:text-vista-blue hover:bg-vista-blue/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Send SMS"
          >
            <MessageSquare className="w-4 h-4" />
            {hasUnread && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
                1
              </span>
            )}
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
  );

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 0.15 }}
      >
        <div
          onClick={() => onView?.(referral.id)}
          className={`
            flex items-center gap-4 px-5 py-3.5
            cursor-pointer transition-all duration-150
            border-b border-white/20 dark:border-white/5 last:border-b-0
            ${isSelected
              ? 'bg-mint/10 dark:bg-mint/15'
              : 'hover:bg-white/30 dark:hover:bg-white/5'
            }
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
              className="relative p-2 rounded-lg text-text-secondary hover:text-vista-blue hover:bg-vista-blue/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageSquare className="w-4 h-4" />
              {hasUnread && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
                  1
                </span>
              )}
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
        className={`relative h-full transition-colors ${isSelected ? 'ring-2 ring-mint' : ''}`}
      >
        {cardContent}
      </GlassCard>
    </motion.div>
  );
}

// Sortable column header
type SortKey = 'name' | 'study' | 'status' | 'submitted' | 'assignee';
type SortDirection = 'asc' | 'desc';

interface ReferralListHeaderProps {
  sortBy?: SortKey;
  sortDirection?: SortDirection;
  onSort?: (key: SortKey) => void;
  isAllSelected?: boolean;
  isPartialSelected?: boolean;
  onSelectAll?: () => void;
}

function SortArrow({ active, direction }: { active: boolean; direction: SortDirection }) {
  return (
    <span className={`ml-1 inline-flex flex-col text-[8px] leading-none ${active ? 'text-mint' : 'text-text-muted/50'}`}>
      <ChevronUp className={`w-3 h-3 -mb-1 ${active && direction === 'asc' ? 'text-mint' : ''}`} />
      <ChevronDown className={`w-3 h-3 ${active && direction === 'desc' ? 'text-mint' : ''}`} />
    </span>
  );
}

// Compact list header for list view
export function ReferralListHeader({
  sortBy,
  sortDirection = 'asc',
  onSort,
  isAllSelected = false,
  isPartialSelected = false,
  onSelectAll,
}: ReferralListHeaderProps) {
  const columnClass = "flex items-center gap-0.5 cursor-pointer hover:text-text-primary transition-colors select-none";

  return (
    <div className="relative">
      <div className="flex items-center gap-4 px-5 py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
        {/* Bulk Select Checkbox */}
      <div className="w-5" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isAllSelected}
          indeterminate={isPartialSelected && !isAllSelected}
          onChange={() => onSelectAll?.()}
        />
      </div>
      <div className="w-10" /> {/* Avatar space */}

      {/* Name - Sortable */}
      <div
        className={`flex-1 ${columnClass}`}
        onClick={() => onSort?.('name')}
      >
        <span>Name</span>
        <SortArrow active={sortBy === 'name'} direction={sortBy === 'name' ? sortDirection : 'asc'} />
      </div>

      {/* Study - Sortable */}
      <div
        className={`w-32 hidden lg:flex ${columnClass}`}
        onClick={() => onSort?.('study')}
      >
        <span>Study</span>
        <SortArrow active={sortBy === 'study'} direction={sortBy === 'study' ? sortDirection : 'asc'} />
      </div>

      {/* Status - Sortable */}
      <div
        className={`w-32 ${columnClass}`}
        onClick={() => onSort?.('status')}
      >
        <span>Status</span>
        <SortArrow active={sortBy === 'status'} direction={sortBy === 'status' ? sortDirection : 'asc'} />
      </div>

      {/* Submitted - Sortable */}
      <div
        className={`w-24 hidden md:flex justify-end ${columnClass}`}
        onClick={() => onSort?.('submitted')}
      >
        <span>Submitted</span>
        <SortArrow active={sortBy === 'submitted'} direction={sortBy === 'submitted' ? sortDirection : 'asc'} />
      </div>

      {/* Assignee - Sortable */}
      <div
        className={`w-16 hidden lg:flex justify-center ${columnClass}`}
        onClick={() => onSort?.('assignee')}
      >
        <span>Assignee</span>
        <SortArrow active={sortBy === 'assignee'} direction={sortBy === 'assignee' ? sortDirection : 'asc'} />
      </div>

      <div className="w-24 text-right">Actions</div>
    </div>
    {/* Inset dotted divider */}
    <div className="mx-5 py-2">
      <div
        className="h-px"
        style={{
          backgroundImage: 'radial-gradient(circle, rgb(156 163 175 / 0.5) 1px, transparent 1px)',
          backgroundSize: '8px 1px',
          backgroundRepeat: 'repeat-x',
        }}
      />
    </div>
  </div>
  );
}
