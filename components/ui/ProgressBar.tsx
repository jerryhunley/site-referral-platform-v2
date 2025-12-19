'use client';

import { motion } from 'framer-motion';

type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error';
type ProgressBarSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number; // 0-100
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const variantClasses: Record<ProgressBarVariant, string> = {
  default: 'bg-mint',
  success: 'bg-mint',
  warning: 'bg-amber-500',
  error: 'bg-error',
};

const sizeClasses: Record<ProgressBarSize, string> = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  variant = 'default',
  size = 'md',
  showLabel = false,
  animated = true,
  className = '',
}: ProgressBarProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
          w-full bg-white/40 dark:bg-white/10 backdrop-blur-sm rounded-full overflow-hidden
          ${sizeClasses[size]}
        `}
      >
        {animated ? (
          <motion.div
            className={`h-full rounded-full ${variantClasses[variant]}`}
            initial={{ width: 0 }}
            animate={{ width: `${clampedValue}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={`h-full rounded-full ${variantClasses[variant]}`}
            style={{ width: `${clampedValue}%` }}
          />
        )}
      </div>
      {showLabel && (
        <p className="text-xs text-text-muted mt-1 text-right">
          {Math.round(clampedValue)}%
        </p>
      )}
    </div>
  );
}
