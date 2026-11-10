'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Task } from '@/types/task';
import { loadState, saveState, newId, defaultState } from '@/utils/storage';
import { todayKey, greetingForHour, formatDateLong } from '@/utils/date';
import Navbar from './Navbar';
import TaskSection from './TaskSection';
import AddTaskModal from './AddTaskModal';
import SettingsModal from './SettingsModal';
import ProgressRing from './ProgressRing';
import WeeklyChart from './WeeklyChart';

export default function Dashboard() {
  const [state, setState] = useState<AppState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalDefaultType, setModalDefaultType] = useState<'oneday' | 'daily'>('oneday');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [justCompleted, setJustCompleted] = useState<Set<string>>(new Set());
  const [celebrating, setCelebrating] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);
  const prevAllCompleteRef = useRef<boolean>(false);

  // Load state
  useEffect(() => {
    let s = loadState();
    // apply daily reset if needed
    s = applyDailyReset(s);
    setState(s);
    setIsLoaded(true);
  }, []);

  // Apply theme class
  useEffect(() => {
    if (!state) return;
    if (state.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [state?.theme]);

  // Persist
  useEffect(() => {
    if (isLoaded && state) saveState(state);
  }, [state, isLoaded]);

  // Daily reset scheduler
  useEffect(() => {
    if (!isLoaded) return;
    const check = () => {
      setState((prev) => (prev ? applyDailyReset(prev) : prev));
    };
    const scheduleMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 1, 0);
      const ms = tomorrow.getTime() - now.getTime();
      return setTimeout(() => {
        check();
        timer = scheduleMidnight();
      }, ms);
    };
    let timer = scheduleMidnight();
    const interval = setInterval(check, 60 * 1000);
    const onVis = () => { if (document.visibilityState === 'visible') check(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', check);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', check);
    };
  }, [isLoaded]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (modalOpen || settingsOpen) return;
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        openAdd('oneday');
      } else if (e.key === 'Escape') {
        setModalOpen(false);
        setSettingsOpen(false);
        setEditingTask(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, settingsOpen]);

  const applyTheme = useCallback((theme: 'light' | 'dark') => {
    setState((prev) => (prev ? { ...prev, theme } : prev));
  }, []);

  const openAdd = (type: 'oneday' | 'daily' = 'oneday') => {
    setEditingTask(null);
    setModalDefaultType(type);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalDefaultType(task.type);
    setModalOpen(true);
  };

  // Computed stats
  const oneDayTasks = state?.oneDayTasks ?? [];
  const dailyTasks = state?.dailyTasks ?? [];

  const todayTotal = oneDayTasks.length + dailyTasks.length;
  const todayCompleted =
    oneDayTasks.filter((t) => t.completed).length + dailyTasks.filter((t) => t.dailyCompleted).length;
  const todayRemaining = todayTotal - todayCompleted;
  const dailyCompletedCount = dailyTasks.filter((t) => t.dailyCompleted).length;
  const dailyPct = dailyTasks.length > 0 ? (dailyCompletedCount / dailyTasks.length) * 100 : 0;
  const allComplete = todayTotal > 0 && todayCompleted === todayTotal;

  const streak = useMemo(() => computeStreak(state?.dailyAllCompleted ?? {}), [state?.dailyAllCompleted]);

  // Celebration on all complete
  useEffect(() => {
    if (allComplete && !prevAllCompleteRef.current) {
      setCelebrating(true);
      fireConfetti();
      const t = setTimeout(() => setCelebrating(false), 2500);
      return () => clearTimeout(t);
    }
    prevAllCompleteRef.current = allComplete;
  }, [allComplete]);

  const fireConfetti = () => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.4 + 's';
      piece.style.animationDuration = 1.2 + Math.random() * 1.2 + 's';
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(piece);
    }
    setTimeout(() => container.remove(), 2800);
  };

  const handleToggleOneDay = (id: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const tasks = prev.oneDayTasks.map((t) => {
        if (t.id !== id) return t;
        const nowCompleted = !t.completed;
        flashCompleted(id, nowCompleted);
        return { ...t, completed: nowCompleted, completedAt: nowCompleted ? new Date().toISOString() : undefined };
      });
      return { ...prev, oneDayTasks: tasks };
    });
  };

  const handleToggleDaily = (id: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const tasks = prev.dailyTasks.map((t) => {
        if (t.id !== id) return t;
        const nowCompleted = !t.dailyCompleted;
        flashCompleted(id, nowCompleted);
        return { ...t, dailyCompleted: nowCompleted };
      });
      const completedCount = tasks.filter((t) => t.dailyCompleted).length;
      const allDone = tasks.length > 0 && completedCount === tasks.length;
      const today = todayKey();
      const dailyAllCompleted = { ...prev.dailyAllCompleted };
      if (tasks.length > 0) dailyAllCompleted[today] = allDone;
      const activityLog = { ...prev.activityLog };
      activityLog[today] = { completed: completedCount, total: tasks.length };
      return { ...prev, dailyTasks: tasks, dailyAllCompleted, activityLog };
    });
  };

  const flashCompleted = (id: string, done: boolean) => {
    if (!done) return;
    setJustCompleted((s) => new Set(s).add(id));
    setTimeout(() => {
      setJustCompleted((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }, 500);
  };

  const handleDelete = (id: string, type: 'oneday' | 'daily') => {
    setState((prev) => {
      if (!prev) return prev;
      if (type === 'oneday') return { ...prev, oneDayTasks: prev.oneDayTasks.filter((t) => t.id !== id) };
      const dailyTasks = prev.dailyTasks.filter((t) => t.id !== id);
      const today = todayKey();
      const activityLog = { ...prev.activityLog };
      activityLog[today] = { completed: dailyTasks.filter((t) => t.dailyCompleted).length, total: dailyTasks.length };
      return { ...prev, dailyTasks, activityLog };
    });
  };

  const handleAddOrEdit = (data: { title: string; description?: string; type: 'oneday' | 'daily' }) => {
    setState((prev) => {
      if (!prev) return prev;
      if (editingTask) {
        // apply type change if category changed
        const newType = data.type;
        const updated: Task = { ...editingTask, title: data.title, description: data.description, type: newType };
        if (newType === 'oneday') {
          // move from daily to oneday if needed
          const dailyTasks = prev.dailyTasks.filter((t) => t.id !== editingTask.id);
          const oneDayTasks = [updated, ...prev.oneDayTasks.filter((t) => t.id !== editingTask.id)];
          // reset dailyCompleted not relevant
          updated.completed = editingTask.type === 'oneday' ? editingTask.completed : false;
          updated.dailyCompleted = false;
          return { ...prev, oneDayTasks, dailyTasks };
        } else {
          const oneDayTasks = prev.oneDayTasks.filter((t) => t.id !== editingTask.id);
          const dailyTasks = [updated, ...prev.dailyTasks.filter((t) => t.id !== editingTask.id)];
          updated.dailyCompleted = editingTask.type === 'daily' ? editingTask.dailyCompleted : false;
          updated.completed = false;
          return { ...prev, oneDayTasks, dailyTasks };
        }
      }
      const newTask: Task = {
        id: newId(),
        type: data.type,
        title: data.title,
        description: data.description,
        createdAt: new Date().toISOString(),
        completed: false,
        dailyCompleted: false,
      };
      if (data.type === 'oneday') {
        return { ...prev, oneDayTasks: [newTask, ...prev.oneDayTasks] };
      }
      const dailyTasks = [newTask, ...prev.dailyTasks];
      const today = todayKey();
      const activityLog = { ...prev.activityLog };
      activityLog[today] = { completed: dailyTasks.filter((t) => t.dailyCompleted).length, total: dailyTasks.length };
      return { ...prev, dailyTasks, activityLog };
    });
    setEditingTask(null);
  };

  const handleClearAll = () => {
    setState(defaultState());
  };

  const handleSetUserName = (name: string) => {
    setState((prev) => (prev ? { ...prev, userName: name } : prev));
  };

  const handleToggleTheme = () => {
    setState((prev) => (prev ? { ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' } : prev));
  };

  if (!isLoaded || !state) {
    return <SkeletonDashboard />;
  }

  const hour = new Date().getHours();
  const greeting = greetingForHour(hour);
  const name = state.userName?.trim();
  const progressPct = todayTotal > 0 ? (todayCompleted / todayTotal) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        theme={state.theme}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAdd={() => openAdd('oneday')}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Welcome */}
        <section className="glass-panel p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{formatDateLong()}</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                {greeting}{name ? `, ${name}` : ''}! 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-md">
                {allComplete && todayTotal > 0
                  ? 'All tasks done — enjoy your day! 🎉'
                  : todayTotal === 0
                  ? 'Add your first task to get started.'
                  : `You have ${todayRemaining} task${todayRemaining === 1 ? '' : 's'} left today. Keep going!`}
              </p>
              <div className="mt-3 h-2 w-full max-w-sm bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ProgressRing value={progressPct} size={110} stroke={9} label="Today" />
            </div>
          </div>
        </section>

        {/* Stats row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Completed" value={todayCompleted} color="text-emerald-500" icon="✅" />
          <StatCard label="Remaining" value={todayRemaining} color="text-amber-500" icon="⏳" />
          <StatCard label="Daily Habits" value={`${dailyCompletedCount}/${dailyTasks.length}`} color="text-indigo-500" icon="🔁" />
          <StatCard label="Streak" value={`${streak}🔥`} color="text-rose-500" icon="📈" />
        </section>

        {/* Task sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <TaskSection
            title="Today's Tasks"
            subtitle="One-day tasks for today"
            icon="📅"
            accent="bg-indigo-500/15 text-indigo-500"
            tasks={oneDayTasks}
            onToggle={handleToggleOneDay}
            onEdit={openEdit}
            onDelete={(id) => handleDelete(id, 'oneday')}
            onAdd={() => openAdd('oneday')}
            justCompletedIds={justCompleted}
            emptyTitle="No tasks for today"
            emptyHint="Add a one-day task to get started."
          />
          <TaskSection
            title="Daily Habits"
            subtitle="Tasks you do every day"
            icon="🔁"
            accent="bg-violet-500/15 text-violet-500"
            tasks={dailyTasks}
            onToggle={handleToggleDaily}
            onEdit={openEdit}
            onDelete={(id) => handleDelete(id, 'daily')}
            onAdd={() => openAdd('daily')}
            justCompletedIds={justCompleted}
            emptyTitle="No daily habits yet"
            emptyHint="Build consistency with daily habits."
          />
        </div>

        {/* Progress & stats */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="glass-panel p-4 sm:p-5 flex flex-col items-center justify-center gap-3">
            <h3 className="text-sm font-bold self-start">Daily Habits Progress</h3>
            <ProgressRing value={dailyPct} size={130} stroke={11} label="Habits" />
            <p className="text-xs text-muted-foreground text-center">
              {dailyCompletedCount} of {dailyTasks.length} habits completed today
            </p>
          </div>
          <div className="lg:col-span-2">
            <WeeklyChart activityLog={state.activityLog} />
          </div>
        </section>

        {/* Daily habits completion percentage bar */}
        <section className="glass-panel p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold">Today's Overall Progress</h3>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{Math.round(progressPct)}%</span>
          </div>
          <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
            <span>{todayCompleted} completed</span>
            <span>{todayRemaining} remaining</span>
          </div>
        </section>
      </main>

      {/* Floating Add button (mobile) */}
      <button
        onClick={() => openAdd('oneday')}
        className="sm:hidden fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl shadow-indigo-500/40 flex items-center justify-center text-2xl font-bold hover:opacity-90 transition"
        aria-label="Add task"
      >
        +
      </button>

      <AddTaskModal
        open={modalOpen}
        initialType={modalDefaultType}
        editingTask={editingTask ? { id: editingTask.id, title: editingTask.title, description: editingTask.description, type: editingTask.type } : null}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSubmit={handleAddOrEdit}
      />

      <SettingsModal
        open={settingsOpen}
        theme={state.theme}
        userName={state.userName}
        onClose={() => setSettingsOpen(false)}
        onToggleTheme={handleToggleTheme}
        onSetUserName={handleSetUserName}
        onClearAll={handleClearAll}
      />

      {celebrating && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: string }) {
  return (
    <div className="glass-panel p-4 transition-transform hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        <span className="text-base">{icon}</span>
      </div>
      <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

function SkeletonDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-16 border-b border-border" />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="glass-panel p-6 space-y-3">
          <div className="skeleton h-4 w-40" />
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-4 w-80" />
          <div className="skeleton h-2 w-full max-w-sm" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[0,1,2,3].map((i) => <div key={i} className="glass-panel p-4"><div className="skeleton h-3 w-20 mb-2" /><div className="skeleton h-7 w-12" /></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0,1].map((i) => (
            <div key={i} className="glass-panel p-5 space-y-3">
              <div className="skeleton h-6 w-40" />
              {[0,1,2].map((j) => <div key={j} className="skeleton h-14 w-full" />)}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function applyDailyReset(s: AppState): AppState {
  const today = todayKey();
  if (s.lastDailyResetDate === today) return s;
  // reset daily tasks
  const dailyTasks = s.dailyTasks.map((t) => ({ ...t, dailyCompleted: false }));
  // record? previous day already tracked via toggles
  return { ...s, dailyTasks, lastDailyResetDate: today };
}

function computeStreak(dailyAllCompleted: Record<string, boolean>): number {
  let streak = 0;
  const d = new Date();
  // decide starting day
  const today = todayKey(d);
  let cur = new Date(d);
  if (!dailyAllCompleted[today]) {
    cur.setDate(cur.getDate() - 1);
  }
  // walk back
  for (let i = 0; i < 365; i++) {
    const key = todayKey(cur);
    if (dailyAllCompleted[key]) {
      streak++;
      cur.setDate(cur.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
