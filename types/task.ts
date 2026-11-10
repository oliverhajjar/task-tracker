export type TaskType = 'oneday' | 'daily';

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description?: string;
  createdAt: string;
  // one-day tasks
  completed: boolean;
  completedAt?: string;
  // daily tasks: completion is per-day; `completed` reflects today's state
  dailyCompleted: boolean;
}

export interface ActivityEntry {
  completed: number;
  total: number;
}

export interface AppState {
  oneDayTasks: Task[];
  dailyTasks: Task[];
  theme: 'light' | 'dark';
  lastDailyResetDate: string;
  activityLog: Record<string, ActivityEntry>;
  dailyAllCompleted: Record<string, boolean>; // date -> all daily tasks completed
  userName: string;
  notifications: NotificationState;
}

export interface NotificationSettings {
  enabled: boolean;
  dailyReminderTime: string; // HH:MM
  oneDayReminderTime: string;
  secondReminderEnabled: boolean;
  secondReminderTime: string;
  dailyHabitReminders: boolean;
  oneDayReminders: boolean;
  completionNotifications: boolean;
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationState {
  settings: NotificationSettings;
  history: NotificationRecord[];
  permission: NotificationPermission | 'default';
  lastSent: Record<string, string>; // key -> dateKey to prevent duplicates
}
