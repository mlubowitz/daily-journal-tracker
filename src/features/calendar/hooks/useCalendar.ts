import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
} from 'date-fns';
import { db } from '@/db';
import type { DayEntry } from '@/types/models';

export function useCalendar(month: Date) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);

  // Get the calendar grid (including days from prev/next month to fill weeks)
  const calendarDays = useMemo(() => {
    const start = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
    const end = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [monthStart, monthEnd]);

  // Fetch entries for the visible date range
  const entries = useLiveQuery(async () => {
    const startDate = format(calendarDays[0], 'yyyy-MM-dd');
    const endDate = format(calendarDays[calendarDays.length - 1], 'yyyy-MM-dd');

    return db.dayEntries
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  }, [calendarDays]);

  // Convert to Map for O(1) lookups
  const entriesMap = useMemo(() => {
    const map = new Map<string, DayEntry>();
    entries?.forEach((e) => map.set(e.date, e));
    return map;
  }, [entries]);

  return {
    calendarDays,
    entriesMap,
    isLoading: entries === undefined,
    monthStart,
    monthEnd,
  };
}
