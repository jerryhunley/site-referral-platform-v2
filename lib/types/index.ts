// ========================================
// Site Referral Platform - TypeScript Types
// ========================================

export type ReferralStatus =
  | 'new'
  | 'attempt_1'
  | 'attempt_2'
  | 'attempt_3'
  | 'attempt_4'
  | 'attempt_5'
  | 'sent_sms'
  | 'appointment_scheduled'
  | 'phone_screen_failed'
  | 'not_interested'
  | 'signed_icf';

export interface Referral {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  submittedAt: string;
  source: string;
  studyId: string;
  status: ReferralStatus;
  assignedTo: string | null;
  lastContactedAt: string | null;
  appointmentDate: string | null;
  notes: Note[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  referralId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Message {
  id: string;
  referralId: string;
  direction: 'inbound' | 'outbound';
  content: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface Study {
  id: string;
  name: string;
  protocolNumber: string;
  sponsor: string;
  indication: string;
  status: 'active' | 'paused' | 'completed';
  enrollmentGoal: number;
  currentEnrollment: number;
  siteId: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'coordinator';
  siteId: string;
  avatar?: string | null;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  studies: string[];
}

export interface Appointment {
  id: string;
  referralId: string;
  referralName: string;
  studyId: string;
  studyName: string;
  scheduledFor: string;
  type: 'phone_screen' | 'in_person_screen' | 'consent_visit';
  notes?: string;
  createdAt: string;
}

export interface WorkingSession {
  id: string;
  userId: string;
  startedAt: string;
  endedAt: string | null;
  referralIds: string[];
  completedCalls: number;
  statusUpdates: number;
  appointmentsScheduled: number;
}

export interface DailyDigest {
  newReferrals: number;
  pendingFollowUps: number;
  appointmentsToday: Appointment[];
  overdueStatuses: number;
  conversionRate: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'status_change' | 'note_added' | 'sms_sent' | 'appointment_scheduled';
  referralId: string;
  referralName: string;
  description: string;
  timestamp: string;
  userId: string;
}

export interface Conversation {
  id: string;
  referralId: string;
  referralName: string;
  referralPhone: string;
  studyId: string;
  studyName: string;
  messages: Message[];
  lastMessageAt: string;
  lastMessagePreview: string;
  lastMessageDirection: 'inbound' | 'outbound';
  unreadCount: number;
  isArchived: boolean;
  isUrgent: boolean;
  snoozeUntil: string | null;
  assignedTo: string | null;
}

export interface MessagesFilterState {
  search: string;
  view: 'all' | 'unread' | 'archived';
  studyId: string | null;
  sortBy: 'newest' | 'oldest';
  urgentOnly: boolean;
}

// Status configuration for badges
export interface StatusConfig {
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
  icon?: string;
}

export const statusConfigs: Record<ReferralStatus, StatusConfig> = {
  new: {
    label: 'New',
    color: 'mint',
    bgClass: 'status-new',
    textClass: '',
  },
  attempt_1: {
    label: 'Attempt 1',
    color: 'amber',
    bgClass: 'status-attempt-1',
    textClass: '',
  },
  attempt_2: {
    label: 'Attempt 2',
    color: 'amber',
    bgClass: 'status-attempt-2',
    textClass: '',
  },
  attempt_3: {
    label: 'Attempt 3',
    color: 'orange',
    bgClass: 'status-attempt-3',
    textClass: '',
  },
  attempt_4: {
    label: 'Attempt 4',
    color: 'orange',
    bgClass: 'status-attempt-4',
    textClass: '',
  },
  attempt_5: {
    label: 'Attempt 5',
    color: 'red',
    bgClass: 'status-attempt-5',
    textClass: '',
  },
  sent_sms: {
    label: 'Sent SMS',
    color: 'blue',
    bgClass: 'status-sent-sms',
    textClass: '',
  },
  appointment_scheduled: {
    label: 'Appt Scheduled',
    color: 'purple',
    bgClass: 'status-appointment',
    textClass: '',
  },
  phone_screen_failed: {
    label: 'Screen Failed',
    color: 'gray',
    bgClass: 'status-screen-failed',
    textClass: '',
  },
  not_interested: {
    label: 'Not Interested',
    color: 'gray',
    bgClass: 'status-not-interested',
    textClass: '',
  },
  signed_icf: {
    label: 'Signed ICF',
    color: 'green',
    bgClass: 'status-signed-icf',
    textClass: '',
    icon: 'check-circle',
  },
};
