import type { Appointment } from '@/lib/types';

// Helper to create dates
function todayAt(hours: number, minutes: number = 0): string {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function daysFromNowAt(days: number, hours: number, minutes: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export const mockAppointments: Appointment[] = [
  // Today's appointments
  {
    id: 'appt-001',
    referralId: 'ref-004',
    referralName: 'Robert Martinez',
    studyId: 'study-003',
    studyName: 'RESOLVE-RA',
    scheduledFor: todayAt(10, 0),
    type: 'phone_screen',
    notes: 'First contact - confirmed via text',
    createdAt: daysAgo(2),
  },
  {
    id: 'appt-002',
    referralId: 'ref-015',
    referralName: 'Angela Foster',
    studyId: 'study-001',
    studyName: 'AURORA-T2D',
    scheduledFor: todayAt(14, 0),
    type: 'phone_screen',
    notes: 'Rescheduled from yesterday',
    createdAt: daysAgo(3),
  },
  {
    id: 'appt-003',
    referralId: 'ref-022',
    referralName: 'Thomas Wright',
    studyId: 'study-002',
    studyName: 'CLARITY-AD',
    scheduledFor: todayAt(15, 30),
    type: 'in_person_screen',
    notes: 'Bringing spouse to appointment',
    createdAt: daysAgo(5),
  },

  // Tomorrow
  {
    id: 'appt-004',
    referralId: 'ref-028',
    referralName: 'Karen Mitchell',
    studyId: 'study-001',
    studyName: 'AURORA-T2D',
    scheduledFor: daysFromNowAt(1, 9, 30),
    type: 'phone_screen',
    createdAt: daysAgo(1),
  },
  {
    id: 'appt-005',
    referralId: 'ref-031',
    referralName: 'Steven Clark',
    studyId: 'study-004',
    studyName: 'BEACON-CKD',
    scheduledFor: daysFromNowAt(1, 11, 0),
    type: 'in_person_screen',
    notes: 'Needs fasting labs',
    createdAt: daysAgo(4),
  },

  // This week
  {
    id: 'appt-006',
    referralId: 'ref-035',
    referralName: 'Nancy Lewis',
    studyId: 'study-003',
    studyName: 'RESOLVE-RA',
    scheduledFor: daysFromNowAt(2, 10, 0),
    type: 'consent_visit',
    notes: 'Ready to sign ICF',
    createdAt: daysAgo(3),
  },
  {
    id: 'appt-007',
    referralId: 'ref-038',
    referralName: 'Richard Young',
    studyId: 'study-001',
    studyName: 'AURORA-T2D',
    scheduledFor: daysFromNowAt(2, 14, 30),
    type: 'phone_screen',
    createdAt: daysAgo(1),
  },
  {
    id: 'appt-008',
    referralId: 'ref-042',
    referralName: 'Betty Hall',
    studyId: 'study-002',
    studyName: 'CLARITY-AD',
    scheduledFor: daysFromNowAt(3, 9, 0),
    type: 'in_person_screen',
    notes: 'Caregiver will accompany',
    createdAt: daysAgo(5),
  },
  {
    id: 'appt-009',
    referralId: 'ref-045',
    referralName: 'George Allen',
    studyId: 'study-004',
    studyName: 'BEACON-CKD',
    scheduledFor: daysFromNowAt(3, 13, 0),
    type: 'consent_visit',
    createdAt: daysAgo(7),
  },
  {
    id: 'appt-010',
    referralId: 'ref-048',
    referralName: 'Dorothy King',
    studyId: 'study-001',
    studyName: 'AURORA-T2D',
    scheduledFor: daysFromNowAt(4, 10, 30),
    type: 'phone_screen',
    createdAt: daysAgo(2),
  },

  // Next week
  {
    id: 'appt-011',
    referralId: 'ref-052',
    referralName: 'Paul Scott',
    studyId: 'study-003',
    studyName: 'RESOLVE-RA',
    scheduledFor: daysFromNowAt(7, 11, 0),
    type: 'in_person_screen',
    createdAt: daysAgo(3),
  },
  {
    id: 'appt-012',
    referralId: 'ref-055',
    referralName: 'Ruth Green',
    studyId: 'study-002',
    studyName: 'CLARITY-AD',
    scheduledFor: daysFromNowAt(8, 14, 0),
    type: 'consent_visit',
    notes: 'Final paperwork review',
    createdAt: daysAgo(6),
  },
];

// Helper functions
export function getTodaysAppointments(): Appointment[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return mockAppointments.filter((appt) => {
    const apptDate = new Date(appt.scheduledFor);
    return apptDate >= today && apptDate < tomorrow;
  }).sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
}

export function getUpcomingAppointments(days: number = 7): Appointment[] {
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  return mockAppointments.filter((appt) => {
    const apptDate = new Date(appt.scheduledFor);
    return apptDate >= now && apptDate <= endDate;
  }).sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
}

export function getAppointmentsByReferral(referralId: string): Appointment[] {
  return mockAppointments.filter((appt) => appt.referralId === referralId);
}

export function getAppointmentCountThisWeek(): number {
  return getUpcomingAppointments(7).length;
}
