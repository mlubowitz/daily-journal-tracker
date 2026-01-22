import { Moon } from 'lucide-react';
import { Input } from '@/components/ui';
import type { SleepData } from '@/types/models';

interface SleepTrackerProps {
  sleep: SleepData;
  onChange: (sleep: SleepData) => void;
}

export function SleepTracker({ sleep, onChange }: SleepTrackerProps) {
  const hours = Math.floor(sleep.hours);
  const minutes = Math.round((sleep.hours - hours) * 60);

  const handleHoursChange = (newHours: number) => {
    const totalHours = Math.max(0, Math.min(24, newHours)) + minutes / 60;
    onChange({ ...sleep, hours: totalHours });
  };

  const handleMinutesChange = (newMinutes: number) => {
    const clampedMinutes = Math.max(0, Math.min(59, newMinutes));
    const totalHours = hours + clampedMinutes / 60;
    onChange({ ...sleep, hours: Math.min(24, totalHours) });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Moon className="h-4 w-4 text-[var(--color-accent)]" />
        <span className="text-sm font-medium text-[var(--color-ink-light)]">
          Sleep
        </span>
      </div>
      <div className="flex items-center gap-2">
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
  );
}
