'use client';

import { motion } from 'framer-motion';
import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

type GlassCardVariant = 'default' | 'elevated' | 'inset' | 'liquid' | 'frosted';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: GlassCardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
  shimmer?: boolean;
  children?: ReactNode;
}

const variantClasses: Record<GlassCardVariant, string> = {
  default: 'glass-card',
  elevated: 'glass-card-elevated',
  inset: 'glass-card-inset',
  liquid: 'glass-liquid',
  frosted: 'glass-frosted',
};

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      animate = true,
      shimmer = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const shimmerClass = shimmer ? 'glass-card-shimmer' : '';
    const baseClasses = `${variantClasses[variant]} ${paddingClasses[padding]} ${shimmerClass} ${className}`.trim();

    if (!animate) {
      return (
        <div ref={ref} className={baseClasses} {...props}>
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={baseClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
