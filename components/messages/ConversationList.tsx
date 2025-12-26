'use client';

import { MessageSquare } from 'lucide-react';
import type { Conversation } from '@/lib/types';
import { ConversationListItem } from './ConversationListItem';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-12 h-12 rounded-full bg-mint/10 flex items-center justify-center mb-3">
          <MessageSquare className="w-6 h-6 text-mint" />
        </div>
        <p className="text-sm text-text-secondary text-center">No conversations</p>
        <p className="text-xs text-text-muted text-center mt-1">
          Messages with referrals will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {conversations.map((conversation, index) => (
        <ConversationListItem
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedId === conversation.id}
          onSelect={() => onSelect(conversation)}
          animationDelay={index * 0.03}
        />
      ))}
    </div>
  );
}
