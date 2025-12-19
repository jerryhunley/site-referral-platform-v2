'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Note } from '@/lib/types';

interface NotesPanelProps {
  notes: Note[];
  onAdd: (content: string) => void;
  onEdit: (noteId: string, content: string) => void;
  onDelete: (noteId: string) => void;
  currentUserId: string;
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function NotesPanel({
  notes,
  onAdd,
  onEdit,
  onDelete,
  currentUserId,
}: NotesPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleAdd = () => {
    if (newNote.trim()) {
      onAdd(newNote.trim());
      setNewNote('');
      setIsAdding(false);
    }
  };

  const handleStartEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    if (editingId && editContent.trim()) {
      onEdit(editingId, editContent.trim());
      setEditingId(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <GlassCard padding="lg" animate={false}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Notes</h3>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAdding(true)}
          >
            Add Note
          </Button>
        )}
      </div>

      {/* Add Note Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a note..."
              rows={3}
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  setNewNote('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAdd}
                disabled={!newNote.trim()}
              >
                Save Note
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes List */}
      {sortedNotes.length === 0 && !isAdding ? (
        <EmptyState
          type="no-notes"
          title="No notes yet"
          description="Add a note to keep track of important details"
          action={
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAdding(true)}
            >
              Add First Note
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {sortedNotes.map((note, index) => {
            const isEditing = editingId === note.id;
            const canEdit = note.authorId === currentUserId;
            const authorName = note.authorName.split(' ');

            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group"
              >
                {isEditing ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      autoFocus
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<X className="w-4 h-4" />}
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Save className="w-4 h-4" />}
                        onClick={handleSaveEdit}
                        disabled={!editContent.trim()}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Avatar
                      firstName={authorName[0]}
                      lastName={authorName[1]}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary text-sm">
                          {note.authorName}
                        </span>
                        <span className="text-xs text-text-muted">
                          {formatTimestamp(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1 whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>

                    {/* Actions */}
                    {canEdit && (
                      <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(note)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary glass-hover transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(note.id)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
