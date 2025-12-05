'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

type AccentColor = 'mint' | 'blue' | 'purple' | 'amber';

interface StatsCardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  icon: React.ReactNode;
  iconBgColor?: string;
  accentColor?: AccentColor;
  delay?: number;
}

const accentColors: Record<AccentColor, { icon: string; sparkline: string; gradient: string }> = {
  mint: {
    icon: 'bg-gradient-to-br from-mint/20 to-emerald-500/10',
    sparkline: 'bg-mint/30',
    gradient: 'from-mint/5 to-transparent',
  },
  blue: {
    icon: 'bg-gradient-to-br from-vista-blue/20 to-blue-500/10',
    sparkline: 'bg-vista-blue/30',
    gradient: 'from-vista-blue/5 to-transparent',
  },
  purple: {
    icon: 'bg-gradient-to-br from-purple-500/20 to-indigo-500/10',
    sparkline: 'bg-purple-500/30',
    gradient: 'from-purple-500/5 to-transparent',
  },
  amber: {
    icon: 'bg-gradient-to-br from-amber-500/20 to-orange-500/10',
    sparkline: 'bg-amber-500/30',
    gradient: 'from-amber-500/5 to-transparent',
  },
};

// Hook for animated counter
function useAnimatedCounter(endValue: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      countRef.current = Math.floor(easeOutQuart * endValue);
      setCount(countRef.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      startTimeRef.current = null;
    };
  }, [endValue, duration]);

  return count;
}

export function StatsCard({
  title,
  value,
  suffix = '',
  prefix = '',
  trend,
  icon,
  iconBgColor,
  accentColor = 'mint',
  delay = 0,
}: StatsCardProps) {
  const animatedValue = useAnimatedCounter(value, 1200);
  const colors = accentColors[accentColor];
  const finalIconBg = iconBgColor || colors.icon;

  const TrendIcon = trend?.direction === 'up'
    ? TrendingUp
    : trend?.direction === 'down'
    ? TrendingDown
    : Minus;

  const trendColor = trend?.direction === 'up'
    ? 'text-green-500'
    : trend?.direction === 'down'
    ? 'text-red-500'
    : 'text-text-muted';

  const trendBgColor = trend?.direction === 'up'
    ? 'bg-green-500/10'
    : trend?.direction === 'down'
    ? 'bg-red-500/10'
    : 'bg-bg-tertiary';

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GlassCard padding="lg" animate={false} className="h-full relative overflow-hidden">
        {/* Subtle gradient accent at bottom */}
        <div className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t ${colors.gradient} pointer-events-none`} />

        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <motion.span
                className="text-3xl font-bold text-text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.2 }}
              >
                {prefix}{animatedValue}{suffix}
              </motion.span>
            </div>

            {/* Trend Indicator */}
            {trend && (
              <motion.div
                className="mt-3 flex items-center gap-1.5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.4 }}
              >
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${trendColor} ${trendBgColor}`}>
                  <TrendIcon className="w-3 h-3" />
                  {trend.value}%
                </span>
                <span className="text-xs text-text-muted">vs last week</span>
              </motion.div>
            )}
          </div>

          {/* Icon */}
          <motion.div
            className={`p-3 rounded-2xl ${finalIconBg}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.1, type: 'spring', stiffness: 200 }}
          >
            {icon}
          </motion.div>
        </div>

        {/* Sparkline with hover animation */}
        <motion.div
          className="relative mt-4 h-8 flex items-end gap-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
        >
          {[...Array(12)].map((_, i) => {
            const baseHeight = 20 + Math.sin(i * 0.8) * 15 + Math.random() * 10;
            const hoverHeight = Math.min(baseHeight + 15, 95);
            return (
              <motion.div
                key={i}
                className={`flex-1 ${colors.sparkline} rounded-sm transition-colors duration-200`}
                style={{
                  backgroundColor: isHovered ? colors.sparkline.replace('/30', '/50') : undefined
                }}
                initial={{ height: 0 }}
                animate={{ height: isHovered ? `${hoverHeight}%` : `${baseHeight}%` }}
                transition={{
                  delay: isHovered ? i * 0.02 : delay + 0.5 + i * 0.03,
                  duration: isHovered ? 0.2 : 0.3
                }}
              />
            );
          })}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
