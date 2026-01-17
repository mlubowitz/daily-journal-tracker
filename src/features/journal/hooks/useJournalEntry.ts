import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import { db } from '@/db';
import { createDefaultDayEntry } from '@/types/models';
import type { DayEntry } from '@/types/models';

// Marker to distinguish "not loaded yet" from "loaded but no entry"
const NOT_LOADED = Symbol('NOT_LOADED');

export function useJournalEntry(date: Date) {
  const dateString = format(date, 'yyyy-MM-dd');

  // useLiveQuery returns undefined while loading
  // We return null explicitly when no entry is found to distinguish from loading state
  const queryResult = useLiveQuery(
    async () => {
      const found = await db.dayEntries.where('date').equals(dateString).first();
      return found ?? null; // null means "loaded but not found"
    },
    [dateString],
    NOT_LOADED as unknown as DayEntry | null // default value while loading
  );

  const isLoading = queryResult === (NOT_LOADED as unknown);
  const existingEntry = isLoading ? null : queryResult;

  // Create a new entry with defaults if none exists
  const entry: DayEntry = existingEntry ?? createDefaultDayEntry(dateString);

  return {
    entry,
    isLoading,
    exists: !!existingEntry?.id,
    dateString,
  };
}
