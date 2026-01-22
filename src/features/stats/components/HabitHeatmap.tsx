import { useState, useMemo } from 'react';
import { format, startOfYear, endOfYear, eachDayOfInterval, getDay, isAfter } from 'date-fns';
import { Card, Button } from '@/components/ui';
import { HabitConfig, HABIT_KEYS, type HabitKey } from '@/types/enums';
import { MoodColors, MoodEmojis } from '@/types/enums';
import type { DayEntry, MoodValue } from '@/types/models';

interface HabitHeatmapProps {
  data: Map<string, DayEntry>;
  year?: number;
}

type HeatmapType = 'journal' | 'mood' | HabitKey;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function HabitHeatmap({ data, year = new Date().getFullYear() }: HabitHeatmapProps) {
  const [heatmapType, setHeatmapType] = useState<HeatmapType>('journal');
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const today = new Date();
  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(new Date(year, 0, 1));

  // Generate all weeks of the year
  const weeks = useMemo(() => {
    const days = eachDayOfInterval({ start: yearStart, end: yearEnd });

    // Pad start to align with Sunday
    const firstDay = getDay(yearStart);
    const paddedStart: (Date | null)[] = Array(firstDay).fill(null);

    const allDays = [...paddedStart, ...days];

    // Group into weeks
    const weekGroups: (Date | null)[][] = [];
    for (let i = 0; i < allDays.length; i += 7) {
      weekGroups.push(allDays.slice(i, i + 7));
    }

    return weekGroups;
  }, [year]);

  // Get color for a cell based on type and entry
  const getCellColor = (date: Date | null): string => {
    if (!date) return 'transparent';
    if (isAfter(date, today)) return 'var(--color-cream-200)';

    const dateString = format(date, 'yyyy-MM-dd');
    const entry = data.get(dateString);

    if (!entry) return 'var(--color-cream-200)';

    switch (heatmapType) {
      case 'journal': {
        const wordCount = entry.journalText.split(/\s+/).filter(w => w).length;
        if (wordCount === 0) return 'var(--color-cream-200)';
        const intensity = Math.min(Math.ceil(wordCount / 50), 4);
        const opacities = [0.2, 0.4, 0.6, 0.8, 1];
        return `rgba(34, 197, 94, ${opacities[intensity]})`;
      }
      case 'mood': {
        return MoodColors[entry.mood];
      }
      default: {
        // Habit
        const habitKey = heatmapType as HabitKey;
        const completed = entry.habits[habitKey];
        if (!completed) return 'var(--color-cream-200)';
        return HabitConfig[habitKey].color;
      }
    }
  };

  // Get tooltip content
  const getTooltipContent = (date: Date | null): string | null => {
    if (!date) return null;
    if (isAfter(date, today)) return format(date, 'MMM d, yyyy') + ' (future)';

    const dateString = format(date, 'yyyy-MM-dd');
    const entry = data.get(dateString);

    const dateLabel = format(date, 'MMM d, yyyy');

    if (!entry) return `${dateLabel}\nNo entry`;

    switch (heatmapType) {
      case 'journal': {
        const wordCount = entry.journalText.split(/\s+/).filter(w => w).length;
        return `${dateLabel}\n${wordCount} words`;
      }
      case 'mood': {
        return `${dateLabel}\n${MoodEmojis[entry.mood]} Mood: ${entry.mood}/5`;
      }
      default: {
        const habitKey = heatmapType as HabitKey;
        const completed = entry.habits[habitKey];
        return `${dateLabel}\n${HabitConfig[habitKey].label}: ${completed ? 'Yes' : 'No'}`;
      }
    }
  };

  // Calculate stats for the year
  const yearStats = useMemo(() => {
    let total = 0;
    let completed = 0;

    data.forEach((entry) => {
      if (entry.date.startsWith(String(year))) {
        total++;
        switch (heatmapType) {
          case 'journal':
            if (entry.journalText.trim().length > 0) completed++;
            break;
          case 'mood':
            completed++; // All entries have mood
            break;
          default:
            if (entry.habits[heatmapType as HabitKey]) completed++;
        }
      }
    });

    return { total, completed };
  }, [data, year, heatmapType]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-handwriting text-xl text-[var(--color-ink)]">
          {year} Activity
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={heatmapType === 'journal' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setHeatmapType('journal')}
          >
            Journal
          </Button>
          <Button
            variant={heatmapType === 'mood' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setHeatmapType('mood')}
          >
            Mood
          </Button>
          {HABIT_KEYS.slice(0, 3).map((key) => (
            <Button
              key={key}
              variant={heatmapType === key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setHeatmapType(key)}
            >
              {HabitConfig[key].label}
            </Button>
          ))}
        </div>
      </div>

      <Card variant="paper" padding="lg" className="overflow-x-auto">
        {/* Month labels */}
        <div className="mb-2 flex pl-8">
          {MONTHS.map((month) => (
            <div
              key={month}
              className="text-xs text-[var(--color-ink-light)]"
              style={{ width: `${100 / 12}%`, minWidth: '40px' }}
            >
              {month}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pr-2">
            {DAYS.map((day, i) => (
              <div
                key={day}
                className="flex h-3 items-center text-xs text-[var(--color-ink-light)]"
                style={{ visibility: i % 2 === 1 ? 'visible' : 'hidden' }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date, dayIndex) => {
                  const dateString = date ? format(date, 'yyyy-MM-dd') : null;
                  const isHovered = dateString === hoveredDay;

                  return (
                    <div
                      key={dayIndex}
                      className="group relative h-3 w-3 rounded-sm transition-all"
                      style={{
                        backgroundColor: getCellColor(date),
                        transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                      }}
                      onMouseEnter={() => dateString && setHoveredDay(dateString)}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      {isHovered && date && (
                        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-pre rounded bg-[var(--color-ink)] px-2 py-1 text-xs text-[var(--color-cream-50)] shadow-lg">
                          {getTooltipContent(date)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-[var(--color-ink-light)]">
            {yearStats.completed} {heatmapType === 'journal' ? 'entries' : 'days'} in {year}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-[var(--color-ink-light)]">Less</span>
            {[0.2, 0.4, 0.6, 0.8, 1].map((opacity, i) => (
              <div
                key={i}
                className="h-3 w-3 rounded-sm"
                style={{
                  backgroundColor: heatmapType === 'mood'
                    ? MoodColors[(i + 1) as MoodValue]
                    : heatmapType === 'journal'
                    ? `rgba(34, 197, 94, ${opacity})`
                    : HabitConfig[heatmapType as HabitKey]?.color ?? '#22C55E',
                  opacity: heatmapType === 'mood' ? 1 : opacity,
                }}
              />
            ))}
            <span className="text-xs text-[var(--color-ink-light)]">More</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
