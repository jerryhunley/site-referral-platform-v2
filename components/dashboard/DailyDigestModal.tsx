'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Users,
  Calendar,
  AlertCircle,
  MessageSquare,
  Phone,
  Eye,
  ChevronRight
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { getNewReferralsCount, getOverdueReferrals, getUnreadSMSMessages } from '@/lib/mock-data/referrals';
import { getTodaysAppointments } from '@/lib/mock-data/appointments';

interface DailyDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function DailyDigestModal({ isOpen, onClose }: DailyDigestModalProps) {
  const [dontShowToday, setDontShowToday] = useState(false);

  const newReferrals = getNewReferralsCount();
  const todaysAppointments = getTodaysAppointments();
  const overdueReferrals = getOverdueReferrals(2);
  const unreadMessages = getUnreadSMSMessages();

  const handleClose = () => {
    if (dontShowToday) {
      const today = new Date().toDateString();
      localStorage.setItem('digestDismissedDate', today);
    }
    onClose();
  };

  // Check if we should auto-dismiss
  useEffect(() => {
    const dismissedDate = localStorage.getItem('digestDismissedDate');
    const today = new Date().toDateString();
    if (dismissedDate === today && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  const metrics = [
    {
      label: 'New Referrals',
      value: newReferrals,
      icon: Users,
      color: 'text-mint',
      bgColor: 'bg-mint/10',
      description: 'since last login',
    },
    {
      label: 'Appointments Today',
      value: todaysAppointments.length,
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: todaysAppointments[0]
        ? `Next: ${new Date(todaysAppointments[0].scheduledFor).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
        : 'No appointments',
    },
    {
      label: 'Needs Attention',
      value: overdueReferrals.length,
      icon: AlertCircle,
      color: overdueReferrals.length > 0 ? 'text-warning' : 'text-text-secondary',
      bgColor: overdueReferrals.length > 0 ? 'bg-warning/10' : 'bg-bg-tertiary',
      description: 'overdue follow-ups',
    },
    {
      label: 'New Messages',
      value: unreadMessages.length,
      icon: MessageSquare,
      color: 'text-vista-blue',
      bgColor: 'bg-vista-blue/10',
      description: 'unread',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      showCloseButton={false}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <motion.h2
              className="text-2xl font-bold text-text-primary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {getGreeting()}!
            </motion.h2>
            <motion.p
              className="text-text-secondary mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              {formatDate()}
            </motion.p>
          </div>
          <motion.button
            onClick={handleClose}
            className="p-2 rounded-xl text-text-secondary hover:text-text-primary glass-modal-card transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <div className="glass-modal-card p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${metric.bgColor}`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-secondary">{metric.label}</p>
                    <p className="text-2xl font-bold text-text-primary mt-0.5">
                      {metric.value}
                    </p>
                    <p className="text-xs text-text-muted mt-1 truncate">
                      {metric.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Today's First Appointment Preview */}
        {todaysAppointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="glass-modal-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10">
                    <Calendar className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Next Appointment</p>
                    <p className="font-semibold text-text-primary">
                      {todaysAppointments[0].referralName}
                    </p>
                    <p className="text-xs text-text-muted">
                      {todaysAppointments[0].studyName} • {' '}
                      {new Date(todaysAppointments[0].scheduledFor).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Button
            variant="primary"
            leftIcon={<Phone className="w-4 h-4" />}
            onClick={handleClose}
          >
            Start Working Session
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Calendar className="w-4 h-4" />}
            onClick={handleClose}
          >
            View Appointments
          </Button>
          <Button
            variant="ghost"
            leftIcon={<Eye className="w-4 h-4" />}
            onClick={handleClose}
          >
            See All Referrals
          </Button>
        </motion.div>

        {/* Don't show again checkbox */}
        <motion.div
          className="flex items-center justify-between pt-4 border-t border-glass-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowToday}
              onChange={(e) => setDontShowToday(e.target.checked)}
              className="w-4 h-4 rounded border-glass-border text-mint focus:ring-mint/50"
            />
            <span className="text-sm text-text-secondary">
              Don&apos;t show again today
            </span>
          </label>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            Dismiss
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
}
