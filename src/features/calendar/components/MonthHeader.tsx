import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui';

interface MonthHeaderProps {
  month: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function MonthHeader({
  month,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: MonthHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="font-handwriting text-2xl text-[var(--color-ink)]">
          {format(month, 'MMMM yyyy')}
        </h2>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToday}
          leftIcon={<Calendar className="h-4 w-4" />}
        >
          Today
        </Button>
        <Button variant="ghost" size="sm" onClick={onPreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
