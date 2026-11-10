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
}
