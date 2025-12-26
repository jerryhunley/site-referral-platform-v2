'use client';

import { useState, useRef, useEffect } from 'react';
import { Clock, UserPlus, AlertTriangle, AlertTriangleIcon } from 'lucide-react';
import type { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';

interface QuickActionsBarProps {
  conversation: Conversation;
  onSnooze?: (until: string) => void;
  onAssign?: (userId: string) => void;
  onToggleUrgent?: () => void;
}

const snoozeOptions = [
  { value: '1_hour', label: '1 hour' },
  { value: '3_hours', label: '3 hours' },
  { value: 'tomorrow', label: 'Tomorrow morning' },
  { value: 'next_week', label: 'Next week' },
];

const teammates = [
  { id: 'user-001', name: 'Sarah Chen' },
  { id: 'user-002', name: 'Mike Rodriguez' },
  { id: 'user-003', name: 'Jennifer Park' },
];

export function QuickActionsBar({
  conversation,
  onSnooze,
  onAssign,
  onToggleUrgent,
}: QuickActionsBarProps) {
  const [showSnooze, setShowSnooze] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const snoozeRef = useRef<HTMLDivElement>(null);
  const assignRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (snoozeRef.current && !snoozeRef.current.contains(event.target as Node)) {
        setShowSnooze(false);
      }
      if (assignRef.current && !assignRef.current.contains(event.target as Node)) {
        setShowAssign(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSnooze = (value: string) => {
    onSnooze?.(value);
    setShowSnooze(false);
  };

  const handleAssign = (userId: string) => {
    onAssign?.(userId);
    setShowAssign(false);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-t border-white/10">
      {/* Snooze */}
      <div className="relative" ref={snoozeRef}>
        <button
          onClick={() => setShowSnooze(!showSnooze)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
            conversation.snoozeUntil
              ? 'bg-purple-500/20 text-purple-500'
              : 'bg-white/40 dark:bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/60 dark:hover:bg-white/15'
          )}
        >
          <Clock className="w-3.5 h-3.5" />
          {conversation.snoozeUntil ? 'Snoozed' : 'Snooze'}
        </button>

        {showSnooze && (
          <div className="absolute bottom-full left-0 mb-2 w-40 rounded-2xl glass-dropdown py-1.5 z-50 overflow-hidden">
            {snoozeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSnooze(option.value)}
                className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
              >
                {option.label}
              </button>
            ))}
            {conversation.snoozeUntil && (
              <>
                <div className="mx-2 my-1 border-t border-white/10" />
                <button
                  onClick={() => handleSnooze('')}
                  className="w-full px-3 py-2 text-left text-sm text-error hover:bg-error/10 transition-colors"
                >
                  Remove snooze
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Assign */}
      <div className="relative" ref={assignRef}>
        <button
          onClick={() => setShowAssign(!showAssign)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
            conversation.assignedTo
              ? 'bg-vista-blue/20 text-vista-blue'
              : 'bg-white/40 dark:bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/60 dark:hover:bg-white/15'
          )}
        >
          <UserPlus className="w-3.5 h-3.5" />
          {conversation.assignedTo
            ? teammates.find((t) => t.id === conversation.assignedTo)?.name.split(' ')[0] || 'Assigned'
            : 'Assign'}
        </button>

        {showAssign && (
          <div className="absolute bottom-full left-0 mb-2 w-44 rounded-2xl glass-dropdown py-1.5 z-50 overflow-hidden">
            {teammates.map((teammate) => (
              <button
                key={teammate.id}
                onClick={() => handleAssign(teammate.id)}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm transition-colors',
                  conversation.assignedTo === teammate.id
                    ? 'bg-vista-blue/10 text-vista-blue'
                    : 'text-text-primary hover:bg-white/50 dark:hover:bg-white/10'
                )}
              >
                {teammate.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Urgent Toggle */}
      <button
        onClick={onToggleUrgent}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
          conversation.isUrgent
            ? 'bg-warning/20 text-warning'
            : 'bg-white/40 dark:bg-white/10 text-text-secondary hover:text-text-primary hover:bg-white/60 dark:hover:bg-white/15'
        )}
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        {conversation.isUrgent ? 'Urgent' : 'Mark Urgent'}
      </button>
    </div>
  );
}
