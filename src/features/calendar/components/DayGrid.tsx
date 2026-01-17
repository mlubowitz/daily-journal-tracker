import { format } from 'date-fns';
import { DayCell } from './DayCell';
import type { DayEntry } from '@/types/models';

interface DayGridProps {
  days: Date[];
  entriesMap: Map<string, DayEntry>;
  currentMonth: Date;
  selectedDate: Date;
  onDaySelect: (date: Date) => void;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function DayGrid({
  days,
  entriesMap,
  currentMonth,
  selectedDate,
  onDaySelect,
}: DayGridProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-[var(--color-ink-light)]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date) => {
          const dateString = format(date, 'yyyy-MM-dd');
          const entry = entriesMap.get(dateString) || null;

          return (
            <DayCell
              key={dateString}
              date={date}
              entry={entry}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onClick={() => onDaySelect(date)}
            />
          );
        })}
      </div>
    </div>
  );
}
