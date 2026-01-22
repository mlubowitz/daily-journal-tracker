import { Flame, Trophy, Target, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui';
import { HabitConfig, HABIT_KEYS, type HabitKey } from '@/types/enums';
import type { StatsData } from '../hooks/useStats';

interface StreaksDisplayProps {
  stats: StatsData;
}

interface StreakCardProps {
  title: string;
  current: number;
  longest: number;
  color: string;
  icon?: React.ReactNode;
}

function StreakCard({ title, current, longest, color, icon }: StreakCardProps) {
  const isActive = current > 0;

  return (
    <Card variant="paper" padding="md" className="relative overflow-hidden">
      {/* Background flame effect for active streaks */}
      {isActive && current >= 7 && (
        <div
          className="absolute right-0 top-0 h-full w-1/3 opacity-10"
          style={{
            background: `linear-gradient(to right, transparent, ${color})`,
          }}
        />
      )}

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon || (
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            )}
            <span className="font-medium text-[var(--color-ink)]">{title}</span>
          </div>
          {isActive && (
            <Flame
              className="h-5 w-5"
              style={{ color: current >= 7 ? '#F97316' : '#FCD34D' }}
            />
          )}
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-[var(--color-ink-light)]">Current</p>
            <p
              className="font-handwriting text-4xl"
              style={{ color: isActive ? color : 'var(--color-ink-light)' }}
            >
              {current}
            </p>
            <p className="text-xs text-[var(--color-ink-light)]">
              {current === 1 ? 'day' : 'days'}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-[var(--color-ink-light)]">Longest</p>
            <p className="font-handwriting text-2xl text-[var(--color-ink)]">
              {longest}
            </p>
            <p className="text-xs text-[var(--color-ink-light)]">
              {longest === 1 ? 'day' : 'days'}
            </p>
          </div>
        </div>

        {/* Progress to longest */}
        {longest > 0 && (
          <div className="mt-3">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-cream-300)]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((current / longest) * 100, 100)}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            {current > 0 && current < longest && (
              <p className="mt-1 text-xs text-[var(--color-ink-light)]">
                {longest - current} more to beat your record!
              </p>
            )}
            {current >= longest && current > 0 && (
              <p className="mt-1 text-xs" style={{ color }}>
                You're at your best!
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export function StreaksDisplay({ stats }: StreaksDisplayProps) {
  // Find the best habit streak
  const bestStreak = HABIT_KEYS.reduce(
    (best, key) => {
      const streak = stats.habitStats[key];
      if (streak.longestStreak > best.longest) {
        return { key, longest: streak.longestStreak };
      }
      return best;
    },
    { key: 'workout' as HabitKey, longest: 0 }
  );

  // Calculate total active streaks
  const activeStreaks = HABIT_KEYS.filter(
    (key) => stats.habitStats[key].streak > 0
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card variant="paper" padding="md" className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-[var(--color-ink-light)]">Active Streaks</p>
            <p className="font-handwriting text-2xl text-[var(--color-ink)]">
              {activeStreaks + (stats.currentJournalStreak > 0 ? 1 : 0)}
            </p>
          </div>
        </Card>

        <Card variant="paper" padding="md" className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <Trophy className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm text-[var(--color-ink-light)]">Best Streak Ever</p>
            <p className="font-handwriting text-2xl text-[var(--color-ink)]">
              {Math.max(stats.longestJournalStreak, bestStreak.longest)} days
            </p>
          </div>
        </Card>

        <Card variant="paper" padding="md" className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Target className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-[var(--color-ink-light)]">Completion Rate</p>
            <p className="font-handwriting text-2xl text-[var(--color-ink)]">
              {Math.round((stats.entriesCount / stats.totalDays) * 100)}%
            </p>
          </div>
        </Card>
      </div>

      {/* Journal streak */}
      <div>
        <h3 className="mb-4 font-handwriting text-xl text-[var(--color-ink)]">
          Journal Streak
        </h3>
        <div className="max-w-md">
          <StreakCard
            title="Daily Journaling"
            current={stats.currentJournalStreak}
            longest={stats.longestJournalStreak}
            color="#22C55E"
            icon={<TrendingUp className="h-4 w-4 text-green-500" />}
          />
        </div>
      </div>

      {/* Habit streaks */}
      <div>
        <h3 className="mb-4 font-handwriting text-xl text-[var(--color-ink)]">
          Habit Streaks
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {HABIT_KEYS.filter(key => HabitConfig[key].goalType === 'maximize').map((key) => {
            const habit = HabitConfig[key];
            const streak = stats.habitStats[key];

            return (
              <StreakCard
                key={key}
                title={habit.label}
                current={streak.streak}
                longest={streak.longestStreak}
                color={habit.color}
              />
            );
          })}
        </div>
      </div>

      {/* Habits to reduce (inverted - show days without) */}
      <div>
        <h3 className="mb-4 font-handwriting text-xl text-[var(--color-ink)]">
          Reduction Goals
        </h3>
        <p className="mb-4 text-sm text-[var(--color-ink-light)]">
          These habits track days without - the higher the better!
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {HABIT_KEYS.filter(key => HabitConfig[key].goalType === 'minimize').map((key) => {
            const habit = HabitConfig[key];
            const stat = stats.habitStats[key];
            // For minimize habits, we want to show days WITHOUT the habit
            const daysWithout = stats.entriesCount - stat.completedDays;
            const percentWithout = Math.round((daysWithout / stats.entriesCount) * 100);

            return (
              <Card key={key} variant="paper" padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="font-medium text-[var(--color-ink)]">
                      {habit.label}-free days
                    </span>
                  </div>
                  <span
                    className="font-handwriting text-2xl"
                    style={{ color: percentWithout >= 80 ? '#22C55E' : habit.color }}
                  >
                    {daysWithout}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--color-ink-light)]">
                  {percentWithout}% of tracked days
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
