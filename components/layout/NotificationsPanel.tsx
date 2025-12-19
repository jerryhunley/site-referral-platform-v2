'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  UserPlus,
  Calendar,
  MessageSquare,
  AlertCircle,
  Check,
  Trash2,
  X,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

interface Notification {
  id: string;
  type: 'new_referral' | 'appointment' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  avatar?: { firstName: string; lastName: string };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'new_referral',
    title: 'New Referral',
    message: 'Michael Chen submitted interest in Diabetes Prevention Study',
    timestamp: '5 minutes ago',
    read: false,
    avatar: { firstName: 'Michael', lastName: 'Chen' },
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Appointment Reminder',
    message: 'Sarah Wilson has an appointment in 30 minutes',
    timestamp: '25 minutes ago',
    read: false,
    avatar: { firstName: 'Sarah', lastName: 'Wilson' },
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    message: 'Emily Davis replied to your SMS',
    timestamp: '1 hour ago',
    read: false,
    avatar: { firstName: 'Emily', lastName: 'Davis' },
  },
  {
    id: '4',
    type: 'system',
    title: 'Weekly Report Ready',
    message: 'Your weekly performance report is now available',
    timestamp: '2 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'new_referral',
    title: 'New Referral',
    message: 'Robert Garcia submitted interest in Hypertension Study',
    timestamp: '3 hours ago',
    read: true,
    avatar: { firstName: 'Robert', lastName: 'Garcia' },
  },
];

const typeIcons = {
  new_referral: UserPlus,
  appointment: Calendar,
  message: MessageSquare,
  system: AlertCircle,
};

const typeColors = {
  new_referral: 'text-mint bg-mint/10',
  appointment: 'text-vista-blue bg-vista-blue/10',
  message: 'text-purple-500 bg-purple-500/10',
  system: 'text-amber-500 bg-amber-500/10',
};

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div ref={panelRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-muted hover:text-text-primary glass-hover rounded-xl transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-xs font-medium text-white bg-error rounded-full"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-96 glass-panel rounded-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-glass-border">
              <h3 className="font-semibold text-text-primary">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-mint hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="p-1 text-text-muted hover:text-error transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-text-muted">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-glass-border">
                  {notifications.map((notification) => {
                    const Icon = typeIcons[notification.type];
                    const colorClass = typeColors[notification.type];

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`relative p-4 glass-hover ${
                          !notification.read ? 'bg-mint/5' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          {notification.avatar ? (
                            <Avatar
                              firstName={notification.avatar.firstName}
                              lastName={notification.avatar.lastName}
                              size="sm"
                            />
                          ) : (
                            <div className={`p-2 rounded-lg ${colorClass}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium text-text-primary text-sm">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-mint flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-sm text-text-muted mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-text-muted mt-1">
                              {notification.timestamp}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-text-muted hover:text-mint transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 text-text-muted hover:text-error transition-colors"
                            title="Delete"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-glass-border text-center">
                <button className="text-sm text-mint hover:underline">
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
