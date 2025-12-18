'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, ChevronRight, Target, AlertTriangle, Lightbulb, Clock } from 'lucide-react';
import { ProFeatureGate } from '@/components/ui/ProFeatureGate';
import { getRotatingInsights, type AIInsight } from '@/lib/mock-data/insights';

const typeIcons = {
  timing: Clock,
  priority: Target,
  warning: AlertTriangle,
  tip: Lightbulb,
};

// Colors optimized for gradient background (lighter/more visible)
const typeColors = {
  timing: { bg: 'bg-white/20', text: 'text-white', border: 'border-white/30' },
  priority: { bg: 'bg-white/20', text: 'text-white', border: 'border-white/30' },
  warning: { bg: 'bg-amber-300/30', text: 'text-amber-100', border: 'border-amber-200/40' },
  tip: { bg: 'bg-white/20', text: 'text-white', border: 'border-white/30' },
};

function InsightCard({ insight, index }: { insight: AIInsight; index: number }) {
  const Icon = typeIcons[insight.type];
  const colors = typeColors[insight.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ delay: index * 0.05 }}
      className={`p-3 rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-sm transition-all duration-200 cursor-pointer hover:bg-white/30`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white/20">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-white leading-tight">
              {insight.title}
            </p>
            <span className="text-lg flex-shrink-0">{insight.icon}</span>
          </div>
          <p className="text-xs text-white/80 mt-1 line-clamp-2">
            {insight.description}
          </p>
          {insight.actionLabel && (
            <button className="mt-2 text-xs font-medium text-white flex items-center gap-1 hover:underline">
              {insight.actionLabel}
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AIInsightsContent() {
  const [insights, setInsights] = useState<AIInsight[]>(() => getRotatingInsights());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate AI thinking
    setTimeout(() => {
      setInsights(getRotatingInsights());
      setIsRefreshing(false);
    }, 800);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl">
      {/* Deep immersive gradient background */}
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

      {/* Flowing color orbs - larger and more blurred for immersive feel */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-mint/50 dark:bg-mint/70 rounded-full blur-[80px]" />
      <div className="absolute -top-10 left-1/3 w-72 h-72 bg-vista-blue/40 dark:bg-vista-blue/60 rounded-full blur-[100px]" />
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-vista-blue/50 dark:bg-vista-blue/70 rounded-full blur-[90px]" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-teal-400/30 dark:bg-teal-400/50 rounded-full blur-[70px]" />
      <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-purple-500/35 dark:bg-purple-500/55 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-white/15 dark:bg-white/25 rounded-full blur-[60px]" />
      <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-cyan-400/25 dark:bg-cyan-400/45 rounded-full blur-[80px]" />

      {/* Content */}
      <div className="relative p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">AI Insights</h2>
          </div>
          <motion.button
            onClick={handleRefresh}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isRefreshing}
            title="Generate new insights"
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 0.8, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
            >
              <RefreshCw className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={insights.map(i => i.id).join(',')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {insights.map((insight, index) => (
              <InsightCard key={insight.id} insight={insight} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* AI disclaimer */}
        <p className="text-[10px] text-white/60 mt-4 text-center">
          Powered by AI • Insights update based on real-time data
        </p>
      </div>
    </div>
  );
}

export function AIInsights() {
  return (
    <ProFeatureGate
      featureName="AI-Powered Insights"
      description="Smart recommendations for optimal call times, conversion predictions, and actionable tips."
    >
      <AIInsightsContent />
    </ProFeatureGate>
  );
}
