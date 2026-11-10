'use client';

import React from 'react';
import { NotificationRecord } from '@/types/task';

interface NotificationCenterProps {
  history: NotificationRecord[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClear: () => void;
}

export default function NotificationCenter({ history, onMarkRead, onMarkAllRead, onClear }: NotificationCenterProps) {
  const unread = history.filter((n) => !n.read).length;
  return (
    <div className="glass-panel p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold">Notification Center</h3>
          {unread > 0 && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">{unread}</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={onMarkAllRead} className="text-xs font-semibold text-muted-foreground hover:text-foreground transition">Mark all read</button>
          <button onClick={onClear} className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition">Clear</button>
        </div>
      </div>
      {history.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">No notifications yet.</p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {history.slice().reverse().map((n) => (
            <div
              key={n.id}
              onClick={() => onMarkRead(n.id)}
              className={`p-3 rounded-xl border cursor-pointer transition ${n.read ? 'bg-background border-border opacity-70' : 'bg-primary/5 border-primary/30'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{n.title}</p>
                <span className="text-[10px] text-muted-foreground shrink-0">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
