import { Moon, Star } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SleepQualityLabels } from '@/types/enums';
import type { SleepData } from '@/types/models';

interface SleepTrackerProps {
  sleep: SleepData;
  onChange: (sleep: SleepData) => void;
}

const qualityLevels = [1, 2, 3, 4, 5] as const;

export function SleepTracker({ sleep, onChange }: SleepTrackerProps) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-sm font-medium text-[var(--color-ink-light)]">
        Sleep
      </span>

      {/* Hours */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-[var(--color-accent)]" />
          <span className="text-sm text-[var(--color-ink)]">Hours:</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={sleep.hours}
            onChange={(e) =>
              onChange({ ...sleep, hours: parseFloat(e.target.value) })
            }
            className="h-2 w-32 cursor-pointer appearance-none rounded-lg bg-[var(--color-cream-300)]
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-accent)]
              [&::-webkit-slider-thumb]:shadow-md"
          />
          <span className="min-w-[3rem] text-sm font-medium text-[var(--color-ink)]">
            {sleep.hours}h
          </span>
        </div>
      </div>

      {/* Quality */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-[var(--color-accent)]" />
          <span className="text-sm text-[var(--color-ink)]">Quality:</span>
        </div>
        <div className="flex items-center gap-1">
          {qualityLevels.map((level) => {
            const isSelected = sleep.quality >= level;
            return (
              <button
                key={level}
                type="button"
                onClick={() =>
                  onChange({
                    ...sleep,
                    quality: level as SleepData['quality'],
                  })
                }
                className={cn(
                  'rounded p-1 transition-colors',
                  isSelected
                    ? 'text-yellow-500'
                    : 'text-[var(--color-cream-400)] hover:text-yellow-400'
                )}
                aria-label={`${SleepQualityLabels[level]} sleep quality`}
                title={SleepQualityLabels[level]}
              >
                <Star
                  className="h-5 w-5"
                  fill={isSelected ? 'currentColor' : 'none'}
                />
              </button>
            );
          })}
          <span className="ml-2 text-xs text-[var(--color-ink-light)]">
            {SleepQualityLabels[sleep.quality]}
          </span>
        </div>
      </div>
    </div>
  );
}
