// Non-null mood values for lookup tables
type MoodNumber = 1 | 2 | 3 | 4 | 5;

export const MoodLabels: Record<MoodNumber, string> = {
  1: 'Terrible',
  2: 'Bad',
  3: 'Okay',
  4: 'Good',
  5: 'Great',
};

export const MoodEmojis: Record<MoodNumber, string> = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
};

export const MoodColors: Record<MoodNumber, string> = {
  1: '#EF4444', // Red
  2: '#F97316', // Orange
  3: '#EAB308', // Yellow
  4: '#84CC16', // Lime
  5: '#22C55E', // Green
};

export const SleepQualityLabels: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
};

export type HabitKey = 'workout' | 'drink' | 'smoke' | 'read' | 'lsat';
export type GoalType = 'maximize' | 'minimize';

export interface HabitInfo {
  label: string;
  icon: string;
  color: string;
  goalType: GoalType;
  description: string;
}

export const HabitConfig: Record<HabitKey, HabitInfo> = {
  workout: {
    label: 'Workout',
    icon: 'Dumbbell',
    color: '#4CAF50',
    goalType: 'maximize',
    description: 'Physical exercise or training',
  },
  drink: {
    label: 'Alcohol',
    icon: 'Wine',
    color: '#FF9800',
    goalType: 'minimize',
    description: 'Alcohol consumption',
  },
  smoke: {
    label: 'Smoke',
    icon: 'Cigarette',
    color: '#F44336',
    goalType: 'minimize',
    description: 'Smoking',
  },
  read: {
    label: 'Read',
    icon: 'BookOpen',
    color: '#2196F3',
    goalType: 'maximize',
    description: 'Reading books or articles',
  },
  lsat: {
    label: 'LSAT',
    icon: 'GraduationCap',
    color: '#9C27B0',
    goalType: 'maximize',
    description: 'LSAT study or practice',
  },
} as const;

export const HABIT_KEYS: HabitKey[] = ['workout', 'drink', 'smoke', 'read', 'lsat'];

// Stats tabs
export type StatsTab = 'overview' | 'trends' | 'streaks' | 'year';

export const StatsTabLabels: Record<StatsTab, string> = {
  overview: 'Overview',
  trends: 'Trends',
  streaks: 'Streaks',
  year: 'Year in Review',
};
