'use client';

import { GlassCard } from '@/components/ui';

export default function ReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Referrals</h1>
        <p className="text-text-secondary mt-1">
          Manage and track all patient referrals.
        </p>
      </div>

      <GlassCard variant="inset" padding="lg">
        <div className="text-center py-12">
          <p className="text-lg text-text-secondary">
            Referral list and management features coming in Phase 3.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
