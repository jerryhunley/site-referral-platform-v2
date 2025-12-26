'use client';

import { motion } from 'framer-motion';
import { Check, CheckCheck } from 'lucide-react';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  animationDelay?: number;
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function MessageBubble({ message, animationDelay = 0 }: MessageBubbleProps) {
  const isOutbound = message.direction === 'outbound';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      className={cn('flex', isOutbound ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[80%] px-4 py-2.5 rounded-2xl',
          isOutbound
            ? 'bg-mint text-white rounded-br-md'
            : 'bg-white/50 dark:bg-white/10 backdrop-blur-sm text-text-primary rounded-bl-md'
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div
          className={cn(
            'flex items-center gap-1 mt-1',
            isOutbound ? 'justify-end text-white/70' : 'text-text-muted'
          )}
        >
          <span className="text-xs">{formatTime(message.sentAt)}</span>
          {isOutbound && (
            <>
              {message.status === 'read' ? (
                <CheckCheck className="w-3.5 h-3.5" />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="w-3.5 h-3.5 opacity-70" />
              ) : message.status === 'failed' ? (
                <span className="text-xs text-red-300">Failed</span>
              ) : (
                <Check className="w-3.5 h-3.5 opacity-70" />
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
