'use client';

import { motion } from 'framer-motion';
import { funnelColors } from '@/lib/chart-theme';

interface FunnelStep {
  name: string;
  value: number;
  percentage?: number;
}

interface FunnelChartProps {
  data: FunnelStep[];
  height?: number;
}

export function FunnelChart({ data, height = 300 }: FunnelChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div style={{ height }} className="flex flex-col justify-center gap-2">
      {data.map((step, index) => {
        const widthPercent = (step.value / maxValue) * 100;
        const dropOff = index > 0
          ? Math.round(((data[index - 1].value - step.value) / data[index - 1].value) * 100)
          : 0;

        return (
          <div key={step.name} className="relative">
            <div className="flex items-center gap-3">
              {/* Label */}
              <div className="w-28 text-right flex-shrink-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {step.name}
                </p>
                <p className="text-xs text-text-muted">{step.value}</p>
              </div>

              {/* Bar */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                  className="h-8 rounded-lg relative overflow-hidden"
                  style={{ backgroundColor: funnelColors[index] || funnelColors[0] }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </motion.div>
              </div>

              {/* Percentage & Drop-off */}
              <div className="w-20 text-right flex-shrink-0">
                <span className="text-sm font-semibold text-text-primary">
                  {step.percentage ?? Math.round((step.value / maxValue) * 100)}%
                </span>
                {dropOff > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="text-xs text-warning font-medium"
                  >
                    ↓{dropOff}%
                  </motion.p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
