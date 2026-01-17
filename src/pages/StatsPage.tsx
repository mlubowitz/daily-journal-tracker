import { BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui';

export default function StatsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card variant="paper" padding="lg">
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <BarChart3 className="h-16 w-16 text-[var(--color-ink-light)]" />
          <h2 className="font-handwriting text-3xl text-[var(--color-ink)]">
            Statistics Coming Soon
          </h2>
          <p className="max-w-md text-[var(--color-ink-light)]">
            Track your habits, mood trends, and streaks here. Start journaling to
            see your stats build up over time!
          </p>
        </div>
      </Card>
    </div>
  );
}
