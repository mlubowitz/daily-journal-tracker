import { Check, X, Dumbbell, Wine, Cigarette, BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '@/utils/cn';
import { HabitConfig, type HabitKey } from '@/types/enums';

interface HabitCheckboxProps {
  habitKey: HabitKey;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Dumbbell,
  Wine,
  Cigarette,
  BookOpen,
  GraduationCap,
};

export function HabitCheckbox({ habitKey, checked, onChange }: HabitCheckboxProps) {
  const habit = HabitConfig[habitKey];
  const IconComponent = iconMap[habit.icon];
  const isMinimize = habit.goalType === 'minimize';

  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200',
        'hover:bg-[var(--color-cream-200)]',
        checked && !isMinimize && 'bg-[var(--color-cream-200)]'
      )}
    >
      {/* Checkbox */}
      <div
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded border-2 transition-all duration-200',
          checked
            ? isMinimize
              ? 'border-red-400 bg-red-100'
              : 'border-green-500 bg-green-500'
            : 'border-[var(--color-line-dark)] bg-[var(--color-cream-50)]'
        )}
        style={{
          borderColor: checked ? habit.color : undefined,
          backgroundColor: checked ? (isMinimize ? `${habit.color}20` : habit.color) : undefined,
        }}
      >
        {checked && (
          isMinimize ? (
            <X className="h-3.5 w-3.5" strokeWidth={3} style={{ color: habit.color }} />
          ) : (
            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
          )
        )}
      </div>

      {/* Icon */}
      {IconComponent && (
        <IconComponent
          className={cn(
            'h-5 w-5 transition-colors',
            checked ? 'opacity-100' : 'opacity-50'
          )}
          style={{ color: checked ? habit.color : 'var(--color-ink-light)' }}
        />
      )}

      {/* Label */}
      <div className="flex flex-col items-start">
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            checked ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-light)]'
          )}
        >
          {habit.label}
        </span>
        {isMinimize && (
          <span className="text-xs text-[var(--color-ink-light)]">
            {checked ? 'Occurred' : 'Avoided'}
          </span>
        )}
      </div>
    </button>
  );
}
