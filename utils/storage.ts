import { AppState, Task } from '@/types/task';
import { todayKey } from '@/utils/date';

const STORAGE_KEY = 'dailyflow_state_v1';

export const defaultState = (): AppState => ({
  oneDayTasks: [],
  dailyTasks: [],
  theme: (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light',
  lastDailyResetDate: todayKey(),
  activityLog: {},
  dailyAllCompleted: {},
  userName: '',
});

export const loadState = (): AppState => {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const base = defaultState();
    return {
      ...base,
      ...parsed,
      oneDayTasks: Array.isArray(parsed.oneDayTasks) ? parsed.oneDayTasks : [],
      dailyTasks: Array.isArray(parsed.dailyTasks) ? parsed.dailyTasks : [],
      activityLog: parsed.activityLog && typeof parsed.activityLog === 'object' ? parsed.activityLog : {},
      dailyAllCompleted: parsed.dailyAllCompleted && typeof parsed.dailyAllCompleted === 'object' ? parsed.dailyAllCompleted : {},
    };
  } catch (e) {
    console.error('Failed to load state', e);
    return defaultState();
  }
};

export const saveState = (state: AppState): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
};

export const newId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'id_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
};

export type { Task };
