'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { Referral, ReferralStatus } from '@/lib/types';

type SessionPhase = 'setup' | 'active' | 'completed';

interface CallOutcome {
  referralId: string;
  status: ReferralStatus;
  note?: string;
  duration: number; // seconds
  timestamp: string;
}

interface WorkingSession {
  id: string;
  phase: SessionPhase;
  leads: Referral[];
  currentIndex: number;
  completedCalls: CallOutcome[];
  skippedIds: string[];
  startTime: string | null;
  endTime: string | null;
  totalCallTime: number; // seconds
}

interface WorkingSessionContextValue {
  session: WorkingSession | null;
  currentLead: Referral | null;
  isCallActive: boolean;
  callDuration: number;

  // Session management
  startSession: (leads: Referral[]) => void;
  endSession: () => void;

  // Call management
  startCall: () => void;
  endCall: () => void;

  // Lead management
  recordOutcome: (status: ReferralStatus, note?: string) => void;
  skipLead: () => void;
  goToNextLead: () => void;
  goToPreviousLead: () => void;

  // Stats
  getSessionStats: () => {
    totalLeads: number;
    completedCalls: number;
    skippedCount: number;
    remainingCount: number;
    totalDuration: number;
    averageCallTime: number;
    outcomeBreakdown: Record<ReferralStatus, number>;
  };
}

const WorkingSessionContext = createContext<WorkingSessionContextValue | null>(null);

export function useWorkingSession() {
  const context = useContext(WorkingSessionContext);
  if (!context) {
    throw new Error('useWorkingSession must be used within a WorkingSessionProvider');
  }
  return context;
}

interface WorkingSessionProviderProps {
  children: ReactNode;
}

export function WorkingSessionProvider({ children }: WorkingSessionProviderProps) {
  const [session, setSession] = useState<WorkingSession | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Timer for active call
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCallActive && callStartTime) {
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive, callStartTime]);

  const currentLead = session?.leads[session.currentIndex] || null;

  const startSession = useCallback((leads: Referral[]) => {
    setSession({
      id: `session-${Date.now()}`,
      phase: 'active',
      leads,
      currentIndex: 0,
      completedCalls: [],
      skippedIds: [],
      startTime: new Date().toISOString(),
      endTime: null,
      totalCallTime: 0,
    });
  }, []);

  const endSession = useCallback(() => {
    setSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        phase: 'completed',
        endTime: new Date().toISOString(),
      };
    });
    setIsCallActive(false);
    setCallStartTime(null);
    setCallDuration(0);
  }, []);

  const startCall = useCallback(() => {
    setIsCallActive(true);
    setCallStartTime(Date.now());
    setCallDuration(0);
  }, []);

  const endCall = useCallback(() => {
    setIsCallActive(false);
    setCallStartTime(null);
    // Don't reset duration - we need it for recording
  }, []);

  const recordOutcome = useCallback((status: ReferralStatus, note?: string) => {
    if (!session || !currentLead) return;

    const outcome: CallOutcome = {
      referralId: currentLead.id,
      status,
      note,
      duration: callDuration,
      timestamp: new Date().toISOString(),
    };

    setSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        completedCalls: [...prev.completedCalls, outcome],
        totalCallTime: prev.totalCallTime + callDuration,
      };
    });

    setCallDuration(0);
  }, [session, currentLead, callDuration]);

  const skipLead = useCallback(() => {
    if (!session || !currentLead) return;

    setSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        skippedIds: [...prev.skippedIds, currentLead.id],
      };
    });
  }, [session, currentLead]);

  const goToNextLead = useCallback(() => {
    setSession((prev) => {
      if (!prev) return null;
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.leads.length) {
        // Session complete
        return {
          ...prev,
          phase: 'completed',
          endTime: new Date().toISOString(),
        };
      }
      return {
        ...prev,
        currentIndex: nextIndex,
      };
    });
    setIsCallActive(false);
    setCallStartTime(null);
    setCallDuration(0);
  }, []);

  const goToPreviousLead = useCallback(() => {
    setSession((prev) => {
      if (!prev || prev.currentIndex === 0) return prev;
      return {
        ...prev,
        currentIndex: prev.currentIndex - 1,
      };
    });
  }, []);

  const getSessionStats = useCallback(() => {
    if (!session) {
      return {
        totalLeads: 0,
        completedCalls: 0,
        skippedCount: 0,
        remainingCount: 0,
        totalDuration: 0,
        averageCallTime: 0,
        outcomeBreakdown: {} as Record<ReferralStatus, number>,
      };
    }

    const outcomeBreakdown = session.completedCalls.reduce((acc, call) => {
      acc[call.status] = (acc[call.status] || 0) + 1;
      return acc;
    }, {} as Record<ReferralStatus, number>);

    const completedCount = session.completedCalls.length;
    const totalDuration = session.totalCallTime;

    return {
      totalLeads: session.leads.length,
      completedCalls: completedCount,
      skippedCount: session.skippedIds.length,
      remainingCount: session.leads.length - session.currentIndex - 1,
      totalDuration,
      averageCallTime: completedCount > 0 ? Math.round(totalDuration / completedCount) : 0,
      outcomeBreakdown,
    };
  }, [session]);

  return (
    <WorkingSessionContext.Provider
      value={{
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
        goToPreviousLead,
        getSessionStats,
      }}
    >
      {children}
    </WorkingSessionContext.Provider>
  );
}
