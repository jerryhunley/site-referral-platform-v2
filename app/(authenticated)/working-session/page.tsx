'use client';

import { GlassCard } from '@/components/ui';

export default function WorkingSessionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Working Session</h1>
        <p className="text-text-secondary mt-1">
          Start a focused calling session with your referrals.
        </p>
      </div>

      <GlassCard variant="inset" padding="lg">
        <div className="text-center py-12">
          <p className="text-lg text-text-secondary">
            Working session dialer interface coming in Phase 5.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
