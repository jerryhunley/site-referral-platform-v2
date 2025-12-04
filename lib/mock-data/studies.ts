import type { Study } from '@/lib/types';

export const mockStudies: Study[] = [
  {
    id: 'study-001',
    name: 'AURORA-T2D',
    protocolNumber: 'AUR-2024-001',
    sponsor: 'Novo Nordisk',
    indication: 'Type 2 Diabetes',
    status: 'active',
    enrollmentGoal: 45,
    currentEnrollment: 28,
    siteId: 'site-001',
  },
  {
    id: 'study-002',
    name: 'CLARITY-AD',
    protocolNumber: 'CLR-2024-112',
    sponsor: 'Biogen',
    indication: "Early Alzheimer's Disease",
    status: 'active',
    enrollmentGoal: 30,
    currentEnrollment: 12,
    siteId: 'site-001',
  },
  {
    id: 'study-003',
    name: 'RESOLVE-RA',
    protocolNumber: 'RSV-2023-089',
    sponsor: 'AbbVie',
    indication: 'Rheumatoid Arthritis',
    status: 'active',
    enrollmentGoal: 60,
    currentEnrollment: 41,
    siteId: 'site-001',
  },
  {
    id: 'study-004',
    name: 'BEACON-CKD',
    protocolNumber: 'BCN-2024-045',
    sponsor: 'AstraZeneca',
    indication: 'Chronic Kidney Disease',
    status: 'active',
    enrollmentGoal: 35,
    currentEnrollment: 8,
    siteId: 'site-001',
  },
];

// Helper to get study by ID
export function getStudyById(id: string): Study | undefined {
  return mockStudies.find((study) => study.id === id);
}

// Helper to get enrollment percentage
export function getEnrollmentPercentage(study: Study): number {
  return Math.round((study.currentEnrollment / study.enrollmentGoal) * 100);
}

// Helper to get remaining slots
export function getRemainingSlots(study: Study): number {
  return study.enrollmentGoal - study.currentEnrollment;
}
