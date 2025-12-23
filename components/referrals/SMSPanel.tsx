'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronDown, Check, CheckCheck } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import type { Message } from '@/lib/types';

interface SMSPanelProps {
  messages: Message[];
  onSend: (message: string) => void;
  referralName: string;
}

const smsTemplates = [
  {
    value: 'intro',
    label: 'Introduction',
    text: "Hi! This is [Coordinator] from Orlando Clinical Research. I'm reaching out about a clinical trial you expressed interest in. When would be a good time to chat?",
  },
  {
    value: 'follow_up',
    label: 'Follow Up',
    text: "Hi! Just following up on our previous conversation about the clinical trial. Do you have any questions I can help answer?",
  },
  {
    value: 'appointment_reminder',
    label: 'Appointment Reminder',
    text: "Hi! This is a friendly reminder about your upcoming appointment at Orlando Clinical Research. Please let us know if you need to reschedule.",
  },
  {
    value: 'reschedule',
    label: 'Reschedule',
    text: "Hi! I noticed we haven't been able to connect. Would you like to reschedule for a time that works better for you?",
  },
];

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function groupMessagesByDate(messages: Message[]): Map<string, Message[]> {
  const groups = new Map<string, Message[]>();

  messages.forEach((message) => {
    const dateKey = new Date(message.sentAt).toDateString();
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(message);
  });

  return groups;
}

export function SMSPanel({ messages, onSend, referralName }: SMSPanelProps) {
  const [newMessage, setNewMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 160;
  const charCount = newMessage.length;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [newMessage]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSend(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTemplateSelect = (templateValue: string) => {
    const template = smsTemplates.find((t) => t.value === templateValue);
    if (template) {
      setNewMessage(template.text);
      setShowTemplates(false);
      textareaRef.current?.focus();
    }
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <GlassCard padding="none" animate={false} className="flex flex-col h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="font-semibold text-text-primary">Messages</h3>
        <span className="text-xs text-text-muted">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="mx-4 dotted-divider" />

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-text-secondary">No messages yet</p>
            <p className="text-sm text-text-muted mt-1">
              Send the first message to {referralName}
            </p>
          </div>
        ) : (
          Array.from(messageGroups.entries()).map(([dateKey, dayMessages]) => (
            <div key={dateKey}>
              {/* Date Separator */}
              <div className="flex items-center justify-center mb-3">
                <span className="px-3 py-1 text-xs text-text-muted bg-white/40 dark:bg-white/10 backdrop-blur-sm rounded-full">
                  {formatDate(dayMessages[0].sentAt)}
                </span>
              </div>

              {/* Messages for this date */}
              <div className="space-y-2">
                {dayMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`flex ${
                      message.direction === 'outbound' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        message.direction === 'outbound'
                          ? 'bg-mint text-white rounded-br-md'
                          : 'bg-white/50 dark:bg-white/10 backdrop-blur-sm text-text-primary rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div
                        className={`flex items-center gap-1 mt-1 ${
                          message.direction === 'outbound'
                            ? 'justify-end text-white/70'
                            : 'text-text-muted'
                        }`}
                      >
                        <span className="text-xs">{formatTime(message.sentAt)}</span>
                        {message.direction === 'outbound' && (
                          <>
                            {message.status === 'read' ? (
                              <CheckCheck className="w-3.5 h-3.5" />
                            ) : message.status === 'delivered' ? (
                              <CheckCheck className="w-3.5 h-3.5 opacity-70" />
                            ) : (
                              <Check className="w-3.5 h-3.5 opacity-70" />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mx-4 dotted-divider" />
      <div className="p-4">
        {/* Templates Dropdown */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-3"
            >
              <div className="grid grid-cols-2 gap-2">
                {smsTemplates.map((template) => (
                  <button
                    key={template.value}
                    onClick={() => handleTemplateSelect(template.value)}
                    className="p-2 text-left text-sm rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-white/15 transition-colors"
                  >
                    <span className="font-medium text-text-primary">
                      {template.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className={`p-2 rounded-xl transition-colors ${
              showTemplates
                ? 'bg-mint/20 text-mint'
                : 'bg-white/40 dark:bg-white/10 backdrop-blur-sm text-text-secondary hover:text-text-primary hover:bg-white/50 dark:hover:bg-white/15'
            }`}
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                showTemplates ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              maxLength={maxLength * 2} // Allow some overflow for long messages
              rows={1}
              className="
                w-full px-4 py-2.5
                bg-white/40 dark:bg-white/10 backdrop-blur-sm
                border border-white/50 dark:border-white/10
                rounded-xl
                text-text-primary text-sm
                placeholder:text-text-muted
                resize-none
                focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint
              "
            />
            <span
              className={`absolute right-3 bottom-2 text-xs ${
                charCount > maxLength ? 'text-warning' : 'text-text-muted'
              }`}
            >
              {charCount}/{maxLength}
            </span>
          </div>

          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="!p-2.5"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
