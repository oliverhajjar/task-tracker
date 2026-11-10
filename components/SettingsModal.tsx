'use client';

import React from 'react';

interface SettingsModalProps {
  open: boolean;
  theme: 'light' | 'dark';
  userName: string;
  onClose: () => void;
  onToggleTheme: () => void;
  onSetUserName: (name: string) => void;
  onClearAll: () => void;
}

export default function SettingsModal({ open, theme, userName, onClose, onToggleTheme, onSetUserName, onClearAll }: SettingsModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Settings</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Your name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => onSetUserName(e.target.value)}
              placeholder="e.g., Alex"
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
            <div>
              <p className="text-sm font-semibold">Theme</p>
              <p className="text-xs text-muted-foreground">{theme === 'dark' ? 'Dark mode' : 'Light mode'}</p>
            </div>
            <button
              onClick={onToggleTheme}
              className="px-3 py-1.5 rounded-lg bg-muted text-sm font-semibold hover:bg-border transition"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          <div className="border-t border-border pt-4">
            <button
              onClick={() => {
                if (confirm('This will delete all tasks and reset progress. Continue?')) {
                  onClearAll();
                  onClose();
                }
              }}
              className="w-full py-2.5 rounded-xl border border-rose-500/40 text-rose-500 text-sm font-semibold hover:bg-rose-500/10 transition"
            >
              Clear all data
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground text-center">
            Keyboard: <kbd className="px-1.5 py-0.5 rounded bg-muted">N</kbd> new task · <kbd className="px-1.5 py-0.5 rounded bg-muted">Esc</kbd> close
          </p>
        </div>
      </div>
    </div>
  );
}
