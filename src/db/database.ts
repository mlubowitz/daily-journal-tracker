import Dexie, { type Table } from 'dexie';
import type {
  DayEntry,
  MonthlyGoal,
  WeeklyReflection,
  AppSettings,
} from '@/types/models';

export class JournalDatabase extends Dexie {
  dayEntries!: Table<DayEntry, number>;
  monthlyGoals!: Table<MonthlyGoal, number>;
  weeklyReflections!: Table<WeeklyReflection, number>;
  settings!: Table<AppSettings, number>;

  constructor() {
    super('JournalTrackerDB');

    // Schema version 1
    this.version(1).stores({
      // Primary key is auto-incremented
      // Indexed fields: date (unique), mood, createdAt
      dayEntries: '++id, &date, mood, createdAt',

      // Indexed: month (unique)
      monthlyGoals: '++id, &month, createdAt',

      // Indexed: weekStart (unique), weekEnd
      weeklyReflections: '++id, &weekStart, weekEnd, createdAt',

      // Single settings record
      settings: '++id',
    });
  }
}

// Singleton database instance
export const db = new JournalDatabase();

// Initialize with default settings if needed
export async function initializeDatabase(): Promise<void> {
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.add({
      theme: 'light',
      defaultView: 'journal',
      enableNotifications: false,
      cloudSyncEnabled: false,
    });
  }
}

// Helper to get settings (always returns first/only record)
export async function getSettings(): Promise<AppSettings | undefined> {
  return db.settings.toCollection().first();
}

// Helper to update settings
export async function updateSettings(
  updates: Partial<AppSettings>
): Promise<void> {
  const settings = await getSettings();
  if (settings?.id) {
    await db.settings.update(settings.id, updates);
  }
}
