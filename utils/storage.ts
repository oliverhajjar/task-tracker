import { AppState, Task, NotificationSettings, NotificationRecord } from '@/types/task';
import { todayKey } from '@/utils/date';

const storageKey = (userId: string) => 'tasktracker_data_' + userId;

const defaultNotificationSettings = (): NotificationSettings => ({
  enabled: false,
  dailyReminderTime: '20:00',
  oneDayReminderTime: '09:00',
  secondReminderEnabled: false,
  secondReminderTime: '18:00',
  dailyHabitReminders: true,
  oneDayReminders: true,
  completionNotifications: true,
});

export const defaultState = (): AppState => ({
  oneDayTasks: [],
  dailyTasks: [],
  theme: (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light',
  lastDailyResetDate: todayKey(),
  activityLog: {},
  dailyAllCompleted: {},
  userName: '',
  notifications: {
    settings: defaultNotificationSettings(),
    history: [],
    permission: (typeof window !== 'undefined' && 'Notification' in window) ? Notification.permission : 'default',
    lastSent: {},
  },
});

export const loadState = (userId: string): AppState => {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(storageKey(userId));
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
      notifications: parsed.notifications ? { ...base.notifications, ...parsed.notifications } : base.notifications,
    };
  } catch (e) {
    console.error('Failed to load state', e);
    return defaultState();
  }
};

export const saveState = (userId: string, state: AppState): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
};

export const newId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'id_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
};

export type { Task };
