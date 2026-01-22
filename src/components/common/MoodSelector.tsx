import { cn } from '@/utils/cn';
import { MoodEmojis, MoodLabels, MoodColors } from '@/types/enums';
import type { MoodValue } from '@/types/models';

interface MoodSelectorProps {
  value: MoodValue;
  onChange: (mood: MoodValue) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'w-8 h-8 text-lg',
  md: 'w-10 h-10 text-xl',
  lg: 'w-12 h-12 text-2xl',
};

const moods: (1 | 2 | 3 | 4 | 5)[] = [1, 2, 3, 4, 5];

export function MoodSelector({
  value,
  onChange,
  size = 'md',
}: MoodSelectorProps) {
  const handleClick = (mood: 1 | 2 | 3 | 4 | 5) => {
    // Toggle off if clicking the already selected mood
    onChange(value === mood ? null : mood);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-[var(--color-ink-light)]">
        How are you feeling?
      </span>
      <div className="flex items-center gap-2">
        {moods.map((mood) => {
          const isSelected = value === mood;
          return (
            <button
              key={mood}
              type="button"
              onClick={() => handleClick(mood)}
              className={cn(
                'mood-button',
                sizeStyles[size],
                isSelected && 'selected'
              )}
              style={{
                borderColor: isSelected ? MoodColors[mood] : undefined,
                backgroundColor: isSelected ? `${MoodColors[mood]}20` : undefined,
              }}
              aria-label={MoodLabels[mood]}
              title={MoodLabels[mood]}
            >
              {MoodEmojis[mood]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
