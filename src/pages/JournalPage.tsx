import { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/common';
import { JournalEntry } from '@/features/journal';
import { db } from '@/db';
import { createDefaultDayEntry, type DayEntry } from '@/types/models';
import { useLiveQuery } from 'dexie-react-hooks';

export default function JournalPage() {
  // Always show today's entry
  const today = new Date();
  const currentDateString = format(today, 'yyyy-MM-dd');

  // Local state for the form
  const [formData, setFormData] = useState<DayEntry | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Query the database for today's entry
  const queryResult = useLiveQuery(
    async () => {
      const entry = await db.dayEntries.where('date').equals(currentDateString).first();
      return { entry: entry ?? null, dateString: currentDateString };
    },
    [currentDateString]
  );

  // When db entry loads, set form data
  useEffect(() => {
    if (queryResult && queryResult.dateString === currentDateString) {
      setFormData(queryResult.entry ?? createDefaultDayEntry(currentDateString));
      setIsDirty(false);
    }
  }, [queryResult, currentDateString]);

  // Save to database
  const saveToDb = useCallback(async (entry: DayEntry) => {
    const now = new Date().toISOString();

    try {
      const existing = await db.dayEntries.where('date').equals(entry.date).first();

      if (existing) {
        await db.dayEntries.update(existing.id!, {
          ...entry,
          id: existing.id,
          updatedAt: now,
        });
      } else {
        await db.dayEntries.add({
          ...entry,
          createdAt: now,
          updatedAt: now,
        });
      }
    } catch (error) {
      console.error('Failed to save:', error);
    }
  }, []);

  // Debounced save
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEntryChange = useCallback(
    (updates: Partial<DayEntry>) => {
      setFormData((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ...updates };

        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        setIsDirty(true);
        setIsSaving(true);

        saveTimeoutRef.current = setTimeout(async () => {
          await saveToDb(updated);
          setIsSaving(false);
          setIsDirty(false);
          saveTimeoutRef.current = null;
        }, 500);

        return updated;
      });
    },
    [saveToDb]
  );

  const isLoading = !formData || formData.date !== currentDateString;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <JournalEntry
        date={today}
        entry={formData}
        onChange={handleEntryChange}
        isSaving={isSaving}
        isDirty={isDirty}
      />
    </div>
  );
}
