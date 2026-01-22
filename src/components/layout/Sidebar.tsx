import { useState } from 'react';
import { format } from 'date-fns';
import { BookOpen, Calendar, BarChart3, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCalendarStore, useUIStore } from '@/store';
import { cn } from '@/utils/cn';
import { Button, Card } from '@/components/ui';
import { DayGrid, MonthHeader, useCalendar } from '@/features/calendar';
import { LoadingSpinner } from '@/components/common';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    selectedDate,
    viewingMonth,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
  } = useCalendarStore();
  const { isSidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const [isCalendarHovered, setIsCalendarHovered] = useState(false);

  const { calendarDays, entriesMap, isLoading: calendarLoading } =
    useCalendar(viewingMonth);

  const handleDaySelect = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    navigate(`/calendar/${dateString}`);
    setIsCalendarHovered(false);
  };

  const navItems = [
    { path: '/journal', icon: BookOpen, label: 'Journal' },
    { path: '/calendar', icon: Calendar, label: 'Calendar', hasHover: true },
    { path: '/stats', icon: BarChart3, label: 'Statistics' },
    { path: '/reflections', icon: Target, label: 'Reflections' },
  ];

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-[var(--color-line)] bg-[var(--color-cream-200)] transition-all duration-300',
        isSidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo/Title */}
      <div className="flex items-center justify-between border-b border-[var(--color-line)] p-4">
        {!isSidebarCollapsed && (
          <h2 className="font-handwriting text-xl text-[var(--color-ink)]">
            Daily Journal
          </h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="ml-auto"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const isCalendarItem = item.path === '/calendar';

          return (
            <div
              key={item.path}
              className="relative"
              onMouseEnter={() => isCalendarItem && setIsCalendarHovered(true)}
              onMouseLeave={() => isCalendarItem && setIsCalendarHovered(false)}
            >
              <button
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
                  isActive
                    ? 'bg-[var(--color-cream-50)] text-[var(--color-ink)] shadow-paper'
                    : 'text-[var(--color-ink-light)] hover:bg-[var(--color-cream-300)]'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>

              {/* Calendar hover popup - only show when not on calendar page */}
              {isCalendarItem && isCalendarHovered && !isActive && (
                <div className="absolute left-full top-0 z-50 pl-2">
                  <Card variant="paper" padding="md" className="w-72 shadow-lg">
                    <MonthHeader
                      month={viewingMonth}
                      onPreviousMonth={goToPreviousMonth}
                      onNextMonth={goToNextMonth}
                      onToday={goToToday}
                    />
                    <div className="mt-3">
                      {calendarLoading ? (
                        <LoadingSpinner />
                      ) : (
                        <DayGrid
                          days={calendarDays}
                          entriesMap={entriesMap}
                          currentMonth={viewingMonth}
                          selectedDate={selectedDate}
                          onDaySelect={handleDaySelect}
                          highlightEmpty
                        />
                      )}
                    </div>
                    <p className="mt-3 text-center text-xs text-[var(--color-ink-light)]">
                      Click a day to view entry
                    </p>
                  </Card>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />
    </aside>
  );
}
