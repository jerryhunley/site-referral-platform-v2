'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  User,
  FileText,
  Calendar,
  Settings,
  Command,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { mockReferrals } from '@/lib/mock-data/referrals';
import { mockStudies } from '@/lib/mock-data/studies';
import { Avatar } from '@/components/ui/Avatar';

interface SearchResult {
  id: string;
  type: 'referral' | 'study' | 'page';
  title: string;
  subtitle?: string;
  icon?: typeof User;
  href: string;
}

const pageResults: SearchResult[] = [
  { id: 'dashboard', type: 'page', title: 'Dashboard', icon: FileText, href: '/dashboard' },
  { id: 'referrals', type: 'page', title: 'Referrals', icon: User, href: '/referrals' },
  { id: 'working-session', type: 'page', title: 'Working Session', icon: Calendar, href: '/working-session' },
  { id: 'settings', type: 'page', title: 'Settings', icon: Settings, href: '/settings' },
];

export function GlobalSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Handle CMD+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Generate search results
  const results: SearchResult[] = query.trim()
    ? [
        // Referral results
        ...mockReferrals
          .filter(
            (r) =>
              r.firstName.toLowerCase().includes(query.toLowerCase()) ||
              r.lastName.toLowerCase().includes(query.toLowerCase()) ||
              r.email.toLowerCase().includes(query.toLowerCase()) ||
              r.phone.includes(query)
          )
          .slice(0, 5)
          .map((r) => ({
            id: r.id,
            type: 'referral' as const,
            title: `${r.firstName} ${r.lastName}`,
            subtitle: r.email,
            href: `/referrals/${r.id}`,
          })),
        // Study results
        ...mockStudies
          .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 3)
          .map((s) => ({
            id: s.id,
            type: 'study' as const,
            title: s.name,
            subtitle: s.sponsor,
            icon: FileText,
            href: `/referrals?study=${s.id}`,
          })),
        // Page results
        ...pageResults.filter((p) =>
          p.title.toLowerCase().includes(query.toLowerCase())
        ),
      ]
    : [];

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSelect = (result: SearchResult) => {
    // Save to recent searches
    if (query.trim()) {
      const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }

    router.push(result.href);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted bg-white/40 dark:bg-white/10 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-white/15 rounded-xl transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Search...</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs bg-white/50 dark:bg-white/10 rounded">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl"
            >
              <div className="mx-4 glass-panel rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-glass-border">
                  <Search className="w-5 h-5 text-text-muted" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search referrals, studies, pages..."
                    className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted focus:outline-none"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      className="p-1 text-text-muted hover:text-text-primary"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Results */}
                <div className="max-h-[400px] overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="p-2">
                      {results.map((result, index) => (
                        <button
                          key={result.id}
                          onClick={() => handleSelect(result)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                            index === selectedIndex
                              ? 'bg-mint/10'
                              : 'glass-hover'
                          }`}
                        >
                          {result.type === 'referral' ? (
                            <Avatar
                              firstName={result.title.split(' ')[0]}
                              lastName={result.title.split(' ')[1]}
                              size="sm"
                            />
                          ) : result.icon ? (
                            <div className="p-2 rounded-lg bg-white/40 dark:bg-white/10 backdrop-blur-sm">
                              <result.icon className="w-4 h-4 text-text-muted" />
                            </div>
                          ) : null}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-text-primary truncate">
                              {result.title}
                            </p>
                            {result.subtitle && (
                              <p className="text-sm text-text-muted truncate">
                                {result.subtitle}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-text-muted">
                            <span className="px-2 py-0.5 rounded bg-white/40 dark:bg-white/10 backdrop-blur-sm capitalize">
                              {result.type}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : query ? (
                    <div className="p-8 text-center text-text-muted">
                      No results found for "{query}"
                    </div>
                  ) : recentSearches.length > 0 ? (
                    <div className="p-4">
                      <p className="text-xs font-medium text-text-muted uppercase mb-2">
                        Recent Searches
                      </p>
                      <div className="space-y-1">
                        {recentSearches.map((search, i) => (
                          <button
                            key={i}
                            onClick={() => setQuery(search)}
                            className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-text-secondary glass-hover transition-colors"
                          >
                            <Clock className="w-4 h-4 text-text-muted" />
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-text-muted">
                      Start typing to search...
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-glass-border text-xs text-text-muted">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white/40 dark:bg-white/10 rounded">↵</kbd>
                      to select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white/40 dark:bg-white/10 rounded">↑</kbd>
                      <kbd className="px-1.5 py-0.5 bg-white/40 dark:bg-white/10 rounded">↓</kbd>
                      to navigate
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/40 dark:bg-white/10 rounded">esc</kbd>
                    to close
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
