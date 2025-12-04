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
} from 'lucide-react';
import { Logo } from '@/components/ui';
import { useAuth } from '@/lib/context/AuthContext';
import { getUserInitials, getUserFullName } from '@/lib/mock-data/users';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/referrals', label: 'Referrals', icon: Users },
  { href: '/working-session', label: 'Working Session', icon: Phone },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen bg-bg-secondary border-r border-glass-border flex flex-col"
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-glass-border">
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
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200
                    ${isActive
                      ? 'bg-mint/10 text-mint border border-mint/20'
                      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
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
                        className="font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-bg-secondary border border-glass-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* User Section */}
      <div className="p-4 border-t border-glass-border">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center text-mint font-semibold flex-shrink-0">
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
