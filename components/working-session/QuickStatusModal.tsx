'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneMissed,
  Voicemail,
  MessageSquare,
  Calendar,
  XCircle,
  HelpCircle,
  SkipForward,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import type { ReferralStatus } from '@/lib/types';

interface QuickStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: ReferralStatus, note?: string) => void;
  onSkip: () => void;
  callDuration: number;
  leadName: string;
}

interface StatusOption {
  status: ReferralStatus;
  label: string;
  description: string;
  icon: typeof PhoneMissed;
  color: string;
  bgColor: string;
}

const statusOptions: StatusOption[] = [
  {
    status: 'attempt_1',
    label: 'No Answer',
    description: 'Called but no pickup',
    icon: PhoneMissed,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    status: 'sent_sms',
    label: 'Left Voicemail',
    description: 'Left message, will follow up',
    icon: Voicemail,
    color: 'text-vista-blue',
    bgColor: 'bg-vista-blue/10',
  },
  {
    status: 'attempt_2',
    label: 'Spoke - Follow Up',
    description: 'Interested, needs callback',
    icon: MessageSquare,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    status: 'appointment_scheduled',
    label: 'Scheduled',
    description: 'Appointment booked',
    icon: Calendar,
    color: 'text-mint',
    bgColor: 'bg-mint/10',
  },
  {
    status: 'not_interested',
    label: 'Not Interested',
    description: 'Declined participation',
    icon: XCircle,
    color: 'text-error',
    bgColor: 'bg-error/10',
  },
  {
    status: 'phone_screen_failed',
    label: 'Wrong Number',
    description: 'Invalid contact info',
    icon: HelpCircle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
  },
];

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function QuickStatusModal({
  isOpen,
  onClose,
  onSubmit,
  onSkip,
  callDuration,
  leadName,
}: QuickStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ReferralStatus | null>(null);
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (selectedStatus) {
      onSubmit(selectedStatus, note.trim() || undefined);
      setSelectedStatus(null);
      setNote('');
    }
  };

  const handleSkip = () => {
    onSkip();
    setSelectedStatus(null);
    setNote('');
    onClose();
  };

  const handleClose = () => {
    setSelectedStatus(null);
    setNote('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Call Outcome"
      size="lg"
      closeOnBackdropClick={false}
    >
      <div className="space-y-6">
        {/* Call Summary */}
        <div className="text-center pb-4 border-b border-glass-border">
          <p className="text-text-secondary">
            Call with <span className="font-medium text-text-primary">{leadName}</span>
          </p>
          {callDuration > 0 && (
            <p className="text-sm text-text-muted mt-1">
              Duration: {formatDuration(callDuration)}
            </p>
          )}
        </div>

        {/* Status Options */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedStatus === option.status;

            return (
              <motion.button
                key={option.status}
                onClick={() => setSelectedStatus(option.status)}
                className={`
                  p-4 rounded-xl text-left transition-all
                  ${isSelected
                    ? 'ring-2 ring-mint bg-mint/10'
                    : 'hover:bg-bg-tertiary'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`inline-flex p-2 rounded-xl ${option.bgColor} mb-2`}>
                  <Icon className={`w-5 h-5 ${option.color}`} />
                </div>
                <p className="font-medium text-text-primary text-sm">{option.label}</p>
                <p className="text-xs text-text-muted mt-0.5">{option.description}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Note Input */}
        {selectedStatus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Textarea
              label="Add a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any additional details about the call..."
              rows={2}
            />
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-glass-border">
          <Button
            variant="ghost"
            leftIcon={<SkipForward className="w-4 h-4" />}
            onClick={handleSkip}
          >
            Skip Lead
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!selectedStatus}
            >
              Save & Next
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
