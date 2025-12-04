'use client';

import { GlassCard } from '@/components/ui';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">
          Configure your profile and site preferences.
        </p>
      </div>

      <GlassCard variant="inset" padding="lg">
        <div className="text-center py-12">
          <p className="text-lg text-text-secondary">
            Settings and CSV upload features coming in Phase 6.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
