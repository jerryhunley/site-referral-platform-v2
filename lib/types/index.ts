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
    bgClass: 'bg-mint/20 dark:bg-mint/30',
    textClass: 'text-mint-dark dark:text-mint',
  },
  attempt_1: {
    label: 'Attempt 1',
    color: 'amber',
    bgClass: 'bg-amber-100 dark:bg-amber-900/30',
    textClass: 'text-amber-700 dark:text-amber-400',
  },
  attempt_2: {
    label: 'Attempt 2',
    color: 'amber',
    bgClass: 'bg-amber-200 dark:bg-amber-800/40',
    textClass: 'text-amber-800 dark:text-amber-300',
  },
  attempt_3: {
    label: 'Attempt 3',
    color: 'orange',
    bgClass: 'bg-orange-100 dark:bg-orange-900/30',
    textClass: 'text-orange-700 dark:text-orange-400',
  },
  attempt_4: {
    label: 'Attempt 4',
    color: 'orange',
    bgClass: 'bg-orange-200 dark:bg-orange-800/40',
    textClass: 'text-orange-800 dark:text-orange-300',
  },
  attempt_5: {
    label: 'Attempt 5',
    color: 'red',
    bgClass: 'bg-red-100 dark:bg-red-900/30',
    textClass: 'text-red-700 dark:text-red-400',
  },
  sent_sms: {
    label: 'Sent SMS',
    color: 'blue',
    bgClass: 'bg-vista-blue/20 dark:bg-vista-blue/30',
    textClass: 'text-vista-blue dark:text-sky-400',
  },
  appointment_scheduled: {
    label: 'Appt Scheduled',
    color: 'purple',
    bgClass: 'bg-purple-100 dark:bg-purple-900/30',
    textClass: 'text-purple-700 dark:text-purple-400',
  },
  phone_screen_failed: {
    label: 'Screen Failed',
    color: 'gray',
    bgClass: 'bg-gray-200 dark:bg-gray-700',
    textClass: 'text-gray-600 dark:text-gray-400',
  },
  not_interested: {
    label: 'Not Interested',
    color: 'gray',
    bgClass: 'bg-gray-200 dark:bg-gray-700',
    textClass: 'text-gray-600 dark:text-gray-400',
  },
  signed_icf: {
    label: 'Signed ICF',
    color: 'green',
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    textClass: 'text-green-700 dark:text-green-400',
    icon: 'check-circle',
  },
};
