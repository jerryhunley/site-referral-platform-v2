'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  BarChart3,
  Brain,
  MessageSquare,
  Headphones,
  Check,
  X,
} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useProTier } from '@/lib/context/ProTierContext';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  {
    icon: BarChart3,
    title: 'Advanced Analytics & Charts',
    description: 'Track conversion funnels, source performance, and more',
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Smart recommendations for optimal outreach timing',
  },
  {
    icon: MessageSquare,
    title: 'Bulk SMS Campaigns',
    description: 'Send templated messages to multiple referrals at once',
  },
  {
    icon: Headphones,
    title: 'Priority Support',
    description: 'Get help faster with dedicated support channels',
  },
];

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { upgradeToPro } = useProTier();

  const handleUpgrade = () => {
    upgradeToPro();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={false}>
      <div className="relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 rounded-xl text-text-secondary hover:text-text-primary glass-modal-card transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mint via-vista-blue to-purple-500 flex items-center justify-center mx-auto mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-text-primary">
            Unlock Pro Features
          </h2>
          <p className="text-text-secondary mt-2">
            Supercharge your referral management with powerful tools
          </p>
        </div>

        {/* Features list */}
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="flex items-start gap-3 p-3 glass-modal-card"
            >
              <div className="p-2 rounded-lg bg-mint/10">
                <feature.icon className="w-5 h-5 text-mint" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-mint flex-shrink-0" />
                  <span className="font-medium text-text-primary">
                    {feature.title}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-0.5 ml-6">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Upgrade button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            leftIcon={<Sparkles className="w-5 h-5" />}
            onClick={handleUpgrade}
          >
            Upgrade to Pro
          </Button>
        </motion.div>

        {/* Demo note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-text-muted mt-4"
        >
          This is a demo - clicking &quot;Upgrade&quot; will instantly unlock all features
        </motion.p>
      </div>
    </Modal>
  );
}
