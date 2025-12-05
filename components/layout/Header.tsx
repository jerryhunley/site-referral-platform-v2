'use client';

import { motion } from 'framer-motion';
import { Sparkles, Crown } from 'lucide-react';
import { ThemeToggle } from '@/components/ui';
import { useAuth } from '@/lib/context/AuthContext';
import { useProTier } from '@/lib/context/ProTierContext';
import { getUserInitials } from '@/lib/mock-data/users';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsPanel } from './NotificationsPanel';

interface HeaderProps {
  title?: string;
}

export function Header({ title = 'Dashboard' }: HeaderProps) {
  const { user } = useAuth();
  const { isPro, setShowUpgradeModal } = useProTier();

  return (
    <header className="h-16 bg-bg-secondary/80 backdrop-blur-md border-b border-glass-border px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Page Title */}
      <h1 className="text-xl font-semibold text-text-primary">{title}</h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Pro Badge or Upgrade Button */}
        {isPro ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-mint/20 to-vista-blue/20 border border-mint/30"
          >
            <Crown className="w-4 h-4 text-mint" />
            <span className="text-sm font-semibold text-mint">PRO</span>
          </motion.div>
        ) : (
          <motion.button
            onClick={() => setShowUpgradeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 hover:from-amber-500/30 hover:to-yellow-500/30 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">Upgrade to Pro</span>
          </motion.button>
        )}

        {/* Global Search */}
        <GlobalSearch />

        {/* Notifications */}
        <NotificationsPanel />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Avatar */}
        <button
          className="w-9 h-9 rounded-full bg-mint/20 flex items-center justify-center text-mint font-semibold text-sm hover:bg-mint/30 transition-colors"
          aria-label="User menu"
        >
          {user ? getUserInitials(user) : 'U'}
        </button>
      </div>
    </header>
  );
}
