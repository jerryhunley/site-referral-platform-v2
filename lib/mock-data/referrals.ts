import type { Referral } from '@/lib/types';

// Helper to generate dates relative to today
function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function hoursAgo(hours: number): string {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

// Minimal set of referrals for Phase 1 (8 referrals covering key scenarios)
// Full dataset of 75-100 referrals will be added in Phase 2
export const mockReferrals: Referral[] = [
  // Scenario 1: Success Story - Signed ICF
  {
    id: 'ref-001',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos@gmail.com',
    phone: '(407) 555-0101',
    dateOfBirth: '1968-03-15',
    submittedAt: daysAgo(21),
    source: 'Facebook',
    studyId: 'study-001',
    status: 'signed_icf',
    assignedTo: 'user-001',
    lastContactedAt: daysAgo(13),
    appointmentDate: null,
    notes: [
      {
        id: 'note-001',
        referralId: 'ref-001',
        authorId: 'user-001',
        authorName: 'Sarah Chen',
        content: 'Patient very interested, husband also has T2D',
        createdAt: daysAgo(20),
      },
      {
        id: 'note-002',
        referralId: 'ref-001',
        authorId: 'user-001',
        authorName: 'Sarah Chen',
        content: 'Prefers morning appointments. Spanish speaker - comfortable in English.',
        createdAt: daysAgo(19),
      },
    ],
    messages: [
      {
        id: 'msg-001',
        referralId: 'ref-001',
        direction: 'outbound',
        content: 'Hi Maria, this is Sarah from Orlando Clinical Research. Thank you for your interest in the AURORA diabetes study! I tried calling but wanted to send a quick text too. Would love to tell you more - what time works best for a quick call?',
        sentAt: daysAgo(20),
        status: 'delivered',
      },
      {
        id: 'msg-002',
        referralId: 'ref-001',
        direction: 'inbound',
        content: "Hi! Yes I'm still interested. What times work?",
        sentAt: daysAgo(20),
        status: 'read',
      },
    ],
    createdAt: daysAgo(21),
    updatedAt: daysAgo(13),
  },

  // Scenario 2: Hot Lead - New referral needing immediate attention
  {
    id: 'ref-002',
    firstName: 'James',
    lastName: 'Thompson',
    email: 'jthompson@yahoo.com',
    phone: '(321) 555-0202',
    dateOfBirth: '1975-07-22',
    submittedAt: hoursAgo(3),
    source: 'Google',
    studyId: 'study-001',
    status: 'new',
    assignedTo: null,
    lastContactedAt: null,
    appointmentDate: null,
    notes: [],
    messages: [],
    createdAt: hoursAgo(3),
    updatedAt: hoursAgo(3),
  },

  // Scenario 3: Another hot lead
  {
    id: 'ref-003',
    firstName: 'Linda',
    lastName: 'Washington',
    email: 'linda.w@gmail.com',
    phone: '(407) 555-0303',
    dateOfBirth: '1962-11-08',
    submittedAt: hoursAgo(18),
    source: 'Facebook',
    studyId: 'study-002',
    status: 'new',
    assignedTo: 'user-001',
    lastContactedAt: null,
    appointmentDate: null,
    notes: [],
    messages: [],
    createdAt: hoursAgo(18),
    updatedAt: hoursAgo(18),
  },

  // Scenario 4: Appointment scheduled for today
  {
    id: 'ref-004',
    firstName: 'Robert',
    lastName: 'Martinez',
    email: 'rmartinez@outlook.com',
    phone: '(352) 555-0404',
    dateOfBirth: '1970-05-30',
    submittedAt: daysAgo(7),
    source: 'Instagram',
    studyId: 'study-003',
    status: 'appointment_scheduled',
    assignedTo: 'user-002',
    lastContactedAt: daysAgo(2),
    appointmentDate: daysFromNow(0),
    notes: [
      {
        id: 'note-003',
        referralId: 'ref-004',
        authorId: 'user-002',
        authorName: 'Mike Rodriguez',
        content: 'Phone screen scheduled for today at 2pm. Patient confirmed.',
        createdAt: daysAgo(2),
      },
    ],
    messages: [],
    createdAt: daysAgo(7),
    updatedAt: daysAgo(2),
  },

  // Scenario 5: The Ghosted - Multiple attempts, no response
  {
    id: 'ref-005',
    firstName: 'Patricia',
    lastName: 'Davis',
    email: 'pdavis@aol.com',
    phone: '(407) 555-0505',
    dateOfBirth: '1965-09-12',
    submittedAt: daysAgo(14),
    source: 'Google',
    studyId: 'study-001',
    status: 'attempt_4',
    assignedTo: 'user-001',
    lastContactedAt: daysAgo(3),
    appointmentDate: null,
    notes: [
      {
        id: 'note-004',
        referralId: 'ref-005',
        authorId: 'user-001',
        authorName: 'Sarah Chen',
        content: 'LVM x3. Sent 2 SMS, no response. Trying one more time then marking inactive.',
        createdAt: daysAgo(3),
      },
    ],
    messages: [
      {
        id: 'msg-003',
        referralId: 'ref-005',
        direction: 'outbound',
        content: 'Hi Patricia, following up about the diabetes study. Would still love to chat when you have a moment!',
        sentAt: daysAgo(5),
        status: 'delivered',
      },
    ],
    createdAt: daysAgo(14),
    updatedAt: daysAgo(3),
  },

  // Scenario 6: SMS conversation in progress
  {
    id: 'ref-006',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'mbrown123@gmail.com',
    phone: '(321) 555-0606',
    dateOfBirth: '1972-01-25',
    submittedAt: daysAgo(5),
    source: 'Website',
    studyId: 'study-004',
    status: 'sent_sms',
    assignedTo: 'user-003',
    lastContactedAt: daysAgo(1),
    appointmentDate: null,
    notes: [],
    messages: [
      {
        id: 'msg-004',
        referralId: 'ref-006',
        direction: 'outbound',
        content: 'Hi Michael, thanks for your interest in the BEACON kidney study! Is now a good time to chat?',
        sentAt: daysAgo(2),
        status: 'delivered',
      },
      {
        id: 'msg-005',
        referralId: 'ref-006',
        direction: 'inbound',
        content: "Hi! I'm interested but have some questions about the time commitment first.",
        sentAt: daysAgo(1),
        status: 'read',
      },
      {
        id: 'msg-006',
        referralId: 'ref-006',
        direction: 'outbound',
        content: 'Great question! The study involves monthly visits for 12 months. Each visit is about 2-3 hours. Would you like to schedule a call to discuss more details?',
        sentAt: daysAgo(1),
        status: 'delivered',
      },
    ],
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },

  // Scenario 7: Screen Failed
  {
    id: 'ref-007',
    firstName: 'Susan',
    lastName: 'Miller',
    email: 'susan.miller@gmail.com',
    phone: '(407) 555-0707',
    dateOfBirth: '1980-04-18',
    submittedAt: daysAgo(10),
    source: 'Facebook',
    studyId: 'study-001',
    status: 'phone_screen_failed',
    assignedTo: 'user-001',
    lastContactedAt: daysAgo(6),
    appointmentDate: null,
    notes: [
      {
        id: 'note-005',
        referralId: 'ref-007',
        authorId: 'user-001',
        authorName: 'Sarah Chen',
        content: 'A1C too low - 5.9%, study requires >7.0%. Very nice patient, may qualify for future studies.',
        createdAt: daysAgo(6),
      },
    ],
    messages: [],
    createdAt: daysAgo(10),
    updatedAt: daysAgo(6),
  },

  // Scenario 8: Not Interested
  {
    id: 'ref-008',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'dwilson@hotmail.com',
    phone: '(352) 555-0808',
    dateOfBirth: '1958-12-03',
    submittedAt: daysAgo(8),
    source: 'Referral',
    studyId: 'study-002',
    status: 'not_interested',
    assignedTo: 'user-002',
    lastContactedAt: daysAgo(5),
    appointmentDate: null,
    notes: [
      {
        id: 'note-006',
        referralId: 'ref-008',
        authorId: 'user-002',
        authorName: 'Mike Rodriguez',
        content: 'Spouse not supportive of clinical trial participation. Patient said maybe in the future.',
        createdAt: daysAgo(5),
      },
    ],
    messages: [],
    createdAt: daysAgo(8),
    updatedAt: daysAgo(5),
  },
];

// Helper functions
export function getReferralById(id: string): Referral | undefined {
  return mockReferrals.find((referral) => referral.id === id);
}

export function getReferralsByStatus(status: Referral['status']): Referral[] {
  return mockReferrals.filter((referral) => referral.status === status);
}

export function getReferralsByStudy(studyId: string): Referral[] {
  return mockReferrals.filter((referral) => referral.studyId === studyId);
}

export function getReferralsByAssignee(userId: string | null): Referral[] {
  return mockReferrals.filter((referral) => referral.assignedTo === userId);
}

export function getNewReferralsCount(): number {
  return mockReferrals.filter((referral) => referral.status === 'new').length;
}

export function getReferralFullName(referral: Referral): string {
  return `${referral.firstName} ${referral.lastName}`;
}
