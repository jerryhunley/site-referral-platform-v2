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
            <div className="blur-sm pointer-events-none select-none opacity-60">
              {children}
            </div>

            {/* Frosted glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 dark:from-bg-primary/80 dark:via-bg-primary/60 dark:to-bg-primary/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6">
              {/* Lock icon with glow */}
              <motion.div
                className="relative mb-4"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0 bg-mint/20 rounded-full blur-xl" />
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-mint/20 to-vista-blue/20 border border-mint/30">
                  <Lock className="w-8 h-8 text-mint" />
                </div>
              </motion.div>

              {/* Pro badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-mint/20 to-vista-blue/20 border border-mint/30 mb-3">
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
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-mint to-mint/80 text-white font-medium shadow-lg shadow-mint/25 hover:shadow-mint/40 transition-shadow"
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
