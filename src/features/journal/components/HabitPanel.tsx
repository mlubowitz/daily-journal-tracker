import { Clock } from 'lucide-react';
import { Card, Input } from '@/components/ui';
import { SleepTracker } from '@/components/common';
import { HabitCheckbox } from './HabitCheckbox';
import { HABIT_KEYS, type HabitKey } from '@/types/enums';
import type { Habits, SleepData } from '@/types/models';

interface HabitPanelProps {
  habits: Habits;
  onChange: (habits: Habits) => void;
  sleep: SleepData;
  onSleepChange: (sleep: SleepData) => void;
}

export function HabitPanel({ habits, onChange, sleep, onSleepChange }: HabitPanelProps) {
  const handleHabitChange = (key: HabitKey, checked: boolean) => {
    onChange({
      ...habits,
      [key]: checked,
    });
  };

  // Convert total minutes to hours and minutes
  const hours = Math.floor(habits.screenTime / 60);
  const minutes = habits.screenTime % 60;

  const handleHoursChange = (newHours: number) => {
    const totalMinutes = Math.max(0, newHours) * 60 + minutes;
    onChange({
      ...habits,
      screenTime: Math.min(1440, totalMinutes), // Cap at 24 hours
    });
  };

  const handleMinutesChange = (newMinutes: number) => {
    const clampedMinutes = Math.max(0, Math.min(59, newMinutes));
    const totalMinutes = hours * 60 + clampedMinutes;
    onChange({
      ...habits,
      screenTime: Math.min(1440, totalMinutes),
    });
  };

  return (
    <Card variant="paper" padding="md" className="flex flex-col gap-4">
      <h3 className="font-handwriting text-xl text-[var(--color-ink)]">
        Daily Habits
      </h3>

      {/* Habit checkboxes */}
      <div className="flex flex-col gap-1">
        {HABIT_KEYS.map((key) => (
          <HabitCheckbox
            key={key}
            habitKey={key}
            checked={habits[key]}
            onChange={(checked) => handleHabitChange(key, checked)}
          />
        ))}
      </div>

      {/* Screen time input */}
      <div className="border-t border-[var(--color-line)] pt-4">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-[var(--color-ink-light)]" />
          <span className="text-sm font-medium text-[var(--color-ink)]">
            Screen Time
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Input
              type="number"
              min="0"
              max="24"
              value={hours || ''}
              onChange={(e) => handleHoursChange(parseInt(e.target.value) || 0)}
              className="w-16 text-center"
              placeholder="0"
            />
            <span className="text-sm text-[var(--color-ink-light)]">hr</span>
          </div>
          <span className="text-[var(--color-ink-light)]">:</span>
          <div className="flex items-center gap-1">
            <Input
              type="number"
              min="0"
              max="59"
              value={minutes || ''}
              onChange={(e) => handleMinutesChange(parseInt(e.target.value) || 0)}
              className="w-16 text-center"
              placeholder="0"
            />
            <span className="text-sm text-[var(--color-ink-light)]">min</span>
          </div>
        </div>
      </div>

      {/* Sleep tracker */}
      <div className="border-t border-[var(--color-line)] pt-4">
        <SleepTracker sleep={sleep} onChange={onSleepChange} />
      </div>
    </Card>
  );
}
