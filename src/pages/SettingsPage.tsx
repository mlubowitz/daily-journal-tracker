import { Settings } from 'lucide-react';
import { Card } from '@/components/ui';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card variant="paper" padding="lg">
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <Settings className="h-16 w-16 text-[var(--color-ink-light)]" />
          <h2 className="font-handwriting text-3xl text-[var(--color-ink)]">
            Settings
          </h2>
          <p className="max-w-md text-[var(--color-ink-light)]">
            Customization options, export settings, and preferences will be
            available here soon.
          </p>
        </div>
      </Card>
    </div>
  );
}
