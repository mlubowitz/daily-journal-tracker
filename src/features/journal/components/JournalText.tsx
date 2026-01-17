import { Textarea } from '@/components/ui';

interface JournalTextProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export function JournalText({
  value,
  onChange,
  placeholder = "What's on your mind today?",
  maxLength = 10000,
}: JournalTextProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="font-handwriting text-xl text-[var(--color-ink)]">
          Journal Entry
        </h3>
        <span className="text-xs text-[var(--color-ink-light)]">
          {value.length.toLocaleString()} / {maxLength.toLocaleString()}
        </span>
      </div>
      <div className="journal-lines rounded-lg bg-[var(--color-cream-50)] p-4">
        <Textarea
          variant="journal"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          placeholder={placeholder}
          rows={8}
        />
      </div>
    </div>
  );
}
