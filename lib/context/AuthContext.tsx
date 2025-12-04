'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@/lib/types';
import { currentUser as defaultUser, mockUsers } from '@/lib/mock-data/users';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate network delay for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock auth - any email/password works
    // Try to find user by email, otherwise use default
    const foundUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    setUser(foundUser || defaultUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
