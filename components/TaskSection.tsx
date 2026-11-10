'use client';

import React from 'react';
import TaskItem from './TaskItem';
import { Task } from '@/types/task';

interface TaskSectionProps {
  title: string;
  subtitle?: string;
  icon: string;
  accent: string;
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  justCompletedIds: Set<string>;
  emptyTitle: string;
  emptyHint: string;
}

export default function TaskSection({
  title,
  subtitle,
  icon,
  accent,
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onAdd,
  justCompletedIds,
  emptyTitle,
  emptyHint,
}: TaskSectionProps) {
  const active = tasks.filter((t) => (t.type === 'daily' ? !t.dailyCompleted : !t.completed));
  const done = tasks.filter((t) => (t.type === 'daily' ? t.dailyCompleted : t.completed));

  return (
    <section className="glass-panel p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${accent}`}>
            {icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-bold leading-tight">{title}</h2>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            {tasks.length === 0 ? '0 tasks' : `${active.length} left · ${done.length} done`}
          </span>
          <button
            onClick={onAdd}
            className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/20 hover:opacity-90 transition sm:hidden"
            aria-label={`Add to ${title}`}
          >
            +
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="text-4xl mb-2 opacity-60">✨</div>
          <p className="text-sm font-semibold text-card-foreground">{emptyTitle}</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">{emptyHint}</p>
          <button
            onClick={onAdd}
            className="mt-4 px-4 py-2 rounded-xl border border-dashed border-border bg-muted/40 hover:bg-muted text-sm font-medium transition"
          >
            + Add your first task
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {active.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              justCompleted={justCompletedIds.has(t.id)}
            />
          ))}
          {done.length > 0 && (
            <>
              <div className="flex items-center gap-2 pt-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Completed · {done.length}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              {done.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  justCompleted={justCompletedIds.has(t.id)}
                />
              ))}
            </>
          )}
        </div>
      )}
    </section>
  );
}
