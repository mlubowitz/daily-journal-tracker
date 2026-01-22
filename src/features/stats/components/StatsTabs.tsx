import { cn } from '@/utils/cn';
import { StatsTabLabels, type StatsTab } from '@/types/enums';

interface StatsTabsProps {
  activeTab: StatsTab;
  onTabChange: (tab: StatsTab) => void;
}

const TABS: StatsTab[] = ['overview', 'trends', 'streaks', 'year'];

export function StatsTabs({ activeTab, onTabChange }: StatsTabsProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-[var(--color-cream-200)] p-1">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all',
            activeTab === tab
              ? 'bg-[var(--color-cream-50)] text-[var(--color-ink)] shadow-paper'
              : 'text-[var(--color-ink-light)] hover:text-[var(--color-ink)]'
          )}
        >
          {StatsTabLabels[tab]}
        </button>
      ))}
    </div>
  );
}
