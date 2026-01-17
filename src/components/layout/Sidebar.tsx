import { useMemo } from 'react';
import { format, startOfYear, eachMonthOfInterval, endOfYear, isSameMonth } from 'date-fns';
import { BookOpen, BarChart3, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCalendarStore, useUIStore } from '@/store';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { viewingMonth, setViewingMonth } = useCalendarStore();
  const { isSidebarCollapsed, setSidebarCollapsed } = useUIStore();

  const currentYear = viewingMonth.getFullYear();

  const months = useMemo(() => {
    return eachMonthOfInterval({
      start: startOfYear(viewingMonth),
      end: endOfYear(viewingMonth),
    });
  }, [viewingMonth]);

  const navItems = [
    { path: '/journal', icon: BookOpen, label: 'Journal' },
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
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
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
          );
        })}
      </nav>

      {/* Month tabs */}
      {!isSidebarCollapsed && (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Year selector */}
          <div className="flex items-center justify-between border-t border-[var(--color-line)] px-4 py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const prevYear = new Date(currentYear - 1, viewingMonth.getMonth());
                setViewingMonth(prevYear);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-handwriting text-lg text-[var(--color-ink)]">
              {currentYear}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const nextYear = new Date(currentYear + 1, viewingMonth.getMonth());
                setViewingMonth(nextYear);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Month list */}
          <div className="flex-1 overflow-y-auto px-2 pb-4">
            <div className="flex flex-col gap-1">
              {months.map((month) => {
                const isActive = isSameMonth(month, viewingMonth);
                return (
                  <button
                    key={month.toISOString()}
                    onClick={() => setViewingMonth(month)}
                    className={cn(
                      'notebook-tab text-left text-sm',
                      isActive && 'active'
                    )}
                  >
                    {format(month, 'MMMM')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
