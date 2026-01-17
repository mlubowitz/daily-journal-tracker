import { create } from 'zustand';
import type { StatsTab } from '@/types/enums';

interface UIState {
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  isExportModalOpen: boolean;
  isSearchOpen: boolean;
  activeStatsTab: StatsTab;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setExportModalOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setActiveStatsTab: (tab: StatsTab) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  isExportModalOpen: false,
  isSearchOpen: false,
  activeStatsTab: 'overview',

  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  setExportModalOpen: (open) => set({ isExportModalOpen: open }),

  setSearchOpen: (open) => set({ isSearchOpen: open }),

  setActiveStatsTab: (tab) => set({ activeStatsTab: tab }),
}));
