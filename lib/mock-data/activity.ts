import type { ActivityItem } from '@/lib/types';

// Helper to create timestamps
function hoursAgo(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

function minutesAgo(minutes: number): string {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
}

export const mockActivity: ActivityItem[] = [
  // Recent activity (last few hours)
  {
    id: 'act-001',
    type: 'status_change',
    referralId: 'ref-001',
    referralName: 'Maria Santos',
    description: 'Status changed to Signed ICF',
    timestamp: minutesAgo(15),
    userId: 'user-001',
  },
  {
    id: 'act-002',
    type: 'appointment_scheduled',
    referralId: 'ref-015',
    referralName: 'Angela Foster',
    description: 'Phone screen scheduled for today at 2:00 PM',
    timestamp: minutesAgo(45),
    userId: 'user-001',
  },
  {
    id: 'act-003',
    type: 'sms_sent',
    referralId: 'ref-006',
    referralName: 'Michael Brown',
    description: 'SMS sent regarding study details',
    timestamp: hoursAgo(1),
    userId: 'user-003',
  },
  {
    id: 'act-004',
    type: 'note_added',
    referralId: 'ref-022',
    referralName: 'Thomas Wright',
    description: 'Note added: "Patient confirmed appointment"',
    timestamp: hoursAgo(1.5),
    userId: 'user-002',
  },
  {
    id: 'act-005',
    type: 'status_change',
    referralId: 'ref-028',
    referralName: 'Karen Mitchell',
    description: 'Status changed to Appointment Scheduled',
    timestamp: hoursAgo(2),
    userId: 'user-001',
  },
  {
    id: 'act-006',
    type: 'sms_sent',
    referralId: 'ref-031',
    referralName: 'Steven Clark',
    description: 'Appointment confirmation sent',
    timestamp: hoursAgo(2.5),
    userId: 'user-002',
  },
  {
    id: 'act-007',
    type: 'status_change',
    referralId: 'ref-007',
    referralName: 'Susan Miller',
    description: 'Status changed to Screen Failed',
    timestamp: hoursAgo(3),
    userId: 'user-001',
  },
  {
    id: 'act-008',
    type: 'note_added',
    referralId: 'ref-007',
    referralName: 'Susan Miller',
    description: 'Note added: "A1C too low - 5.9%"',
    timestamp: hoursAgo(3),
    userId: 'user-001',
  },
  {
    id: 'act-009',
    type: 'status_change',
    referralId: 'ref-035',
    referralName: 'Nancy Lewis',
    description: 'Status changed to Appointment Scheduled',
    timestamp: hoursAgo(4),
    userId: 'user-003',
  },
  {
    id: 'act-010',
    type: 'appointment_scheduled',
    referralId: 'ref-035',
    referralName: 'Nancy Lewis',
    description: 'Consent visit scheduled',
    timestamp: hoursAgo(4),
    userId: 'user-003',
  },

  // Earlier today / yesterday
  {
    id: 'act-011',
    type: 'status_change',
    referralId: 'ref-005',
    referralName: 'Patricia Davis',
    description: 'Status changed to Attempt 4',
    timestamp: hoursAgo(8),
    userId: 'user-001',
  },
  {
    id: 'act-012',
    type: 'sms_sent',
    referralId: 'ref-005',
    referralName: 'Patricia Davis',
    description: 'Follow-up SMS sent',
    timestamp: hoursAgo(8),
    userId: 'user-001',
  },
  {
    id: 'act-013',
    type: 'note_added',
    referralId: 'ref-038',
    referralName: 'Richard Young',
    description: 'Note added: "Very interested, works night shift"',
    timestamp: hoursAgo(10),
    userId: 'user-001',
  },
  {
    id: 'act-014',
    type: 'status_change',
    referralId: 'ref-042',
    referralName: 'Betty Hall',
    description: 'Status changed to Appointment Scheduled',
    timestamp: hoursAgo(12),
    userId: 'user-002',
  },
  {
    id: 'act-015',
    type: 'appointment_scheduled',
    referralId: 'ref-042',
    referralName: 'Betty Hall',
    description: 'In-person screening scheduled',
    timestamp: hoursAgo(12),
    userId: 'user-002',
  },
  {
    id: 'act-016',
    type: 'status_change',
    referralId: 'ref-008',
    referralName: 'David Wilson',
    description: 'Status changed to Not Interested',
    timestamp: hoursAgo(20),
    userId: 'user-002',
  },
  {
    id: 'act-017',
    type: 'note_added',
    referralId: 'ref-008',
    referralName: 'David Wilson',
    description: 'Note added: "Spouse not supportive"',
    timestamp: hoursAgo(20),
    userId: 'user-002',
  },
  {
    id: 'act-018',
    type: 'status_change',
    referralId: 'ref-045',
    referralName: 'George Allen',
    description: 'Status changed to Appointment Scheduled',
    timestamp: hoursAgo(24),
    userId: 'user-003',
  },
  {
    id: 'act-019',
    type: 'sms_sent',
    referralId: 'ref-048',
    referralName: 'Dorothy King',
    description: 'Initial outreach SMS sent',
    timestamp: hoursAgo(26),
    userId: 'user-001',
  },
  {
    id: 'act-020',
    type: 'status_change',
    referralId: 'ref-052',
    referralName: 'Paul Scott',
    description: 'Status changed to Sent SMS',
    timestamp: hoursAgo(30),
    userId: 'user-002',
  },

  // 2+ days ago
  {
    id: 'act-021',
    type: 'appointment_scheduled',
    referralId: 'ref-055',
    referralName: 'Ruth Green',
    description: 'Consent visit scheduled for next week',
    timestamp: hoursAgo(48),
    userId: 'user-003',
  },
  {
    id: 'act-022',
    type: 'status_change',
    referralId: 'ref-055',
    referralName: 'Ruth Green',
    description: 'Status changed to Appointment Scheduled',
    timestamp: hoursAgo(48),
    userId: 'user-003',
  },
  {
    id: 'act-023',
    type: 'note_added',
    referralId: 'ref-004',
    referralName: 'Robert Martinez',
    description: 'Note added: "Phone screen confirmed"',
    timestamp: hoursAgo(52),
    userId: 'user-002',
  },
  {
    id: 'act-024',
    type: 'status_change',
    referralId: 'ref-004',
    referralName: 'Robert Martinez',
    description: 'Status changed to Appointment Scheduled',
    timestamp: hoursAgo(72),
    userId: 'user-002',
  },
  {
    id: 'act-025',
    type: 'sms_sent',
    referralId: 'ref-004',
    referralName: 'Robert Martinez',
    description: 'Appointment confirmation sent',
    timestamp: hoursAgo(72),
    userId: 'user-002',
  },
];

// Helper functions
export function getRecentActivity(limit: number = 10): ActivityItem[] {
  return mockActivity
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export function getActivityByType(type: ActivityItem['type']): ActivityItem[] {
  return mockActivity.filter((item) => item.type === type);
}

export function getActivityByReferral(referralId: string): ActivityItem[] {
  return mockActivity.filter((item) => item.referralId === referralId);
}

export function getActivityByUser(userId: string): ActivityItem[] {
  return mockActivity.filter((item) => item.userId === userId);
}

export function getTodaysActivityCount(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return mockActivity.filter((item) => new Date(item.timestamp) >= today).length;
}
