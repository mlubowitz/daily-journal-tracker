import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Card, Button } from '@/components/ui';
import { MoodEmojis, MoodColors } from '@/types/enums';
import type { StatsData } from '../hooks/useStats';
import type { MoodValue } from '@/types/models';

interface MoodTrendsChartProps {
  stats: StatsData;
}

type ChartType = 'mood' | 'sleep' | 'both';

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload || !label) return null;

  return (
    <Card variant="paper" padding="sm" className="shadow-lg">
      <p className="text-sm font-medium text-[var(--color-ink)]">
        {format(parseISO(label), 'MMM d, yyyy')}
      </p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
          {entry.dataKey === 'mood' && (
            <>
              Mood: {MoodEmojis[Math.round(entry.value) as MoodValue]} {entry.value.toFixed(1)}
            </>
          )}
          {entry.dataKey === 'hours' && (
            <>
              Sleep: {entry.value.toFixed(1)}h
            </>
          )}
        </p>
      ))}
    </Card>
  );
}

export function MoodTrendsChart({ stats }: MoodTrendsChartProps) {
  const [chartType, setChartType] = useState<ChartType>('mood');

  // Combine mood and sleep data
  const combinedData = stats.moodTrend.map((mood) => {
    const sleep = stats.sleepTrend.find(s => s.date === mood.date);
    return {
      date: mood.date,
      mood: mood.mood,
      hours: sleep?.hours ?? 0,
    };
  });

  // Calculate moving average (7-day)
  const dataWithAverage = combinedData.map((item, index, arr) => {
    const start = Math.max(0, index - 6);
    const subset = arr.slice(start, index + 1);
    const avgMood = subset.reduce((sum, d) => sum + d.mood, 0) / subset.length;
    const avgSleep = subset.reduce((sum, d) => sum + d.hours, 0) / subset.length;
    return {
      ...item,
      avgMood: parseFloat(avgMood.toFixed(2)),
      avgSleep: parseFloat(avgSleep.toFixed(2)),
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-handwriting text-xl text-[var(--color-ink)]">
          Trends Over Time
        </h3>
        <div className="flex gap-2">
          <Button
            variant={chartType === 'mood' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setChartType('mood')}
          >
            Mood
          </Button>
          <Button
            variant={chartType === 'sleep' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setChartType('sleep')}
          >
            Sleep
          </Button>
          <Button
            variant={chartType === 'both' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setChartType('both')}
          >
            Both
          </Button>
        </div>
      </div>

      <Card variant="paper" padding="lg">
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'both' ? (
            <LineChart data={dataWithAverage}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(parseISO(date), 'M/d')}
                stroke="var(--color-ink-light)"
                fontSize={12}
              />
              <YAxis
                yAxisId="mood"
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                stroke="var(--color-ink-light)"
                fontSize={12}
              />
              <YAxis
                yAxisId="sleep"
                orientation="right"
                domain={[0, 12]}
                stroke="var(--color-ink-light)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="mood"
                type="monotone"
                dataKey="mood"
                stroke={MoodColors[4]}
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="mood"
                type="monotone"
                dataKey="avgMood"
                stroke={MoodColors[4]}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                yAxisId="sleep"
                type="monotone"
                dataKey="hours"
                stroke="#6366F1"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          ) : (
            <AreaChart data={dataWithAverage}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={MoodColors[4]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={MoodColors[4]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(parseISO(date), 'M/d')}
                stroke="var(--color-ink-light)"
                fontSize={12}
              />
              <YAxis
                domain={chartType === 'mood' ? [1, 5] : [0, 12]}
                ticks={chartType === 'mood' ? [1, 2, 3, 4, 5] : [0, 3, 6, 9, 12]}
                stroke="var(--color-ink-light)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              {chartType === 'mood' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke={MoodColors[4]}
                    fill="url(#moodGradient)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgMood"
                    stroke={MoodColors[5]}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </>
              )}
              {chartType === 'sleep' && (
                <>
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#6366F1"
                    fill="url(#sleepGradient)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgSleep"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </>
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>

        <div className="mt-4 flex justify-center gap-6 text-sm text-[var(--color-ink-light)]">
          {chartType === 'mood' && (
            <>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-6" style={{ backgroundColor: MoodColors[4] }} />
                <span>Daily Mood</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-6 border-b-2 border-dashed" style={{ borderColor: MoodColors[5] }} />
                <span>7-Day Average</span>
              </div>
            </>
          )}
          {chartType === 'sleep' && (
            <>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-6 bg-indigo-500" />
                <span>Daily Sleep</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-6 border-b-2 border-dashed border-indigo-600" />
                <span>7-Day Average</span>
              </div>
            </>
          )}
          {chartType === 'both' && (
            <>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-6" style={{ backgroundColor: MoodColors[4] }} />
                <span>Mood</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-6 bg-indigo-500" />
                <span>Sleep</span>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
