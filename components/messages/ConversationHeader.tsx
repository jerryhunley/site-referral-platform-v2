'use client';

import { ArrowLeft, Archive, ArchiveRestore, ExternalLink, MoreHorizontal } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ConversationHeaderProps {
  conversation: Conversation;
  onBack?: () => void;
  onArchive?: () => void;
  onMarkRead?: () => void;
  showBackButton?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ConversationHeader({
  conversation,
  onBack,
  onArchive,
  onMarkRead,
  showBackButton = false,
}: ConversationHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
      {showBackButton && (
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/10 transition-colors lg:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {/* Avatar */}
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0',
          'bg-mint/20 text-mint'
        )}
      >
        {getInitials(conversation.referralName)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-text-primary truncate">
            {conversation.referralName}
          </h3>
          <a
            href={`/referrals?id=${conversation.referralId}`}
            className="p-1 rounded text-text-muted hover:text-mint transition-colors"
            title="View referral"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>{conversation.referralPhone}</span>
          <span className="text-text-muted/50">•</span>
          <span>{conversation.studyName}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-40 rounded-2xl glass-dropdown py-1.5 z-50 overflow-hidden">
            {conversation.unreadCount > 0 && (
              <button
                onClick={() => {
                  onMarkRead?.();
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-white/50 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                Mark as read
              </button>
            )}
            <button
              onClick={() => {
                onArchive?.();
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-white/50 dark:hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              {conversation.isArchived ? (
                <>
                  <ArchiveRestore className="w-4 h-4" />
                  Unarchive
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4" />
                  Archive
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
