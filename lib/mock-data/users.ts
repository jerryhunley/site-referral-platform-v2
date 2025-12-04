import type { User } from '@/lib/types';

export const mockUsers: User[] = [
  {
    id: 'user-001',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@orlandoclinical.com',
    role: 'coordinator',
    siteId: 'site-001',
    avatar: null,
  },
  {
    id: 'user-002',
    firstName: 'Mike',
    lastName: 'Rodriguez',
    email: 'mike.rodriguez@orlandoclinical.com',
    role: 'coordinator',
    siteId: 'site-001',
    avatar: null,
  },
  {
    id: 'user-003',
    firstName: 'Jennifer',
    lastName: 'Park',
    email: 'jennifer.park@orlandoclinical.com',
    role: 'coordinator',
    siteId: 'site-001',
    avatar: null,
  },
];

// Default logged-in user for demo
export const currentUser = mockUsers[0]; // Sarah Chen

// Helper to get user initials
export function getUserInitials(user: User): string {
  return `${user.firstName[0]}${user.lastName[0]}`;
}

// Helper to get user by ID
export function getUserById(id: string): User | undefined {
  return mockUsers.find((user) => user.id === id);
}

// Helper to get user full name
export function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}
