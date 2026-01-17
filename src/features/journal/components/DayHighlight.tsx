import { Sparkles } from 'lucide-react';
import { Input } from '@/components/ui';

interface DayHighlightProps {
  value: string;
  onChange: (text: string) => void;
  maxLength?: number;
}

export function DayHighlight({
  value,
  onChange,
  maxLength = 200,
}: DayHighlightProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-yellow-500" />
        <span className="text-sm font-medium text-[var(--color-ink)]">
          Today's Highlight
        </span>
      </div>
      <Input
        variant="journal"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder="What was the best part of your day?"
        maxLength={maxLength}
      />
    </div>
  );
}
