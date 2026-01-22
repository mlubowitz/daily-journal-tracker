import { TrendingUp, TrendingDown, Moon, Clock, Flame } from 'lucide-react';
import { Card } from '@/components/ui';
import { MoodEmojis, MoodColors, HabitConfig, HABIT_KEYS } from '@/types/enums';
import type { StatsData } from '../hooks/useStats';

interface StatsOverviewProps {
  stats: StatsData;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

function StatCard({ title, value, subtitle, icon, trend, color }: StatCardProps) {
  return (
    <Card variant="paper" padding="md" className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--color-ink-light)]">{title}</span>
        {icon && <span className="text-[var(--color-ink-light)]">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span
          className="font-handwriting text-3xl"
          style={{ color: color ?? 'var(--color-ink)' }}
        >
          {value}
        </span>
        {trend && trend !== 'neutral' && (
          <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
            {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          </span>
        )}
      </div>
      {subtitle && (
        <span className="text-xs text-[var(--color-ink-light)]">{subtitle}</span>
      )}
    </Card>
  );
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const moodRounded = Math.round(stats.averageMood) as 1 | 2 | 3 | 4 | 5;
  const moodEmoji = stats.averageMood > 0 ? MoodEmojis[moodRounded] : '—';
  const moodColor = stats.averageMood > 0 ? MoodColors[moodRounded] : undefined;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary section */}
      <div>
        <h3 className="mb-4 font-handwriting text-xl text-[var(--color-ink)]">
          Summary ({stats.entriesCount} entries)
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard
            title="Average Mood"
            value={`${moodEmoji} ${stats.averageMood.toFixed(1)}`}
            subtitle="out of 5"
            color={moodColor}
          />
          <StatCard
            title="Average Sleep"
            value={formatHours(stats.averageSleep)}
            subtitle="per night"
            icon={<Moon className="h-4 w-4" />}
          />
          <StatCard
            title="Screen Time"
            value={formatMinutes(stats.averageScreenTime)}
            subtitle="daily average"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard
            title="Journal Streak"
            value={stats.currentJournalStreak}
            subtitle={`Best: ${stats.longestJournalStreak} days`}
            icon={<Flame className="h-4 w-4" />}
            color={stats.currentJournalStreak > 0 ? '#F97316' : undefined}
          />
        </div>
      </div>

      {/* Mood distribution */}
      <div>
        <h3 className="mb-4 font-handwriting text-xl text-[var(--color-ink)]">
          Mood Distribution
        </h3>
        <Card variant="paper" padding="md">
          <div className="flex items-end justify-around gap-2 h-32">
            {([1, 2, 3, 4, 5] as const).map((mood) => {
              const count = stats.moodDistribution[mood];
              const maxCount = Math.max(...Object.values(stats.moodDistribution), 1);
              const height = (count / maxCount) * 100;

              return (
                <div key={mood} className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 rounded-t-md transition-all duration-300"
                    style={{
                      height: `${Math.max(height, 4)}%`,
                      backgroundColor: MoodColors[mood],
                      opacity: count > 0 ? 1 : 0.3,
                    }}
                  />
                  <span className="text-xl">{MoodEmojis[mood]}</span>
                  <span className="text-xs text-[var(--color-ink-light)]">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Habit stats */}
      <div>
        <h3 className="mb-4 font-handwriting text-xl text-[var(--color-ink)]">
          Habit Tracking
        </h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {HABIT_KEYS.map((key) => {
            const habitInfo = HabitConfig[key];
            const habitStat = stats.habitStats[key];
            const isGoodProgress = habitInfo.goalType === 'maximize'
              ? habitStat.percentage >= 50
              : habitStat.percentage <= 20;

            return (
              <Card key={key} variant="paper" padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: habitInfo.color }}
                    />
                    <span className="font-medium text-[var(--color-ink)]">
                      {habitInfo.label}
                    </span>
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: isGoodProgress ? '#22C55E' : '#EF4444',
                    }}
                  >
                    {habitStat.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--color-cream-300)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${habitStat.percentage}%`,
                      backgroundColor: habitInfo.color,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-[var(--color-ink-light)]">
                  <span>{habitStat.completedDays} days</span>
                  <span>
                    {habitStat.streak > 0 && `${habitStat.streak} day streak`}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
