'use client';

import React, { useState } from 'react';
import { NotificationSettings } from '@/types/task';

interface SettingsModalProps {
  open: boolean;
  theme: 'light' | 'dark';
  userName: string;
  notifSettings: NotificationSettings;
  notifPermission: NotificationPermission | 'default';
  onClose: () => void;
  onToggleTheme: () => void;
  onSetUserName: (name: string) => void;
  onClearAll: () => void;
  onUpdateNotif: (s: Partial<NotificationSettings>) => void;
  onRequestPermission: () => void;
  onTestNotification: () => void;
}

export default function SettingsModal({
  open, theme, userName, notifSettings, notifPermission, onClose, onToggleTheme, onSetUserName, onClearAll, onUpdateNotif, onRequestPermission, onTestNotification,
}: SettingsModalProps) {
  const [tab, setTab] = useState<'general' | 'notifications'>('general');
  if (!open) return null;

  const Toggle = ({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-primary' : 'bg-muted'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Settings</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground">✕</button>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('general')} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${tab === 'general' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>General</button>
          <button onClick={() => setTab('notifications')} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${tab === 'notifications' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>Notifications</button>
        </div>

        {tab === 'general' && (
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
              <button onClick={onToggleTheme} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-semibold hover:bg-border transition">
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
            <div className="border-t border-border pt-4">
              <button
                onClick={() => { if (confirm('This will delete all tasks and reset progress. Continue?')) { onClearAll(); onClose(); } }}
                className="w-full py-2.5 rounded-xl border border-rose-500/40 text-rose-500 text-sm font-semibold hover:bg-rose-500/10 transition"
              >
                Clear all data
              </button>
            </div>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl border border-border bg-background">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Permission status</p>
                  <p className="text-xs text-muted-foreground capitalize">{notifPermission}</p>
                </div>
                {notifPermission !== 'granted' && (
                  <button onClick={onRequestPermission} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                    Enable
                  </button>
                )}
              </div>
              {notifPermission === 'denied' && (
                <p className="text-xs text-rose-500 mt-2">Notifications are blocked. Enable them in your browser settings.</p>
              )}
            </div>

            <Toggle checked={notifSettings.enabled} onChange={(v) => onUpdateNotif({ enabled: v })} label="Enable notifications" desc="Master switch for all reminders" />

            <div className="space-y-3">
              <Toggle checked={notifSettings.oneDayReminders} onChange={(v) => onUpdateNotif({ oneDayReminders: v })} label="One-day task reminders" />
              {notifSettings.oneDayReminders && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">One-day reminder time</label>
                  <input type="time" value={notifSettings.oneDayReminderTime} onChange={(e) => onUpdateNotif({ oneDayReminderTime: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-card-foreground" />
                </div>
              )}
              <Toggle checked={notifSettings.dailyHabitReminders} onChange={(v) => onUpdateNotif({ dailyHabitReminders: v })} label="Daily habit reminders" />
              {notifSettings.dailyHabitReminders && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Daily reminder time</label>
                  <input type="time" value={notifSettings.dailyReminderTime} onChange={(e) => onUpdateNotif({ dailyReminderTime: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-card-foreground" />
                </div>
              )}
              <Toggle checked={notifSettings.secondReminderEnabled} onChange={(v) => onUpdateNotif({ secondReminderEnabled: v })} label="Second reminder" desc="Extra nudge for unfinished tasks" />
              {notifSettings.secondReminderEnabled && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Second reminder time</label>
                  <input type="time" value={notifSettings.secondReminderTime} onChange={(e) => onUpdateNotif({ secondReminderTime: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-card-foreground" />
                </div>
              )}
              <Toggle checked={notifSettings.completionNotifications} onChange={(v) => onUpdateNotif({ completionNotifications: v })} label="Completion notifications" desc="Celebrate when all tasks done" />
            </div>

            <button onClick={onTestNotification} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-indigo-500/20">
              Send test notification
            </button>

            <p className="text-[11px] text-muted-foreground text-center">
              Note: Reminders fire while the app is open. Background push requires a server (not included in this client-only build).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
