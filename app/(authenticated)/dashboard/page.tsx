'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Users,
  Calendar,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Clock
} from 'lucide-react';
import { getNewReferralsCount, mockReferrals } from '@/lib/mock-data/referrals';
import { mockStudies } from '@/lib/mock-data/studies';

// Placeholder stats for Phase 1
const stats = [
  {
    label: 'Total Referrals',
    value: mockReferrals.length,
    icon: Users,
    trend: '+12%',
    trendUp: true,
  },
  {
    label: 'Appointments This Week',
    value: 4,
    icon: Calendar,
    trend: '+3',
    trendUp: true,
  },
  {
    label: 'Signed ICFs (Monthly)',
    value: mockReferrals.filter(r => r.status === 'signed_icf').length,
    icon: CheckCircle,
    trend: '+8%',
    trendUp: true,
  },
  {
    label: 'Conversion Rate',
    value: '24%',
    icon: TrendingUp,
    trend: '+2.3%',
    trendUp: true,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const newReferrals = getNewReferralsCount();
  const firstName = user?.firstName || 'there';

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-semibold text-text-primary">
          {getGreeting()}, {firstName}!
        </h1>
        <p className="text-text-secondary mt-1">
          Here&apos;s what&apos;s happening with your referrals today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard
              key={stat.label}
              padding="md"
              animate={false}
              className="group hover:scale-[1.02] transition-transform duration-200"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-xl bg-mint/10">
                    <Icon className="w-5 h-5 text-mint" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    stat.trendUp
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-semibold text-text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            </GlassCard>
          );
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Needs Attention Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <GlassCard padding="lg" animate={false}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                Needs Attention
              </h2>
              <span className="px-2.5 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium">
                {newReferrals} new
              </span>
            </div>

            {newReferrals > 0 ? (
              <div className="space-y-3">
                {mockReferrals
                  .filter(r => r.status === 'new')
                  .slice(0, 3)
                  .map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-bg-tertiary/50 hover:bg-bg-tertiary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center text-mint font-semibold">
                          {referral.firstName[0]}{referral.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">
                            {referral.firstName} {referral.lastName}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {mockStudies.find(s => s.id === referral.studyId)?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Clock className="w-4 h-4" />
                        <span>New</span>
                        <ArrowRight className="w-4 h-4 text-mint" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-mint mx-auto mb-3" />
                <p className="text-text-secondary">All caught up! Great work.</p>
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Active Studies Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <GlassCard padding="lg" animate={false}>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Active Studies
            </h2>
            <div className="space-y-3">
              {mockStudies.slice(0, 4).map((study) => {
                const progress = Math.round(
                  (study.currentEnrollment / study.enrollmentGoal) * 100
                );
                return (
                  <div key={study.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-primary">
                        {study.name}
                      </span>
                      <span className="text-xs text-text-muted">
                        {study.currentEnrollment}/{study.enrollmentGoal}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="h-full bg-mint rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Phase 2 Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <GlassCard variant="inset" padding="md" animate={false}>
          <p className="text-center text-sm text-text-muted">
            Dashboard fully functional. Additional features (Daily Digest Modal, Activity Feed, Appointments Timeline) coming in Phase 2.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
