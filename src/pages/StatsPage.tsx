import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart3, Calendar } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { LoadingSpinner } from '@/components/common';
import {
  StatsOverview,
  MoodTrendsChart,
  HabitHeatmap,
  StreaksDisplay,
  StatsTabs,
  useStats,
  useHeatmapData,
} from '@/features/stats';
import type { StatsTab } from '@/types/enums';

export default function StatsPage() {
  const { tab: tabParam } = useParams<{ tab?: string }>();
  const navigate = useNavigate();

  const initialTab = (tabParam as StatsTab) || 'overview';
  const [activeTab, setActiveTab] = useState<StatsTab>(initialTab);
  const [monthsToShow, setMonthsToShow] = useState(1);
  const currentYear = new Date().getFullYear();

  const { stats, isLoading } = useStats(monthsToShow);
  const { data: heatmapData, isLoading: heatmapLoading } = useHeatmapData(currentYear);

  const handleTabChange = (tab: StatsTab) => {
    setActiveTab(tab);
    navigate(`/stats/${tab}`, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-4xl items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card variant="paper" padding="lg">
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <BarChart3 className="h-16 w-16 text-[var(--color-ink-light)]" />
            <h2 className="font-handwriting text-3xl text-[var(--color-ink)]">
              No Data Yet
            </h2>
            <p className="max-w-md text-[var(--color-ink-light)]">
              Start journaling to see your statistics! Track your habits, mood trends,
              and streaks here as your data builds up over time.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/journal')}
              className="mt-4"
            >
              Start Journaling
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-handwriting text-3xl text-[var(--color-ink)]">
          Statistics
        </h1>
        <p className="mt-1 text-[var(--color-ink-light)]">
          Track your progress and build better habits
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <StatsTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Period selector for overview and trends */}
      {(activeTab === 'overview' || activeTab === 'trends') && (
        <div className="mb-6 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[var(--color-ink-light)]" />
          <span className="text-sm text-[var(--color-ink-light)]">Show:</span>
          <div className="flex gap-1">
            {[1, 3, 6, 12].map((months) => (
              <Button
                key={months}
                variant={monthsToShow === months ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setMonthsToShow(months)}
              >
                {months === 1 ? '1 Month' : months === 12 ? '1 Year' : `${months} Months`}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Tab content */}
      <div className="space-y-6">
        {activeTab === 'overview' && <StatsOverview stats={stats} />}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <MoodTrendsChart stats={stats} />
            <StatsOverview stats={stats} />
          </div>
        )}

        {activeTab === 'streaks' && <StreaksDisplay stats={stats} />}

        {activeTab === 'year' && (
          <div className="space-y-6">
            {heatmapLoading ? (
              <LoadingSpinner />
            ) : (
              <HabitHeatmap data={heatmapData} year={currentYear} />
            )}

            {/* Year summary */}
            <Card variant="paper" padding="lg">
              <h3 className="mb-4 font-handwriting text-xl text-[var(--color-ink)]">
                {currentYear} Summary
              </h3>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-[var(--color-ink-light)]">Total Entries</p>
                  <p className="font-handwriting text-3xl text-[var(--color-ink)]">
                    {heatmapData.size}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-ink-light)]">Days Tracked</p>
                  <p className="font-handwriting text-3xl text-[var(--color-ink)]">
                    {Math.round((heatmapData.size / 365) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-ink-light)]">Total Words</p>
                  <p className="font-handwriting text-3xl text-[var(--color-ink)]">
                    {Array.from(heatmapData.values()).reduce(
                      (sum, entry) =>
                        sum + entry.journalText.split(/\s+/).filter((w) => w).length,
                      0
                    ).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-ink-light)]">Avg Mood</p>
                  <p className="font-handwriting text-3xl text-[var(--color-ink)]">
                    {heatmapData.size > 0
                      ? (
                          Array.from(heatmapData.values()).reduce(
                            (sum, entry) => sum + entry.mood,
                            0
                          ) / heatmapData.size
                        ).toFixed(1)
                      : '-'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
