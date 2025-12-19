'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tooltip } from '@/components/ui/Tooltip';
import type { Referral } from '@/lib/types';

interface ContactInfoCardProps {
  referral: Referral;
}

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

interface CopyButtonProps {
  text: string;
  label: string;
}

function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tooltip content={copied ? 'Copied!' : `Copy ${label}`}>
      <motion.button
        onClick={handleCopy}
        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary glass-hover transition-colors"
        whileTap={{ scale: 0.9 }}
      >
        {copied ? (
          <Check className="w-4 h-4 text-mint" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </motion.button>
    </Tooltip>
  );
}

export function ContactInfoCard({ referral }: ContactInfoCardProps) {
  const age = calculateAge(referral.dateOfBirth);

  const contactItems = [
    {
      icon: Phone,
      label: 'Phone',
      value: formatPhone(referral.phone),
      raw: referral.phone,
      action: `tel:${referral.phone}`,
      color: 'text-mint',
      bgColor: 'bg-mint/10',
    },
    {
      icon: Mail,
      label: 'Email',
      value: referral.email,
      raw: referral.email,
      action: `mailto:${referral.email}`,
      color: 'text-vista-blue',
      bgColor: 'bg-vista-blue/10',
    },
    {
      icon: Calendar,
      label: 'Date of Birth',
      value: `${formatDate(referral.dateOfBirth)} (${age} years old)`,
      raw: referral.dateOfBirth,
    },
    {
      icon: MapPin,
      label: 'Source',
      value: referral.source,
      raw: referral.source,
    },
    {
      icon: Clock,
      label: 'Submitted',
      value: formatDate(referral.submittedAt),
      raw: referral.submittedAt,
    },
  ];

  return (
    <GlassCard padding="lg" animate={false}>
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Contact Information
      </h3>

      <div className="space-y-4">
        {contactItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3"
          >
            <div className={`p-2 rounded-xl ${item.bgColor || 'bg-white/40 dark:bg-white/10 backdrop-blur-sm'}`}>
              <item.icon className={`w-4 h-4 ${item.color || 'text-text-secondary'}`} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-text-muted uppercase tracking-wide">
                {item.label}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {item.action ? (
                  <a
                    href={item.action}
                    className="text-sm font-medium text-text-primary hover:text-mint transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="text-sm font-medium text-text-primary">
                    {item.value}
                  </span>
                )}

                {(item.label === 'Phone' || item.label === 'Email') && (
                  <div className="flex items-center gap-1">
                    <CopyButton text={item.raw} label={item.label.toLowerCase()} />
                    {item.action && (
                      <Tooltip content={`Open ${item.label.toLowerCase()}`}>
                        <a
                          href={item.action}
                          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary glass-hover transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Tooltip>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
