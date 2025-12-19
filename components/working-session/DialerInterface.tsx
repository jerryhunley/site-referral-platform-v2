'use client';

import { motion } from 'framer-motion';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  User,
  Calendar,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import type { Referral } from '@/lib/types';
import { statusConfigs } from '@/lib/types';
import { mockStudies } from '@/lib/mock-data/studies';

interface DialerInterfaceProps {
  lead: Referral;
  isCallActive: boolean;
  callDuration: number;
  onStartCall: () => void;
  onEndCall: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function DialerInterface({
  lead,
  isCallActive,
  callDuration,
  onStartCall,
  onEndCall,
}: DialerInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const study = mockStudies.find((s) => s.id === lead.studyId);
  const statusConfig = statusConfigs[lead.status];

  return (
    <GlassCard padding="lg" className="text-center">
      {/* Lead Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Avatar
          firstName={lead.firstName}
          lastName={lead.lastName}
          size="xl"
          className="mx-auto mb-4"
        />

        <h2 className="text-2xl font-bold text-text-primary">
          {lead.firstName} {lead.lastName}
        </h2>

        <p className="text-xl text-text-secondary mt-1">
          {formatPhone(lead.phone)}
        </p>

        <div className="flex items-center justify-center gap-3 mt-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bgClass} ${statusConfig.textClass}`}
          >
            {statusConfig.label}
          </span>
          <span className="text-text-muted">•</span>
          <span className="text-text-secondary">{study?.name}</span>
        </div>
      </motion.div>

      {/* Call Timer */}
      {isCallActive && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-mint/10 rounded-2xl">
            <motion.div
              className="w-3 h-3 rounded-full bg-mint"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <span className="text-3xl font-mono font-bold text-mint">
              {formatDuration(callDuration)}
            </span>
          </div>
        </motion.div>
      )}

      {/* Call Controls */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {isCallActive ? (
          <>
            {/* Mute */}
            <motion.button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-4 rounded-full transition-colors ${
                isMuted
                  ? 'bg-warning/20 text-warning'
                  : 'bg-white/40 dark:bg-white/10 backdrop-blur-sm text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/15'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </motion.button>

            {/* End Call */}
            <motion.button
              onClick={onEndCall}
              className="p-6 rounded-full bg-error text-white hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PhoneOff className="w-8 h-8" />
            </motion.button>

            {/* Speaker */}
            <motion.button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`p-4 rounded-full transition-colors ${
                isSpeakerOn
                  ? 'bg-vista-blue/20 text-vista-blue'
                  : 'bg-white/40 dark:bg-white/10 backdrop-blur-sm text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/15'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </motion.button>
          </>
        ) : (
          <motion.button
            onClick={onStartCall}
            className="p-6 rounded-full bg-mint text-white hover:bg-mint-dark transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Phone className="w-8 h-8" />
          </motion.button>
        )}
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-glass-border">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm mb-2">
            <Calendar className="w-5 h-5 text-text-muted" />
          </div>
          <p className="text-xs text-text-muted">Submitted</p>
          <p className="text-sm font-medium text-text-primary">
            {new Date(lead.submittedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm mb-2">
            <Clock className="w-5 h-5 text-text-muted" />
          </div>
          <p className="text-xs text-text-muted">Last Contact</p>
          <p className="text-sm font-medium text-text-primary">
            {lead.lastContactedAt
              ? new Date(lead.lastContactedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'Never'}
          </p>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm mb-2">
            <MessageSquare className="w-5 h-5 text-text-muted" />
          </div>
          <p className="text-xs text-text-muted">Messages</p>
          <p className="text-sm font-medium text-text-primary">
            {lead.messages.length}
          </p>
        </div>
      </div>

      {/* Call Tip */}
      {!isCallActive && (
        <p className="text-sm text-text-muted mt-6">
          Click the green button to start tracking your call
        </p>
      )}
    </GlassCard>
  );
}
