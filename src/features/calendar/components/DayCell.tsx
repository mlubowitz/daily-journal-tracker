import { format, isSameMonth, isToday, isSameDay } from 'date-fns';
import { cn } from '@/utils/cn';
import { MoodEmojis, MoodColors } from '@/types/enums';
import type { DayEntry } from '@/types/models';

interface DayCellProps {
  date: Date;
  entry: DayEntry | null;
  currentMonth: Date;
  selectedDate: Date;
  onClick: () => void;
}

export function DayCell({
  date,
  entry,
  currentMonth,
  selectedDate,
  onClick,
}: DayCellProps) {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const isSelected = isSameDay(date, selectedDate);
  const isTodayDate = isToday(date);
  const hasEntry = !!entry;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex h-16 flex-col items-center justify-start rounded-lg p-1 transition-all duration-200',
        'hover:bg-[var(--color-cream-200)]',
        !isCurrentMonth && 'opacity-40',
        isSelected && 'bg-[var(--color-cream-200)] ring-2 ring-[var(--color-accent)]',
        isTodayDate && !isSelected && 'bg-[var(--color-cream-300)]'
      )}
    >
      {/* Date number */}
      <span
        className={cn(
          'text-sm font-medium',
          isSelected
            ? 'text-[var(--color-accent)]'
            : isTodayDate
            ? 'text-[var(--color-ink)]'
            : 'text-[var(--color-ink-light)]'
        )}
      >
        {format(date, 'd')}
      </span>

      {/* Entry indicator */}
      {hasEntry && (
        <div className="mt-1 flex items-center gap-0.5">
          {/* Mood emoji */}
          <span
            className="text-xs"
            style={{ color: MoodColors[entry.mood] }}
          >
            {MoodEmojis[entry.mood]}
          </span>

          {/* Habit dots */}
          <div className="flex gap-0.5">
            {entry.habits.workout && (
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-habit-workout)' }}
              />
            )}
            {entry.habits.read && (
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-habit-read)' }}
              />
            )}
            {entry.habits.lsat && (
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-habit-lsat)' }}
              />
            )}
          </div>
        </div>
      )}

      {/* Journal indicator (small pen) */}
      {hasEntry && entry.journalText.length > 0 && (
        <div className="absolute right-1 top-1 text-[8px] text-[var(--color-ink-light)]">
          📝
        </div>
      )}
    </button>
  );
}
