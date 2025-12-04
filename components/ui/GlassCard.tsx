'use client';

import { motion } from 'framer-motion';
import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

type GlassCardVariant = 'default' | 'elevated' | 'inset';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: GlassCardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  animate?: boolean;
  children?: ReactNode;
}

const variantClasses: Record<GlassCardVariant, string> = {
  default: 'glass-card',
  elevated: 'glass-card-elevated',
  inset: 'glass-card-inset',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      animate = true,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = `${variantClasses[variant]} ${paddingClasses[padding]} ${className}`;

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
