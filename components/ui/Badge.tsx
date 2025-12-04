'use client';

import { CheckCircle } from 'lucide-react';
import type { ReferralStatus } from '@/lib/types';
import { statusConfigs } from '@/lib/types';

interface BadgeProps {
  status: ReferralStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ status, size = 'md', className = '' }: BadgeProps) {
  const config = statusConfigs[status];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1
        font-medium rounded-full
        ${config.bgClass}
        ${config.textClass}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {config.icon === 'check-circle' && (
        <CheckCircle className="w-3.5 h-3.5" />
      )}
      {config.label}
    </span>
  );
}
