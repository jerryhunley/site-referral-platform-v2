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
            className="relative overflow-hidden rounded-2xl shadow-xl"
          >
            {/* Immersive gradient background */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse 200% 150% at 20% -20%, var(--color-mint) 0%, rgba(16, 185, 129, 0.6) 30%, transparent 70%),
                  radial-gradient(ellipse 180% 120% at 80% 120%, rgb(5, 150, 105) 0%, rgba(16, 185, 129, 0.4) 40%, transparent 70%),
                  radial-gradient(ellipse 150% 150% at 110% 30%, var(--color-vista-blue) 0%, rgba(59, 130, 246, 0.3) 40%, transparent 70%),
                  radial-gradient(ellipse 120% 100% at -10% 80%, rgb(147, 51, 234) 0%, rgba(147, 51, 234, 0.2) 30%, transparent 60%),
                  radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                  linear-gradient(160deg, var(--color-mint) 0%, rgb(16, 185, 129) 25%, rgb(20, 184, 166) 50%, var(--color-vista-blue) 75%, rgb(6, 95, 70) 100%)
                `
              }}
            />

            {/* Dark mode saturation boost */}
            <div className="absolute inset-0 bg-black/0 dark:bg-black/20" />

            {/* Flowing color orbs */}
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-mint/50 dark:bg-mint/70 rounded-full blur-[80px]" />
            <div className="absolute -top-10 left-1/3 w-72 h-72 bg-vista-blue/40 dark:bg-vista-blue/60 rounded-full blur-[100px]" />
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-vista-blue/50 dark:bg-vista-blue/70 rounded-full blur-[90px]" />
            <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-purple-500/35 dark:bg-purple-500/55 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-white/15 dark:bg-white/25 rounded-full blur-[60px]" />

            {/* Content overlay */}
            <div className="relative flex flex-col items-center justify-center p-8 min-h-[320px]">
              {/* Lock icon with glow */}
              <motion.div
                className="relative mb-4"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl scale-150" />
                <div className="relative p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              {/* Pro badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Pro Feature
                </span>
              </div>

              {/* Feature info */}
              <h3 className="text-lg font-semibold text-white mb-1 text-center">
                {featureName}
              </h3>
              {description && (
                <p className="text-sm text-white/80 mb-5 text-center max-w-xs">
                  {description}
                </p>
              )}

              {/* Upgrade button - white with black text */}
              <motion.button
                onClick={() => setShowUpgradeModal(true)}
                className="px-5 py-2 rounded-xl bg-white text-black text-sm font-semibold shadow-lg shadow-black/20 hover:bg-white/95 hover:shadow-xl hover:shadow-black/25 transition-all"
                whileHover={{ scale: 1.03, y: -2 }}
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
