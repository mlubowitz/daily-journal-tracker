import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parseISO, format, isValid } from 'date-fns';
import { Card } from '@/components/ui';
import { LoadingSpinner } from '@/components/common';
import { JournalEntry } from '@/features/journal';
import { DayGrid, MonthHeader, useCalendar } from '@/features/calendar';
import { useCalendarStore } from '@/store';
import { db } from '@/db';
import { createDefaultDayEntry, type DayEntry } from '@/types/models';
import { useLiveQuery } from 'dexie-react-hooks';

export default function JournalPage() {
  const { date: dateParam } = useParams<{ date?: string }>();
  const navigate = useNavigate();

  const {
    selectedDate,
    viewingMonth,
    setSelectedDate,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  } = useCalendarStore();

  // Local state for the form
  const [formData, setFormData] = useState<DayEntry | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Parse date from URL or use selected date
  const currentDate = dateParam
    ? (() => {
        const parsed = parseISO(dateParam);
        return isValid(parsed) ? parsed : selectedDate;
      })()
    : selectedDate;

  const currentDateString = format(currentDate, 'yyyy-MM-dd');

  // Sync URL with selected date
  useEffect(() => {
    if (dateParam) {
      const parsed = parseISO(dateParam);
      if (isValid(parsed)) {
        setSelectedDate(parsed);
      }
    }
  }, [dateParam, setSelectedDate]);

  // Query the database for this date's entry - this will reactively update
  // We wrap in an object so we can distinguish "loading" (undefined) from "not found" (null)
  const queryResult = useLiveQuery(
    async () => {
      const entry = await db.dayEntries.where('date').equals(currentDateString).first();
      return { entry: entry ?? null, dateString: currentDateString };
    },
    [currentDateString]
  );

  // Get calendar data
  const { calendarDays, entriesMap, isLoading: calendarLoading } =
    useCalendar(viewingMonth);

  // When the date changes or db entry loads, reset form data
  useEffect(() => {
    if (queryResult && queryResult.dateString === currentDateString) {
      // Query completed for current date
      setFormData(queryResult.entry ?? createDefaultDayEntry(currentDateString));
      setIsDirty(false);
    }
  }, [queryResult, currentDateString]);

  // Save to database
  const saveToDb = useCallback(async (entry: DayEntry) => {
    const now = new Date().toISOString();

    try {
      // Check if entry exists in db by date
      const existing = await db.dayEntries.where('date').equals(entry.date).first();

      if (existing) {
        // Update existing
        await db.dayEntries.update(existing.id!, {
          ...entry,
          id: existing.id,
          updatedAt: now,
        });
      } else {
        // Create new
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

        // Clear existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        // Set saving state and schedule save
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

  // Handle day selection from calendar
  const handleDaySelect = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    navigate(`/journal/${dateString}`);
  };

  // Show loading state only if we don't have form data yet OR if we're loading a different date
  const isLoading = !formData || formData.date !== currentDateString;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* Main journal entry (3 columns on XL) */}
        <div className="xl:col-span-3">
          <JournalEntry
            date={currentDate}
            entry={formData}
            onChange={handleEntryChange}
            isSaving={isSaving}
            isDirty={isDirty}
          />
        </div>

        {/* Calendar sidebar (1 column on XL) */}
        <div className="xl:col-span-1">
          <Card variant="paper" padding="md" className="sticky top-6">
            <MonthHeader
              month={viewingMonth}
              onPreviousMonth={goToPreviousMonth}
              onNextMonth={goToNextMonth}
              onToday={goToToday}
            />
            <div className="mt-4">
              {calendarLoading ? (
                <LoadingSpinner />
              ) : (
                <DayGrid
                  days={calendarDays}
                  entriesMap={entriesMap}
                  currentMonth={viewingMonth}
                  selectedDate={selectedDate}
                  onDaySelect={handleDaySelect}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
