'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  Phone,
  Calendar,
  XCircle,
  SkipForward,
  Download,
  Mail,
  RotateCcw,
  Home,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { statusConfigs, type ReferralStatus, type Referral } from '@/lib/types';

interface CallOutcome {
  referralId: string;
  status: ReferralStatus;
  note?: string;
  duration: number;
  timestamp: string;
}

interface SessionReportProps {
  sessionId: string;
  startTime: string;
  endTime: string;
  leads: Referral[];
  completedCalls: CallOutcome[];
  skippedIds: string[];
  totalCallTime: number;
  onStartNew: () => void;
}

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const outcomeIcons: Record<string, typeof CheckCircle> = {
  appointment_scheduled: Calendar,
  not_interested: XCircle,
  default: Phone,
};

const outcomeColors: Record<string, { bg: string; text: string }> = {
  appointment_scheduled: { bg: 'bg-mint/20', text: 'text-mint' },
  not_interested: { bg: 'bg-error/20', text: 'text-error' },
  sent_sms: { bg: 'bg-vista-blue/20', text: 'text-vista-blue' },
  attempt_1: { bg: 'bg-amber-500/20', text: 'text-amber-500' },
  attempt_2: { bg: 'bg-purple-500/20', text: 'text-purple-500' },
  phone_screen_failed: { bg: 'bg-gray-500/20', text: 'text-gray-500' },
};

export function SessionReport({
  sessionId,
  startTime,
  endTime,
  leads,
  completedCalls,
  skippedIds,
  totalCallTime,
  onStartNew,
}: SessionReportProps) {
  const router = useRouter();

  // Calculate stats
  const totalLeads = leads.length;
  const completedCount = completedCalls.length;
  const skippedCount = skippedIds.length;
  const sessionDuration = Math.floor(
    (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
  );
  const avgCallTime = completedCount > 0 ? Math.round(totalCallTime / completedCount) : 0;

  // Calculate outcome breakdown
  const outcomeBreakdown = completedCalls.reduce((acc, call) => {
    acc[call.status] = (acc[call.status] || 0) + 1;
    return acc;
  }, {} as Record<ReferralStatus, number>);

  // Calculate success metrics
  const appointmentsScheduled = outcomeBreakdown.appointment_scheduled || 0;
  const contactRate = totalLeads > 0
    ? Math.round((completedCount / totalLeads) * 100)
    : 0;
  const conversionRate = completedCount > 0
    ? Math.round((appointmentsScheduled / completedCount) * 100)
    : 0;

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Lead Name', 'Status', 'Duration', 'Note', 'Time'];
    const rows = completedCalls.map((call) => {
      const lead = leads.find((l) => l.id === call.referralId);
      return [
        lead ? `${lead.firstName} ${lead.lastName}` : 'Unknown',
        statusConfigs[call.status].label,
        formatDuration(call.duration),
        call.note || '',
        formatTime(call.timestamp),
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-report-${sessionId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mint/20 mb-4">
          <CheckCircle className="w-8 h-8 text-mint" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Session Complete!</h1>
        <p className="text-text-secondary mt-1">
          Great work! Here's your session summary.
        </p>
      </motion.div>

      {/* Key Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard padding="lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-mint/10 mb-3">
                <Phone className="w-6 h-6 text-mint" />
              </div>
              <p className="text-3xl font-bold text-text-primary">{completedCount}</p>
              <p className="text-sm text-text-muted">Calls Made</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-vista-blue/10 mb-3">
                <Calendar className="w-6 h-6 text-vista-blue" />
              </div>
              <p className="text-3xl font-bold text-text-primary">{appointmentsScheduled}</p>
              <p className="text-sm text-text-muted">Appointments</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 mb-3">
                <Clock className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-text-primary">{formatDuration(sessionDuration)}</p>
              <p className="text-sm text-text-muted">Total Time</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 mb-3">
                <TrendingUp className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-text-primary">{conversionRate}%</p>
              <p className="text-sm text-text-muted">Conversion</p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-6 pt-6 border-t border-glass-border grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-text-primary">{formatDuration(avgCallTime)}</p>
              <p className="text-xs text-text-muted">Avg Call Time</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">{contactRate}%</p>
              <p className="text-xs text-text-muted">Contact Rate</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">{skippedCount}</p>
              <p className="text-xs text-text-muted">Skipped</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Outcome Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard padding="lg">
          <h2 className="font-semibold text-text-primary mb-4">Outcome Breakdown</h2>

          {Object.entries(outcomeBreakdown).length === 0 ? (
            <p className="text-text-muted text-center py-4">No outcomes recorded</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(outcomeBreakdown).map(([status, count]) => {
                const config = statusConfigs[status as ReferralStatus];
                const colors = outcomeColors[status] || { bg: 'bg-gray-500/20', text: 'text-gray-500' };
                const percentage = Math.round((count / completedCount) * 100);

                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className={`w-10 text-center py-1 rounded-lg ${colors.bg}`}>
                      <span className={`text-sm font-bold ${colors.text}`}>{count}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-text-primary">
                          {config.label}
                        </span>
                        <span className="text-xs text-text-muted">{percentage}%</span>
                      </div>
                      <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className={`h-full rounded-full ${colors.bg.replace('/20', '')}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Call Log */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard padding="lg">
          <h2 className="font-semibold text-text-primary mb-4">Call Log</h2>

          {completedCalls.length === 0 ? (
            <p className="text-text-muted text-center py-4">No calls recorded</p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {completedCalls.map((call, index) => {
                const lead = leads.find((l) => l.id === call.referralId);
                const config = statusConfigs[call.status];
                const colors = outcomeColors[call.status] || { bg: 'bg-gray-500/20', text: 'text-gray-500' };

                return (
                  <motion.div
                    key={call.referralId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-bg-tertiary/50"
                  >
                    <Avatar
                      firstName={lead?.firstName || '?'}
                      lastName={lead?.lastName || '?'}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary">
                          {lead ? `${lead.firstName} ${lead.lastName}` : 'Unknown'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                          {config.label}
                        </span>
                      </div>
                      {call.note && (
                        <p className="text-xs text-text-muted mt-0.5 truncate">
                          {call.note}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-text-primary">
                        {formatDuration(call.duration)}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatTime(call.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Skipped Leads */}
          {skippedIds.length > 0 && (
            <div className="mt-4 pt-4 border-t border-glass-border">
              <p className="text-sm text-text-muted mb-2">
                <SkipForward className="w-4 h-4 inline mr-1" />
                {skippedIds.length} leads skipped
              </p>
              <div className="flex flex-wrap gap-2">
                {skippedIds.map((id) => {
                  const lead = leads.find((l) => l.id === id);
                  return (
                    <span
                      key={id}
                      className="px-2 py-1 text-xs bg-bg-tertiary rounded-lg text-text-muted"
                    >
                      {lead ? `${lead.firstName} ${lead.lastName}` : 'Unknown'}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <Button
          variant="secondary"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={handleExportCSV}
        >
          Export CSV
        </Button>
        <Button
          variant="secondary"
          leftIcon={<Mail className="w-4 h-4" />}
          onClick={() => {
            // Mock email functionality
            alert('Email report feature coming soon!');
          }}
        >
          Email Report
        </Button>
        <Button
          variant="secondary"
          leftIcon={<RotateCcw className="w-4 h-4" />}
          onClick={onStartNew}
        >
          Start New Session
        </Button>
        <Button
          variant="primary"
          leftIcon={<Home className="w-4 h-4" />}
          onClick={() => router.push('/dashboard')}
        >
          Return to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
