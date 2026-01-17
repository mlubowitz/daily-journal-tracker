import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Check } from 'lucide-react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  color?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, color, id, checked, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'flex h-5 w-5 cursor-pointer items-center justify-center rounded border-2 transition-all duration-200',
              'border-[var(--color-line-dark)] bg-[var(--color-cream-50)]',
              'peer-focus:ring-2 peer-focus:ring-[var(--color-accent)] peer-focus:ring-offset-2',
              'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
              className
            )}
            style={{
              backgroundColor: checked ? color || 'var(--color-habit-workout)' : undefined,
              borderColor: checked ? color || 'var(--color-habit-workout)' : undefined,
            }}
            onClick={() => {
              const input = document.getElementById(checkboxId!) as HTMLInputElement;
              input?.click();
            }}
          >
            {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={checkboxId}
                className="cursor-pointer text-sm font-medium text-[var(--color-ink)]"
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-xs text-[var(--color-ink-light)]">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
