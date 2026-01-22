// Habit tracking structure
export interface Habits {
  workout: boolean;
  drink: boolean; // alcohol consumption (tracking to reduce)
  smoke: boolean; // smoking (tracking to reduce)
  read: boolean;
  lsat: boolean; // LSAT study
  screenTime: number; // minutes
}

// Sleep tracking
export interface SleepData {
  hours: number; // 0-24
  quality: 1 | 2 | 3 | 4 | 5; // 1=poor, 5=excellent
}

// Mood type (null = not set)
export type MoodValue = 1 | 2 | 3 | 4 | 5 | null;

// Main daily entry
export interface DayEntry {
  id?: number; // Auto-incremented by Dexie
  date: string; // ISO date string: "2026-01-17"
  mood: MoodValue;
  sleep: SleepData;
  highlight: string; // Day's highlight (short)
  journalText: string; // Main journal content
  habits: Habits;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// Goal item within monthly goals
export interface Goal {
  id: string; // UUID
  text: string;
  isCompleted: boolean;
  completedAt?: string;
}

// Monthly goals
export interface MonthlyGoal {
  id?: number;
  month: string; // "2026-01" format
  goals: Goal[];
  completed: boolean;
  reflection: string; // End-of-month reflection
  createdAt: string;
  updatedAt: string;
}

// Habit summary for weekly reflections
export interface HabitSummary {
  workout: number; // Days completed
  drink: number; // Days occurred (goal: minimize)
  smoke: number; // Days occurred (goal: minimize)
  read: number;
  lsat: number;
  avgScreenTime: number; // Average minutes
}

// Weekly reflection
export interface WeeklyReflection {
  id?: number;
  weekStart: string; // ISO date of Monday
  weekEnd: string; // ISO date of Sunday
  summary: string;
  highlights: string[];
  habitsCompleted: HabitSummary;
  createdAt: string;
  updatedAt: string;
}

// App settings
export interface AppSettings {
  id?: number;
  theme: 'light' | 'dark';
  defaultView: 'journal' | 'calendar';
  enableNotifications: boolean;
  cloudSyncEnabled: boolean;
  lastSyncedAt?: string;
}

// Default values for creating new entries
export const createDefaultHabits = (): Habits => ({
  workout: false,
  drink: false,
  smoke: false,
  read: false,
  lsat: false,
  screenTime: 0,
});

export const createDefaultSleep = (): SleepData => ({
  hours: 0,
  quality: 3,
});

export const createDefaultDayEntry = (date: string): Omit<DayEntry, 'id'> => ({
  date,
  mood: null,
  sleep: createDefaultSleep(),
  highlight: '',
  journalText: '',
  habits: createDefaultHabits(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
