'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/types';
import { MessageBubble } from './MessageBubble';

interface ConversationViewProps {
  messages: Message[];
  referralName: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function groupMessagesByDate(messages: Message[]): Map<string, Message[]> {
  const groups = new Map<string, Message[]>();

  // Sort messages by date ascending
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
  );

  sortedMessages.forEach((message) => {
    const dateKey = new Date(message.sentAt).toDateString();
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(message);
  });

  return groups;
}

export function ConversationView({ messages, referralName }: ConversationViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <p className="text-text-secondary">No messages yet</p>
        <p className="text-sm text-text-muted mt-1">
          Send the first message to {referralName}
        </p>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {Array.from(messageGroups.entries()).map(([dateKey, dayMessages]) => (
        <div key={dateKey}>
          {/* Date Separator */}
          <div className="flex items-center justify-center mb-3">
            <span className="px-3 py-1 text-xs text-text-muted bg-white/40 dark:bg-white/10 backdrop-blur-sm rounded-full">
              {formatDate(dayMessages[0].sentAt)}
            </span>
          </div>

          {/* Messages for this date */}
          <div className="space-y-2">
            {dayMessages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                animationDelay={index * 0.02}
              />
            ))}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
