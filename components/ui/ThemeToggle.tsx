'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-xl
        bg-bg-tertiary/50 hover:bg-bg-tertiary
        border border-glass-border
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-mint/50
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {theme === 'light' ? (
          <Sun className="w-5 h-5 text-amber-500" />
        ) : (
          <Moon className="w-5 h-5 text-vista-blue" />
        )}
      </motion.div>
    </motion.button>
  );
}
