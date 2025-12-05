'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, ChevronRight, Target, AlertTriangle, Lightbulb, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProFeatureGate } from '@/components/ui/ProFeatureGate';
import { getRotatingInsights, type AIInsight } from '@/lib/mock-data/insights';

const typeIcons = {
  timing: Clock,
  priority: Target,
  warning: AlertTriangle,
  tip: Lightbulb,
};

const typeColors = {
  timing: { bg: 'bg-vista-blue/10', text: 'text-vista-blue', border: 'border-vista-blue/30' },
  priority: { bg: 'bg-mint/10', text: 'text-mint', border: 'border-mint/30' },
  warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/30' },
  tip: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/30' },
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
      className={`p-3 rounded-xl border ${colors.border} ${colors.bg} transition-all duration-200 cursor-pointer hover:brightness-105`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Icon className={`w-4 h-4 ${colors.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-text-primary leading-tight">
              {insight.title}
            </p>
            <span className="text-lg flex-shrink-0">{insight.icon}</span>
          </div>
          <p className="text-xs text-text-muted mt-1 line-clamp-2">
            {insight.description}
          </p>
          {insight.actionLabel && (
            <button className={`mt-2 text-xs font-medium ${colors.text} flex items-center gap-1 hover:underline`}>
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
    <GlassCard padding="lg" animate={false}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500/20 to-vista-blue/20">
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">AI Insights</h2>
        </div>
        <motion.button
          onClick={handleRefresh}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
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
      <p className="text-[10px] text-text-muted mt-4 text-center">
        Powered by AI • Insights update based on real-time data
      </p>
    </GlassCard>
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
