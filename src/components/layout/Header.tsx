import { format } from 'date-fns';
import { Search, Download, Settings, Calendar } from 'lucide-react';
import { Button } from '@/components/ui';
import { useCalendarStore, useUIStore } from '@/store';
import { cn } from '@/utils/cn';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { selectedDate, goToToday } = useCalendarStore();
  const { setSearchOpen, setExportModalOpen } = useUIStore();

  const isToday =
    format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <header className="flex items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-cream-50)] px-6 py-4">
      <div className="flex items-center gap-4">
        <h1 className="font-handwriting text-3xl text-[var(--color-ink)]">
          {title || 'My Journal'}
        </h1>
        <div className="flex items-center gap-2 text-sm text-[var(--color-ink-light)]">
          <Calendar className="h-4 w-4" />
          <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
        </div>
        {!isToday && (
          <Button variant="ghost" size="sm" onClick={goToToday}>
            Go to Today
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSearchOpen(true)}
          leftIcon={<Search className="h-4 w-4" />}
          className={cn('text-[var(--color-ink-light)]')}
        >
          Search
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExportModalOpen(true)}
          leftIcon={<Download className="h-4 w-4" />}
          className={cn('text-[var(--color-ink-light)]')}
        >
          Export
        </Button>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Settings className="h-4 w-4" />}
          className={cn('text-[var(--color-ink-light)]')}
        >
          Settings
        </Button>
      </div>
    </header>
  );
}
