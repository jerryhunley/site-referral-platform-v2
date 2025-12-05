'use client';

import { motion } from 'framer-motion';
import { Phone, MapPin, FileText, Clock, ChevronRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import type { Appointment } from '@/lib/types';

interface AppointmentsTimelineProps {
  appointments: Appointment[];
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

const appointmentTypeConfig = {
  phone_screen: {
    label: 'Phone Screen',
    icon: Phone,
    color: 'text-vista-blue',
    bgColor: 'bg-vista-blue/10',
  },
  in_person_screen: {
    label: 'In-Person Screen',
    icon: MapPin,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  consent_visit: {
    label: 'Consent Visit',
    icon: FileText,
    color: 'text-mint',
    bgColor: 'bg-mint/10',
  },
};

function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function isNow(date: string): boolean {
  const appointmentTime = new Date(date);
  const now = new Date();
  const diffMinutes = Math.abs(appointmentTime.getTime() - now.getTime()) / (1000 * 60);
  return diffMinutes < 30;
}

function isPast(date: string): boolean {
  return new Date(date) < new Date();
}

export function AppointmentsTimeline({
  appointments,
  title = "Today's Appointments",
  showViewAll = true,
  onViewAll,
}: AppointmentsTimelineProps) {
  if (appointments.length === 0) {
    return (
      <GlassCard padding="lg">
        <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>
        <EmptyState
          type="no-appointments"
          title="No appointments today"
          description="Enjoy your free time or start a working session"
        />
      </GlassCard>
    );
  }

  return (
    <GlassCard padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {showViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
          </Button>
        )}
      </div>

      <div className="space-y-1">
        {appointments.map((appointment, index) => {
          const config = appointmentTypeConfig[appointment.type];
          const Icon = config.icon;
          const isCurrentTime = isNow(appointment.scheduledFor);
          const hasPassed = isPast(appointment.scheduledFor);

          return (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <div
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  isCurrentTime
                    ? 'bg-mint/10 ring-1 ring-mint/30'
                    : hasPassed
                    ? 'opacity-60'
                    : 'hover:bg-bg-tertiary'
                }`}
              >
                {/* Time & Icon */}
                <div className="flex flex-col items-center">
                  <span
                    className={`text-sm font-semibold ${
                      isCurrentTime ? 'text-mint' : 'text-text-primary'
                    }`}
                  >
                    {formatTime(appointment.scheduledFor)}
                  </span>
                  <div className={`mt-2 p-2 rounded-xl ${config.bgColor}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-text-primary truncate">
                      {appointment.referralName}
                    </p>
                    {isCurrentTime && (
                      <motion.span
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-mint text-white text-xs font-medium"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Clock className="w-3 h-3" />
                        Now
                      </motion.span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mt-0.5">
                    {appointment.studyName}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {config.label}
                    {appointment.notes && ` • ${appointment.notes}`}
                  </p>
                </div>

                {/* Action */}
                <motion.button
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
