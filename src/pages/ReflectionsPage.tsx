import { Target } from 'lucide-react';
import { Card } from '@/components/ui';

export default function ReflectionsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card variant="paper" padding="lg">
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <Target className="h-16 w-16 text-[var(--color-ink-light)]" />
          <h2 className="font-handwriting text-3xl text-[var(--color-ink)]">
            Reflections Coming Soon
          </h2>
          <p className="max-w-md text-[var(--color-ink-light)]">
            Weekly reflections and monthly goals will appear here. Keep
            journaling to unlock insights about your progress!
          </p>
        </div>
      </Card>
    </div>
  );
}
