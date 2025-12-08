'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { useProTier } from '@/lib/context/ProTierContext';

interface ProFeatureGateProps {
  children: ReactNode;
  featureName: string;
  description?: string;
  className?: string;
}

export function ProFeatureGate({
  children,
  featureName,
  description,
  className = '',
}: ProFeatureGateProps) {
  const { isPro, setShowUpgradeModal } = useProTier();

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {!isPro ? (
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Blurred content preview */}
            <div className="blur-[6px] pointer-events-none select-none opacity-50 dark:opacity-20">
              {children}
            </div>

            {/* Frosted glass overlay - uses CSS vars for light/dark glass styling */}
            <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-6 backdrop-blur-xl bg-glass-bg border border-glass-border">
              {/* Lock icon with glow */}
              <motion.div
                className="relative mb-4"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0 bg-mint/30 rounded-full blur-xl" />
                <div className="relative p-4 rounded-2xl bg-mint/10 border border-mint/30">
                  <Lock className="w-8 h-8 text-mint" />
                </div>
              </motion.div>

              {/* Pro badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/30 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-mint" />
                <span className="text-xs font-semibold text-mint uppercase tracking-wider">
                  Pro Feature
                </span>
              </div>

              {/* Feature info */}
              <h3 className="text-lg font-semibold text-text-primary mb-1 text-center">
                {featureName}
              </h3>
              {description && (
                <p className="text-sm text-text-secondary mb-4 text-center max-w-xs">
                  {description}
                </p>
              )}

              {/* Upgrade button */}
              <motion.button
                onClick={() => setShowUpgradeModal(true)}
                className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-medium shadow-lg shadow-gray-900/30 hover:bg-gray-800 hover:shadow-gray-900/50 transition-all dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:shadow-white/20 dark:hover:shadow-white/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Upgrade to Pro
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
