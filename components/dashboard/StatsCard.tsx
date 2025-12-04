'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

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
  delay?: number;
}

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
  iconBgColor = 'bg-mint/10',
  delay = 0,
}: StatsCardProps) {
  const animatedValue = useAnimatedCounter(value, 1200);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <GlassCard padding="lg" animate={false} className="h-full">
        <div className="flex items-start justify-between">
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
            className={`p-3 rounded-2xl ${iconBgColor}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.1, type: 'spring', stiffness: 200 }}
          >
            {icon}
          </motion.div>
        </div>

        {/* Sparkline placeholder - visual element */}
        <motion.div
          className="mt-4 h-8 flex items-end gap-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
        >
          {[...Array(12)].map((_, i) => {
            const height = 20 + Math.sin(i * 0.8) * 15 + Math.random() * 10;
            return (
              <motion.div
                key={i}
                className="flex-1 bg-mint/20 rounded-sm"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: delay + 0.5 + i * 0.03, duration: 0.3 }}
              />
            );
          })}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
