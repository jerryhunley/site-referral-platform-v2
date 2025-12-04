'use client';

import { Search, Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/ui';
import { useAuth } from '@/lib/context/AuthContext';
import { getUserInitials } from '@/lib/mock-data/users';

interface HeaderProps {
  title?: string;
}

export function Header({ title = 'Dashboard' }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-bg-secondary/80 backdrop-blur-md border-b border-glass-border px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Page Title */}
      <h1 className="text-xl font-semibold text-text-primary">{title}</h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 rounded-xl bg-bg-tertiary/50 border border-glass-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex px-1.5 py-0.5 text-xs text-text-muted bg-bg-tertiary rounded border border-glass-border">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl bg-bg-tertiary/50 border border-glass-border text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-mint text-white text-xs flex items-center justify-center font-medium">
            3
          </span>
        </button>

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
