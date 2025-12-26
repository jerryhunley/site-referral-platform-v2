import type { Conversation, Message } from '@/lib/types';
import { mockReferrals, getReferralFullName } from './referrals';
import { getStudyById } from './studies';

// Conversation metadata - simulates database fields
const conversationMetadata: Record<string, {
  isArchived: boolean;
  isUrgent: boolean;
  snoozeUntil: string | null;
  assignedTo: string | null;
}> = {
  'ref-001': { isArchived: false, isUrgent: false, snoozeUntil: null, assignedTo: 'user-001' },
  'ref-006': { isArchived: false, isUrgent: true, snoozeUntil: null, assignedTo: 'user-003' },
  'ref-034': { isArchived: false, isUrgent: false, snoozeUntil: null, assignedTo: 'user-001' },
  'ref-005': { isArchived: true, isUrgent: false, snoozeUntil: null, assignedTo: 'user-001' },
};

function countUnreadMessages(messages: Message[]): number {
  if (messages.length === 0) return 0;

  // Sort by date descending
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );

  // Count consecutive inbound messages at the end
  let count = 0;
  for (const msg of sortedMessages) {
    if (msg.direction === 'inbound') {
      count++;
    } else {
      break;
    }
  }
  return count;
}

function getLastMessage(messages: Message[]): Message | null {
  if (messages.length === 0) return null;
  return [...messages].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  )[0];
}

export function getAllConversations(): Conversation[] {
  const conversations: Conversation[] = [];

  mockReferrals.forEach((referral) => {
    // Only include referrals that have messages
    if (!referral.messages || referral.messages.length === 0) return;

    const study = getStudyById(referral.studyId);
    const lastMessage = getLastMessage(referral.messages);
    const metadata = conversationMetadata[referral.id] || {
      isArchived: false,
      isUrgent: false,
      snoozeUntil: null,
      assignedTo: referral.assignedTo,
    };

    if (!lastMessage) return;

    conversations.push({
      id: referral.id,
      referralId: referral.id,
      referralName: getReferralFullName(referral),
      referralPhone: referral.phone,
      studyId: referral.studyId,
      studyName: study?.name || 'Unknown Study',
      messages: referral.messages,
      lastMessageAt: lastMessage.sentAt,
      lastMessagePreview: lastMessage.content.slice(0, 100) + (lastMessage.content.length > 100 ? '...' : ''),
      lastMessageDirection: lastMessage.direction,
      unreadCount: countUnreadMessages(referral.messages),
      isArchived: metadata.isArchived,
      isUrgent: metadata.isUrgent,
      snoozeUntil: metadata.snoozeUntil,
      assignedTo: metadata.assignedTo,
    });
  });

  // Sort by last message date descending
  return conversations.sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
}

export function getConversationById(id: string): Conversation | undefined {
  return getAllConversations().find((conv) => conv.id === id);
}

export function getUnreadConversations(): Conversation[] {
  return getAllConversations().filter((conv) => conv.unreadCount > 0 && !conv.isArchived);
}

export function getArchivedConversations(): Conversation[] {
  return getAllConversations().filter((conv) => conv.isArchived);
}

export function getUnreadCount(): number {
  return getUnreadConversations().reduce((sum, conv) => sum + conv.unreadCount, 0);
}

export function getConversationCounts(): { all: number; unread: number; archived: number } {
  const all = getAllConversations();
  return {
    all: all.filter(c => !c.isArchived).length,
    unread: all.filter(c => c.unreadCount > 0 && !c.isArchived).length,
    archived: all.filter(c => c.isArchived).length,
  };
}
