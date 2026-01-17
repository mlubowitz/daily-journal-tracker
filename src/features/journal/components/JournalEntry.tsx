import { format } from 'date-fns';
import { Save, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui';
import { MoodSelector, SleepTracker } from '@/components/common';
import { DayHighlight } from './DayHighlight';
import { JournalText } from './JournalText';
import { HabitPanel } from './HabitPanel';
import type { DayEntry } from '@/types/models';

interface JournalEntryProps {
  date: Date;
  entry: DayEntry;
  onChange: (updates: Partial<DayEntry>) => void;
  isSaving: boolean;
  isDirty: boolean;
}

export function JournalEntry({
  date,
  entry,
  onChange,
  isSaving,
  isDirty,
}: JournalEntryProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Date Header */}
      <div className="flex items-center justify-between">
        <div className="journal-double-line">
          <h2 className="font-handwriting text-3xl text-[var(--color-ink)]">
            {format(date, 'EEEE')}
          </h2>
          <p className="text-sm text-[var(--color-ink-light)]">
            {format(date, 'MMMM d, yyyy')}
          </p>
        </div>
        {/* Save indicator */}
        <div className="flex items-center gap-2 text-sm">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[var(--color-accent)]" />
              <span className="text-[var(--color-ink-light)]">Saving...</span>
            </>
          ) : isDirty ? (
            <>
              <Save className="h-4 w-4 text-yellow-500" />
              <span className="text-yellow-600">Unsaved changes</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 text-green-500" />
              <span className="text-green-600">Saved</span>
            </>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Journal content (2/3 width on large screens) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card variant="paper" padding="lg">
            {/* Highlight */}
            <DayHighlight
              value={entry.highlight}
              onChange={(highlight) => onChange({ highlight })}
            />

            {/* Mood & Sleep row */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <MoodSelector
                value={entry.mood}
                onChange={(mood) => onChange({ mood })}
                showLabels
              />
              <SleepTracker
                sleep={entry.sleep}
                onChange={(sleep) => onChange({ sleep })}
              />
            </div>

            {/* Journal text */}
            <div className="mt-6">
              <JournalText
                value={entry.journalText}
                onChange={(journalText) => onChange({ journalText })}
              />
            </div>
          </Card>
        </div>

        {/* Right Column - Habits (1/3 width on large screens) */}
        <div className="lg:col-span-1">
          <HabitPanel
            habits={entry.habits}
            onChange={(habits) => onChange({ habits })}
          />
        </div>
      </div>
    </div>
  );
}
