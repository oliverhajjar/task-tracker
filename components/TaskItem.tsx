'use client';

import React, { useState } from 'react';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  justCompleted?: boolean;
}

export default function TaskItem({ task, onToggle, onEdit, onDelete, justCompleted }: TaskItemProps) {
  const [confirming, setConfirming] = useState(false);
  const isDaily = task.type === 'daily';
  const done = isDaily ? task.dailyCompleted : task.completed;

  return (
    <div
      className={`group relative flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
        done
          ? 'bg-muted/40 border-border/60 opacity-70'
          : 'bg-card border-border hover:border-primary/40 hover:shadow-sm'
      } ${justCompleted ? 'task-just-completed' : ''}`}
    >
      {done && <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-emerald-500" />}

      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark ${task.title} as ${done ? 'incomplete' : 'complete'}`}
        className="task-check mt-1"
      />

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm sm:text-base font-medium leading-snug break-words ${
            done ? 'line-through text-muted-foreground' : 'text-card-foreground'
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className={`text-xs sm:text-sm mt-1 leading-relaxed break-words ${done ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
        <button
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          className="h-8 w-8 rounded-lg border border-border bg-card hover:bg-muted transition flex items-center justify-center text-sm"
        >
          ✏️
        </button>
        {confirming ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => { onDelete(task.id); setConfirming(false); }}
              className="h-8 px-2 rounded-lg bg-rose-500 text-white text-xs font-semibold hover:bg-rose-600 transition"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="h-8 px-2 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            aria-label="Delete task"
            className="h-8 w-8 rounded-lg border border-border bg-card hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-500 transition flex items-center justify-center text-sm"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}
