'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronDown } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
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

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const maxLength = 160;
  const charCount = newMessage.length;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [newMessage]);

  const handleSend = () => {
    if (newMessage.trim() && !disabled) {
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

  return (
    <div className="p-4 border-t border-white/10">
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
          className={`p-2.5 rounded-xl transition-colors shrink-0 ${
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
            maxLength={maxLength * 2}
            rows={1}
            disabled={disabled}
            className="
              w-full px-4 py-2.5
              bg-white/40 dark:bg-white/10 backdrop-blur-sm
              border border-white/50 dark:border-white/10
              rounded-xl
              text-text-primary text-sm
              placeholder:text-text-muted
              resize-none
              focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint
              disabled:opacity-50 disabled:cursor-not-allowed
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

        <button
          onClick={handleSend}
          disabled={!newMessage.trim() || disabled}
          className="p-2.5 shrink-0 rounded-xl bg-mint hover:bg-mint/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
