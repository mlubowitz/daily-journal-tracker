import { useLiveQuery } from 'dexie-react-hooks';
import { startOfMonth, subMonths, format, differenceInDays } from 'date-fns';
import { db } from '@/db';
import type { DayEntry, MoodValue } from '@/types/models';
import { HABIT_KEYS, type HabitKey } from '@/types/enums';

export interface StatsData {
  // Period info
  periodStart: Date;
  periodEnd: Date;
  totalDays: number;
  entriesCount: number;

  // Mood stats
  averageMood: number;
  moodDistribution: Record<MoodValue, number>;
  moodTrend: { date: string; mood: number }[];

  // Habit stats
  habitStats: Record<HabitKey, {
    completedDays: number;
    percentage: number;
    streak: number;
    longestStreak: number;
  }>;

  // Sleep stats
  averageSleep: number;
  sleepTrend: { date: string; hours: number }[];

  // Screen time
  averageScreenTime: number;
  totalScreenTime: number;

  // Streaks
  currentJournalStreak: number;
  longestJournalStreak: number;
}

function calculateStreak(entries: DayEntry[], habitKey: HabitKey): { current: number; longest: number } {
  if (entries.length === 0) return { current: 0, longest: 0 };

  // Sort by date descending (most recent first)
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  let current = 0;
  let longest = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  // Calculate current streak from today
  const today = format(new Date(), 'yyyy-MM-dd');
  let checkingCurrent = true;

  for (const entry of sorted) {
    const hasHabit = entry.habits[habitKey];
    const entryDate = new Date(entry.date);

    if (lastDate) {
      const daysDiff = differenceInDays(lastDate, entryDate);
      if (daysDiff > 1) {
        // Gap in entries, streak broken
        longest = Math.max(longest, tempStreak);
        tempStreak = hasHabit ? 1 : 0;
        checkingCurrent = false;
      } else if (hasHabit) {
        tempStreak++;
      } else {
        longest = Math.max(longest, tempStreak);
        tempStreak = 0;
        checkingCurrent = false;
      }
    } else {
      // First entry
      if (hasHabit) {
        tempStreak = 1;
        // Check if this is today or yesterday for current streak
        if (entry.date === today || differenceInDays(new Date(today), entryDate) <= 1) {
          checkingCurrent = true;
        } else {
          checkingCurrent = false;
        }
      }
    }

    if (checkingCurrent) {
      current = tempStreak;
    }

    lastDate = entryDate;
  }

  longest = Math.max(longest, tempStreak);

  return { current, longest };
}

function calculateJournalStreak(entries: DayEntry[]): { current: number; longest: number } {
  if (entries.length === 0) return { current: 0, longest: 0 };

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  let current = 0;
  let longest = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  const today = format(new Date(), 'yyyy-MM-dd');
  let checkingCurrent = true;

  for (const entry of sorted) {
    const hasJournal = entry.journalText.trim().length > 0;
    const entryDate = new Date(entry.date);

    if (lastDate) {
      const daysDiff = differenceInDays(lastDate, entryDate);
      if (daysDiff > 1) {
        longest = Math.max(longest, tempStreak);
        tempStreak = hasJournal ? 1 : 0;
        checkingCurrent = false;
      } else if (hasJournal) {
        tempStreak++;
      } else {
        longest = Math.max(longest, tempStreak);
        tempStreak = 0;
        checkingCurrent = false;
      }
    } else {
      if (hasJournal) {
        tempStreak = 1;
        if (entry.date === today || differenceInDays(new Date(today), entryDate) <= 1) {
          checkingCurrent = true;
        } else {
          checkingCurrent = false;
        }
      }
    }

    if (checkingCurrent) {
      current = tempStreak;
    }

    lastDate = entryDate;
  }

  longest = Math.max(longest, tempStreak);

  return { current, longest };
}

export function useStats(months: number = 1) {
  const periodEnd = new Date();
  const periodStart = startOfMonth(subMonths(periodEnd, months - 1));

  const stats = useLiveQuery(async (): Promise<StatsData | null> => {
    const startDate = format(periodStart, 'yyyy-MM-dd');
    const endDate = format(periodEnd, 'yyyy-MM-dd');

    const entries = await db.dayEntries
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();

    if (entries.length === 0) {
      return null;
    }

    const totalDays = differenceInDays(periodEnd, periodStart) + 1;

    // Mood calculations
    const moodSum = entries.reduce((sum, e) => sum + e.mood, 0);
    const averageMood = moodSum / entries.length;

    const moodDistribution: Record<MoodValue, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    entries.forEach(e => moodDistribution[e.mood]++);

    const moodTrend = entries
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(e => ({ date: e.date, mood: e.mood }));

    // Habit calculations
    const habitStats: StatsData['habitStats'] = {} as StatsData['habitStats'];

    for (const key of HABIT_KEYS) {
      const completedDays = entries.filter(e => e.habits[key]).length;
      const { current, longest } = calculateStreak(entries, key);

      habitStats[key] = {
        completedDays,
        percentage: Math.round((completedDays / entries.length) * 100),
        streak: current,
        longestStreak: longest,
      };
    }

    // Sleep calculations
    const sleepSum = entries.reduce((sum, e) => sum + e.sleep.hours, 0);
    const averageSleep = sleepSum / entries.length;

    const sleepTrend = entries
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(e => ({ date: e.date, hours: e.sleep.hours }));

    // Screen time calculations
    const screenTimeSum = entries.reduce((sum, e) => sum + e.habits.screenTime, 0);
    const averageScreenTime = screenTimeSum / entries.length;

    // Journal streaks
    const { current: currentJournalStreak, longest: longestJournalStreak } = calculateJournalStreak(entries);

    return {
      periodStart,
      periodEnd,
      totalDays,
      entriesCount: entries.length,
      averageMood,
      moodDistribution,
      moodTrend,
      habitStats,
      averageSleep,
      sleepTrend,
      averageScreenTime,
      totalScreenTime: screenTimeSum,
      currentJournalStreak,
      longestJournalStreak,
    };
  }, [months]);

  return {
    stats,
    isLoading: stats === undefined,
  };
}

// Hook for getting all entries for heatmap
export function useHeatmapData(year: number = new Date().getFullYear()) {
  const data = useLiveQuery(async () => {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const entries = await db.dayEntries
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();

    // Create a map for quick lookup
    const entriesMap = new Map<string, DayEntry>();
    entries.forEach(e => entriesMap.set(e.date, e));

    return entriesMap;
  }, [year]);

  return {
    data: data ?? new Map<string, DayEntry>(),
    isLoading: data === undefined,
  };
}

// Hook for year in review
export function useYearStats(year: number = new Date().getFullYear()) {
  const stats = useLiveQuery(async () => {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const entries = await db.dayEntries
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();

    if (entries.length === 0) return null;

    // Monthly breakdown
    const monthlyStats = Array.from({ length: 12 }, (_, i) => {
      const monthEntries = entries.filter(e => {
        const month = parseInt(e.date.split('-')[1], 10) - 1;
        return month === i;
      });

      if (monthEntries.length === 0) return null;

      const avgMood = monthEntries.reduce((sum, e) => sum + e.mood, 0) / monthEntries.length;
      const avgSleep = monthEntries.reduce((sum, e) => sum + e.sleep.hours, 0) / monthEntries.length;

      return {
        month: i,
        entriesCount: monthEntries.length,
        averageMood: avgMood,
        averageSleep: avgSleep,
      };
    });

    // Best day
    const bestDay = entries.reduce((best, current) =>
      current.mood > (best?.mood ?? 0) ? current : best
    , entries[0]);

    // Most productive month
    const productiveMonths = monthlyStats
      .map((m, i) => ({ ...m, index: i }))
      .filter(m => m !== null)
      .sort((a, b) => (b?.averageMood ?? 0) - (a?.averageMood ?? 0));

    return {
      totalEntries: entries.length,
      monthlyStats,
      bestDay,
      mostProductiveMonth: productiveMonths[0]?.index ?? null,
      averageMood: entries.reduce((sum, e) => sum + e.mood, 0) / entries.length,
      totalJournalWords: entries.reduce((sum, e) => sum + e.journalText.split(/\s+/).filter(w => w).length, 0),
    };
  }, [year]);

  return {
    stats,
    isLoading: stats === undefined,
  };
}
