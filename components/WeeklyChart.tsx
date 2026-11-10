'use client';

import React from 'react';
import { daysAgo, formatDateShort } from '@/utils/date';
import { ActivityEntry } from '@/types/task';

interface WeeklyChartProps {
  activityLog: Record<string, ActivityEntry>;
}

export default function WeeklyChart({ activityLog }: WeeklyChartProps) {
  const days = Array.from({ length: 7 }, (_, i) => 6 - i).reverse(); // 6..0
  const entries = days.map((n) => {
    const key = daysAgo(n);
    const e = activityLog[key];
    const pct = e && e.total > 0 ? Math.round((e.completed / e.total) * 100) : 0;
    return { key, n, pct, completed: e?.completed ?? 0, total: e?.total ?? 0, label: formatDateShort(new Date(key + 'T00:00:00')) };
  });

  const max = 100;

  return (
    <div className="glass-panel p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">Weekly Activity</h3>
        <span className="text-[11px] text-muted-foreground">Last 7 days</span>
      </div>
      <div className="flex items-end justify-between gap-2 h-32">
        {entries.map((e) => (
          <div key={e.key} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-violet-400 transition-all duration-500 ease-out relative group"
                style={{ height: `${Math.max(4, (e.pct / max) * 100)}%` }}
                title={`${e.completed}/${e.total} completed`}
              >
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                  {e.pct}%
                </span>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">{e.label.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
