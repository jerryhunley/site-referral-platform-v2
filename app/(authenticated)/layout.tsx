'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { AuthProvider, useAuth } from '@/lib/context/AuthContext';
import { ProTierProvider, useProTier } from '@/lib/context/ProTierContext';
import { ToastProvider } from '@/components/ui/Toast';
import { AppSidebar, Header } from '@/components/layout';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
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

      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="relative overflow-y-auto">
          <Header />
          <main className="flex-1 px-6 pb-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
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
