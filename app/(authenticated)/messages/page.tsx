'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  ConversationList,
  ConversationHeader,
  ConversationView,
  MessageInput,
  MessagesFilterBar,
  QuickActionsBar,
} from '@/components/messages';
import type { Conversation, MessagesFilterState } from '@/lib/types';
import {
  getAllConversations,
  getConversationCounts,
} from '@/lib/mock-data/messages';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [filters, setFilters] = useState<MessagesFilterState>({
    search: '',
    view: 'all',
    studyId: null,
    sortBy: 'newest',
    urgentOnly: false,
  });
  const [showConversation, setShowConversation] = useState(false);

  const allConversations = useMemo(() => getAllConversations(), []);
  const counts = useMemo(() => getConversationCounts(), []);

  // Filter conversations based on current filters
  const filteredConversations = useMemo(() => {
    let filtered = allConversations;

    // Filter by view
    if (filters.view === 'unread') {
      filtered = filtered.filter((c) => c.unreadCount > 0 && !c.isArchived);
    } else if (filters.view === 'archived') {
      filtered = filtered.filter((c) => c.isArchived);
    } else {
      filtered = filtered.filter((c) => !c.isArchived);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.referralName.toLowerCase().includes(searchLower) ||
          c.referralPhone.includes(filters.search) ||
          c.studyName.toLowerCase().includes(searchLower)
      );
    }

    // Filter by study
    if (filters.studyId) {
      filtered = filtered.filter((c) => c.studyId === filters.studyId);
    }

    // Filter by urgent only
    if (filters.urgentOnly) {
      filtered = filtered.filter((c) => c.isUrgent);
    }

    // Sort by date
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.lastMessageAt).getTime();
      const dateB = new Date(b.lastMessageAt).getTime();
      return filters.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [allConversations, filters]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowConversation(true);
  };

  const handleBack = () => {
    setShowConversation(false);
  };

  const handleSendMessage = (message: string) => {
    // In a real app, this would send the message via API
    console.log('Sending message:', message);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-semibold text-text-primary">Messages</h1>
        <p className="text-text-secondary mt-1">
          Manage SMS conversations with referrals
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard variant="elevated" padding="none" className="overflow-hidden">
          <div className="flex h-[calc(100vh-13rem)]">
            {/* Conversation List Panel */}
            <div
              className={cn(
                'w-full lg:w-[360px] lg:border-r border-white/10 flex flex-col',
                showConversation ? 'hidden lg:flex' : 'flex'
              )}
            >
              <MessagesFilterBar
                filters={filters}
                onFiltersChange={setFilters}
                counts={counts}
              />
              <div className="flex-1 overflow-y-auto">
                <ConversationList
                  conversations={filteredConversations}
                  selectedId={selectedConversation?.id || null}
                  onSelect={handleSelectConversation}
                />
              </div>
            </div>

            {/* Conversation View Panel */}
            <div
              className={cn(
                'flex-1 flex flex-col',
                !showConversation ? 'hidden lg:flex' : 'flex'
              )}
            >
              {selectedConversation ? (
                <>
                  <ConversationHeader
                    conversation={selectedConversation}
                    onBack={handleBack}
                    showBackButton={showConversation}
                    onArchive={() => {
                      // Toggle archive status
                      console.log('Toggle archive:', selectedConversation.id);
                    }}
                    onMarkRead={() => {
                      // Mark as read
                      console.log('Mark read:', selectedConversation.id);
                    }}
                  />
                  <ConversationView
                    messages={selectedConversation.messages}
                    referralName={selectedConversation.referralName}
                  />
                  <QuickActionsBar
                    conversation={selectedConversation}
                    onSnooze={(until) => {
                      console.log('Snooze until:', until);
                    }}
                    onAssign={(userId) => {
                      console.log('Assign to:', userId);
                    }}
                    onToggleUrgent={() => {
                      console.log('Toggle urgent');
                    }}
                  />
                  <MessageInput onSend={handleSendMessage} />
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-mint/10 flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-mint" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-sm text-text-muted max-w-xs">
                    Choose a conversation from the list to view messages and reply
                  </p>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
