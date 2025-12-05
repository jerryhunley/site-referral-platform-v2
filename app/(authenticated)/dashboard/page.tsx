'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Users,
  Calendar,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Clock,
  Phone,
  Plus
} from 'lucide-react';
import { DailyDigestModal } from '@/components/dashboard/DailyDigestModal';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AppointmentsTimeline } from '@/components/dashboard/AppointmentsTimeline';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { AIInsights } from '@/components/dashboard/AIInsights';
import {
  mockReferrals,
  getNewReferralsCount,
  getSignedICFCount,
  getActiveReferralsCount,
  getConversionRate,
  getOverdueReferrals,
} from '@/lib/mock-data/referrals';
import { mockStudies } from '@/lib/mock-data/studies';
import { getTodaysAppointments, getAppointmentCountThisWeek } from '@/lib/mock-data/appointments';
import { getRecentActivity } from '@/lib/mock-data/activity';

export default function DashboardPage() {
  const { user } = useAuth();
  const [showDigest, setShowDigest] = useState(false);
  const firstName = user?.firstName || 'there';

  // Check if digest should show on mount
  useEffect(() => {
    const dismissedDate = localStorage.getItem('digestDismissedDate');
    const today = new Date().toDateString();
    if (dismissedDate !== today) {
      // Small delay to let the page load first
      const timer = setTimeout(() => setShowDigest(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Stats data with accent colors
  const stats = [
    {
      title: 'Total Referrals',
      value: getActiveReferralsCount(),
      icon: <Users className="w-6 h-6 text-mint" />,
      accentColor: 'mint' as const,
      trend: { value: 12, direction: 'up' as const },
    },
    {
      title: 'Appointments This Week',
      value: getAppointmentCountThisWeek(),
      icon: <Calendar className="w-6 h-6 text-purple-500" />,
      accentColor: 'purple' as const,
      trend: { value: 8, direction: 'up' as const },
    },
    {
      title: 'Signed ICFs (Monthly)',
      value: getSignedICFCount(),
      icon: <CheckCircle className="w-6 h-6 text-mint" />,
      accentColor: 'mint' as const,
      trend: { value: 15, direction: 'up' as const },
    },
    {
      title: 'Conversion Rate',
      value: getConversionRate(),
      suffix: '%',
      icon: <TrendingUp className="w-6 h-6 text-vista-blue" />,
      accentColor: 'blue' as const,
      trend: { value: 2, direction: 'up' as const },
    },
  ];

  const todaysAppointments = getTodaysAppointments();
  const recentActivity = getRecentActivity(15);
  const newReferrals = getNewReferralsCount();
  const overdueReferrals = getOverdueReferrals(2);

  return (
    <>
      {/* Daily Digest Modal */}
      <DailyDigestModal
        isOpen={showDigest}
        onClose={() => setShowDigest(false)}
      />

      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {getGreeting()}, {firstName}!
            </h1>
            <p className="text-text-secondary mt-1">
              Here&apos;s what&apos;s happening with your referrals today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Referral
            </Button>
            <Button
              variant="primary"
              leftIcon={<Phone className="w-4 h-4" />}
            >
              Start Session
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              suffix={stat.suffix}
              icon={stat.icon}
              accentColor={stat.accentColor}
              trend={stat.trend}
              delay={0.1 + index * 0.05}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Appointments & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Appointments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <AppointmentsTimeline appointments={todaysAppointments} />
            </motion.div>

            {/* Needs Attention */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <GlassCard padding="lg" animate={false}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-text-primary">
                    Needs Attention
                  </h2>
                  <div className="flex items-center gap-2">
                    {newReferrals > 0 && (
                      <span className="px-2.5 py-1 rounded-full bg-mint/10 text-mint text-sm font-medium">
                        {newReferrals} new
                      </span>
                    )}
                    {overdueReferrals.length > 0 && (
                      <span className="px-2.5 py-1 rounded-full bg-warning/10 text-warning text-sm font-medium">
                        {overdueReferrals.length} overdue
                      </span>
                    )}
                  </div>
                </div>

                {newReferrals > 0 || overdueReferrals.length > 0 ? (
                  <div className="space-y-3">
                    {/* New Referrals */}
                    {mockReferrals
                      .filter(r => r.status === 'new')
                      .slice(0, 3)
                      .map((referral) => (
                        <div
                          key={referral.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 transition-colors cursor-pointer border border-white/60 dark:border-white/10"
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
                            <span className="px-2 py-0.5 rounded-full bg-mint/20 text-mint text-xs font-medium">
                              New
                            </span>
                            <ArrowRight className="w-4 h-4 text-mint" />
                          </div>
                        </div>
                      ))}

                    {/* Overdue follow-ups */}
                    {overdueReferrals.slice(0, 2).map((referral) => (
                      <div
                        key={referral.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 transition-colors cursor-pointer border border-white/60 dark:border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center text-warning font-semibold">
                            {referral.firstName[0]}{referral.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">
                              {referral.firstName} {referral.lastName}
                            </p>
                            <p className="text-sm text-text-secondary">
                              Last contacted {Math.floor((Date.now() - new Date(referral.updatedAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-muted">
                          <Clock className="w-4 h-4 text-warning" />
                          <span className="text-warning">Overdue</span>
                          <ArrowRight className="w-4 h-4" />
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
          </div>

          {/* Right Column - AI Insights, Activity Feed & Studies */}
          <div className="space-y-6">
            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <AIInsights />
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <ActivityFeed
                activities={recentActivity}
                maxItems={8}
                showFilters={false}
              />
            </motion.div>

            {/* Active Studies Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
            >
              <GlassCard padding="lg" animate={false}>
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  Active Studies
                </h2>
                <div className="space-y-4">
                  {mockStudies.slice(0, 4).map((study, index) => {
                    const progress = Math.round(
                      (study.currentEnrollment / study.enrollmentGoal) * 100
                    );
                    const isNearGoal = progress >= 80;
                    return (
                      <motion.div
                        key={study.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-text-primary">
                            {study.name}
                          </span>
                          <span className={`text-xs font-medium ${isNearGoal ? 'text-mint' : 'text-text-muted'}`}>
                            {study.currentEnrollment}/{study.enrollmentGoal}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                            className={`h-full rounded-full ${isNearGoal ? 'bg-mint' : 'bg-vista-blue'}`}
                          />
                        </div>
                        <p className="text-xs text-text-muted">{study.indication}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
