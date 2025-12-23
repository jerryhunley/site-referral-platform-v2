'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Phone,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BarChart3,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Logo } from '@/components/ui';
import { useAuth } from '@/lib/context/AuthContext';
import { useProTier } from '@/lib/context/ProTierContext';
import { getUserInitials, getUserFullName } from '@/lib/mock-data/users';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/referrals', label: 'Referrals', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, isPro: true },
  { href: '/working-session', label: 'Working Session', icon: Phone },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isPro } = useProTier();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 88 : 268 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-[calc(100vh-24px)] my-3 ml-3 flex flex-col floating-sidebar z-30"
    >
      {/* Logo Section */}
      <div className="px-4 py-5">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Logo size="md" />
              </motion.div>
            )}
          </AnimatePresence>
          {isCollapsed && (
            <div className="flex justify-center w-full">
              <Logo size="sm" showText={false} />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1.5 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            const showProBadge = item.isPro && !isPro;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-2xl
                    transition-all duration-200 relative
                    ${isActive
                      ? 'glass-nav-active text-mint font-semibold'
                      : 'text-text-secondary hover:bg-white/40 dark:hover:bg-white/10 hover:text-text-primary'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-mint' : ''}`} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium whitespace-nowrap overflow-hidden flex-1"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {/* PRO Badge */}
                  {!isCollapsed && showProBadge && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30"
                    >
                      <Lock className="w-2.5 h-2.5 text-amber-400" />
                      <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                        Pro
                      </span>
                    </motion.span>
                  )}
                  {/* Unlocked sparkle */}
                  {!isCollapsed && item.isPro && isPro && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Sparkles className="w-4 h-4 text-mint" />
                    </motion.span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-1/2 -right-3 w-6 h-6 rounded-full sidebar-collapse-btn flex items-center justify-center z-20"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* User Section */}
      <div className="p-4 mt-auto">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-mint/20 flex items-center justify-center text-mint font-semibold flex-shrink-0">
            {user ? getUserInitials(user) : 'U'}
          </div>

          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="font-medium text-text-primary truncate">
                  {user ? getUserFullName(user) : 'User'}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {user?.email}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={logout}
                className="p-2 rounded-lg text-text-secondary hover:text-error hover:bg-error/10 transition-colors"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
