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
    <header className="sticky top-0 z-40 px-4 pt-3 pb-6">
      <div className="floating-header h-14 px-5 flex items-center justify-between">
        {/* Left: Page Title */}
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Pro Badge or Upgrade Button */}
          {isPro ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-mint/10 border border-mint/20"
            >
              <Crown className="w-4 h-4 text-mint" />
              <span className="text-sm font-semibold text-mint">PRO</span>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setShowUpgradeModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-yellow-500/15 border border-amber-500/25 hover:from-amber-500/25 hover:to-yellow-500/25 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Upgrade</span>
            </motion.button>
          )}

          {/* Global Search */}
          <GlobalSearch />

          {/* Notifications */}
          <NotificationsPanel />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Avatar - uses original mint for brand accent */}
          <button
            className="w-8 h-8 rounded-xl bg-mint/15 flex items-center justify-center text-mint font-semibold text-sm hover:bg-mint/25 transition-colors"
            aria-label="User menu"
          >
            {user ? getUserInitials(user) : 'U'}
          </button>
        </div>
      </div>
    </header>
  );
}
