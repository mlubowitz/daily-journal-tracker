import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout';

// Lazy load pages for better performance
import { lazy, Suspense } from 'react';

const JournalPage = lazy(() => import('@/pages/JournalPage'));
const StatsPage = lazy(() => import('@/pages/StatsPage'));
const ReflectionsPage = lazy(() => import('@/pages/ReflectionsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="animate-spin text-4xl">📝</div>
    </div>
  );
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/journal" replace />,
      },
      {
        path: 'journal',
        element: (
          <SuspenseWrapper>
            <JournalPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'journal/:date',
        element: (
          <SuspenseWrapper>
            <JournalPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'stats',
        element: (
          <SuspenseWrapper>
            <StatsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'stats/:tab',
        element: (
          <SuspenseWrapper>
            <StatsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'reflections',
        element: (
          <SuspenseWrapper>
            <ReflectionsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'settings',
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
]);
