'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { AuthProvider, useAuth } from '@/lib/context/AuthContext';
import { ProTierProvider, useProTier } from '@/lib/context/ProTierContext';
import { ToastProvider } from '@/components/ui/Toast';
import { Sidebar, Header } from '@/components/layout';
import { UpgradeModal } from '@/components/ui/UpgradeModal';
import { Confetti } from '@/components/ui/Confetti';
import { GradientBackground } from '@/components/ui/GradientBackground';

function AuthenticatedLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const { showUpgradeModal, setShowUpgradeModal, showConfetti } = useProTier();
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
    <>
      {/* Glassmorphic gradient background */}
      <GradientBackground />

      {/* Confetti celebration on Pro upgrade */}
      <Confetti isActive={showConfetti} />

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      <div className="relative flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="relative flex-shrink-0 z-10">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
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
        <ProTierProvider>
          <ToastProvider>
            <AuthenticatedLayoutContent>{children}</AuthenticatedLayoutContent>
          </ToastProvider>
        </ProTierProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
