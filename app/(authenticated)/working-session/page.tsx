'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { WorkingSessionProvider, useWorkingSession } from '@/lib/context/WorkingSessionContext';
import { LeadSelector } from '@/components/working-session/LeadSelector';
import { DialerInterface } from '@/components/working-session/DialerInterface';
import { QuickStatusModal } from '@/components/working-session/QuickStatusModal';
import { SessionProgress } from '@/components/working-session/SessionProgress';
import { SessionReport } from '@/components/working-session/SessionReport';
import type { Referral } from '@/lib/types';

function WorkingSessionContent() {
  const {
    session,
    currentLead,
    isCallActive,
    callDuration,
    startSession,
    endSession,
    startCall,
    endCall,
    recordOutcome,
    skipLead,
    goToNextLead,
    getSessionStats,
  } = useWorkingSession();

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [sessionElapsedTime, setSessionElapsedTime] = useState(0);

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (session?.phase === 'active' && session.startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - new Date(session.startTime!).getTime()) / 1000
        );
        setSessionElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [session?.phase, session?.startTime]);

  const handleStartSession = (leads: Referral[]) => {
    startSession(leads);
    setSessionElapsedTime(0);
  };

  const handleEndCall = () => {
    endCall();
    setShowStatusModal(true);
  };

  const handleStatusSubmit = (status: Parameters<typeof recordOutcome>[0], note?: string) => {
    recordOutcome(status, note);
    setShowStatusModal(false);
    goToNextLead();
  };

  const handleSkip = () => {
    skipLead();
    setShowStatusModal(false);
    goToNextLead();
  };

  const handleEndSession = () => {
    setShowEndConfirm(false);
    endSession();
  };

  const handleStartNew = () => {
    // Reset session - the provider will handle this
    window.location.reload();
  };

  const stats = getSessionStats();

  // Setup phase - show lead selector
  if (!session || session.phase === 'setup') {
    return (
      <div className="space-y-6">
        <LeadSelector onStartSession={handleStartSession} />
      </div>
    );
  }

  // Completed phase - show report
  if (session.phase === 'completed') {
    return (
      <SessionReport
        sessionId={session.id}
        startTime={session.startTime!}
        endTime={session.endTime!}
        leads={session.leads}
        completedCalls={session.completedCalls}
        skippedIds={session.skippedIds}
        totalCallTime={session.totalCallTime}
        onStartNew={handleStartNew}
      />
    );
  }

  // Active phase - show dialer interface
  return (
    <div className="space-y-6">
      {/* Header with exit option */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => setShowEndConfirm(true)}
        >
          Exit Session
        </Button>
        <h1 className="text-lg font-semibold text-text-primary">Working Session</h1>
        <div className="w-24" /> {/* Spacer for alignment */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Dialer - takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {currentLead && (
              <motion.div
                key={currentLead.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DialerInterface
                  lead={currentLead}
                  isCallActive={isCallActive}
                  callDuration={callDuration}
                  onStartCall={startCall}
                  onEndCall={handleEndCall}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Session Progress - sidebar */}
        <div className="lg:col-span-1">
          <SessionProgress
            currentIndex={session.currentIndex}
            totalLeads={session.leads.length}
            completedCount={stats.completedCalls}
            skippedCount={stats.skippedCount}
            elapsedTime={sessionElapsedTime}
            leads={session.leads}
            completedIds={session.completedCalls.map((c) => c.referralId)}
            skippedIds={session.skippedIds}
          />
        </div>
      </div>

      {/* Quick Status Modal */}
      <QuickStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onSubmit={handleStatusSubmit}
        onSkip={handleSkip}
        callDuration={callDuration}
        leadName={currentLead ? `${currentLead.firstName} ${currentLead.lastName}` : ''}
      />

      {/* End Session Confirmation */}
      <Modal
        isOpen={showEndConfirm}
        onClose={() => setShowEndConfirm(false)}
        title="End Session?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-text-secondary">
            Are you sure you want to end this session? Your progress will be saved.
          </p>
          <div className="text-sm text-text-muted">
            <p>Completed: {stats.completedCalls} calls</p>
            <p>Remaining: {stats.remainingCount} leads</p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowEndConfirm(false)}>
              Continue Session
            </Button>
            <Button variant="danger" onClick={handleEndSession}>
              End Session
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function WorkingSessionPage() {
  return (
    <WorkingSessionProvider>
      <WorkingSessionContent />
    </WorkingSessionProvider>
  );
}
