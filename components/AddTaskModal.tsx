'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AddTaskModalProps {
  open: boolean;
  initialType?: 'oneday' | 'daily';
  editingTask?: { id: string; title: string; description?: string; type: 'oneday' | 'daily' } | null;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string; type: 'oneday' | 'daily' }) => void;
}

export default function AddTaskModal({ open, initialType = 'oneday', editingTask, onClose, onSubmit }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'oneday' | 'daily'>(initialType);
  const [error, setError] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (editingTask) {
        setTitle(editingTask.title);
        setDescription(editingTask.description || '');
        setType(editingTask.type);
      } else {
        setTitle('');
        setDescription('');
        setType(initialType);
      }
      setError('');
      setTimeout(() => titleRef.current?.focus(), 50);
    }
  }, [open, editingTask, initialType]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title.');
      titleRef.current?.focus();
      return;
    }
    onSubmit({ title: title.trim(), description: description.trim() || undefined, type });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 animate-[slideUp_0.2s_ease]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Task Title *</label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g., Morning run"
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            />
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Description (optional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Category</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('oneday')}
                className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                  type === 'oneday'
                    ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-indigo-500/20'
                    : 'bg-background border-border text-card-foreground hover:bg-muted'
                }`}
              >
                📅 One-Day Task
              </button>
              <button
                type="button"
                onClick={() => setType('daily')}
                className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                  type === 'daily'
                    ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-indigo-500/20'
                    : 'bg-background border-border text-card-foreground hover:bg-muted'
                }`}
              >
                🔁 Daily Habit
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-indigo-500/20 hover:opacity-90 transition"
            >
              {editingTask ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
