'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { AuthProvider, useAuth } from '@/lib/context/AuthContext';
import { Sidebar, Header } from '@/components/layout';

function AuthenticatedLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // For demo purposes, auto-login if not authenticated
    // In production, this would redirect to login
    if (!isAuthenticated && !user) {
      // Auto-login as Sarah Chen for demo
      // router.push('/');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Sidebar */}
      <div className="relative flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthenticatedLayoutContent>{children}</AuthenticatedLayoutContent>
      </AuthProvider>
    </ThemeProvider>
  );
}
