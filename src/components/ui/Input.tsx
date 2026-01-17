import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'journal';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, variant = 'default', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-[var(--color-ink)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            variant === 'journal'
              ? 'journal-input'
              : [
                  'w-full rounded-lg border border-[var(--color-line-dark)] bg-[var(--color-cream-50)] px-3 py-2',
                  'text-[var(--color-ink)] placeholder:text-[var(--color-ink-light)] placeholder:opacity-60',
                  'transition-colors duration-200',
                  'focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-opacity-20',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                ],
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
