import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'journal';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, variant = 'default', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1 block text-sm font-medium text-[var(--color-ink)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            variant === 'journal'
              ? 'journal-textarea journal-lines min-h-[256px]'
              : [
                  'w-full rounded-lg border border-[var(--color-line-dark)] bg-[var(--color-cream-50)] px-3 py-2',
                  'text-[var(--color-ink)] placeholder:text-[var(--color-ink-light)] placeholder:opacity-60',
                  'transition-colors duration-200',
                  'focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-opacity-20',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'min-h-[120px] resize-y',
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

Textarea.displayName = 'Textarea';
