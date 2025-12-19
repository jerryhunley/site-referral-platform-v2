'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Plus,
  Phone,
  MapPin,
  FileText,
  Clock,
  ChevronRight,
  MoreHorizontal,
  Edit2,
  Trash2,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Appointment } from '@/lib/types';

interface AppointmentsPanelProps {
  appointments: Appointment[];
  onSchedule: () => void;
  onReschedule: (appointmentId: string) => void;
  onCancel: (appointmentId: string) => void;
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function isUpcoming(dateString: string): boolean {
  return new Date(dateString) > new Date();
}

function isPast(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function AppointmentsPanel({
  appointments,
  onSchedule,
  onReschedule,
  onCancel,
}: AppointmentsPanelProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const upcomingAppointments = appointments
    .filter((a) => isUpcoming(a.scheduledFor))
    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());

  const pastAppointments = appointments
    .filter((a) => isPast(a.scheduledFor))
    .sort((a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime())
    .slice(0, 3);

  const renderAppointment = (appointment: Appointment, isPastAppointment = false) => {
    const config = appointmentTypeConfig[appointment.type];
    const Icon = config.icon;
    const isTodayAppointment = isToday(appointment.scheduledFor);

    return (
      <motion.div
        key={appointment.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative group ${isPastAppointment ? 'opacity-60' : ''}`}
      >
        <div
          className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
            isTodayAppointment && !isPastAppointment
              ? 'bg-mint/10 ring-1 ring-mint/30'
              : 'glass-hover'
          }`}
        >
          {/* Icon */}
          <div className={`p-2 rounded-xl ${config.bgColor}`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-primary text-sm">
                {config.label}
              </span>
              {isTodayAppointment && !isPastAppointment && (
                <span className="px-2 py-0.5 text-xs font-medium bg-mint text-white rounded-full">
                  Today
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(appointment.scheduledFor)}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(appointment.scheduledFor)}</span>
            </div>
            {appointment.notes && (
              <p className="text-xs text-text-secondary mt-1 truncate">
                {appointment.notes}
              </p>
            )}
          </div>

          {/* Actions Menu */}
          {!isPastAppointment && (
            <div className="relative">
              <button
                onClick={() =>
                  setActiveMenuId(activeMenuId === appointment.id ? null : appointment.id)
                }
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary glass-hover opacity-0 group-hover:opacity-100 transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {activeMenuId === appointment.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute right-0 top-full mt-1 py-1 glass-panel rounded-xl shadow-lg z-10 min-w-[140px]"
                  >
                    <button
                      onClick={() => {
                        onReschedule(appointment.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary glass-hover transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Reschedule
                    </button>
                    <button
                      onClick={() => {
                        onCancel(appointment.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancel
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <GlassCard padding="lg" animate={false}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Appointments</h3>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onSchedule}
        >
          Schedule
        </Button>
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          type="no-appointments"
          title="No appointments"
          description="Schedule an appointment to get started"
          action={
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onSchedule}
            >
              Schedule Appointment
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Upcoming */}
          {upcomingAppointments.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                Upcoming
              </h4>
              <div className="space-y-2">
                {upcomingAppointments.map((appointment) =>
                  renderAppointment(appointment)
                )}
              </div>
            </div>
          )}

          {/* Past */}
          {pastAppointments.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                Past
              </h4>
              <div className="space-y-2">
                {pastAppointments.map((appointment) =>
                  renderAppointment(appointment, true)
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}
