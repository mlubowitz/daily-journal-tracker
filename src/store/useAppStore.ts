import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DayEntry } from '@/types/models';

interface AppState {
  // Current entry being edited
  currentEntry: DayEntry | null;
  isDirty: boolean;
  isSaving: boolean;

  // Actions
  setCurrentEntry: (entry: DayEntry | null) => void;
  updateCurrentEntry: (updates: Partial<DayEntry>) => void;
  markClean: () => void;
  setSaving: (saving: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      currentEntry: null,
      isDirty: false,
      isSaving: false,

      setCurrentEntry: (entry) =>
        set(
          {
            currentEntry: entry,
            isDirty: false,
          },
          false,
          'setCurrentEntry'
        ),

      updateCurrentEntry: (updates) =>
        set(
          (state) => ({
            currentEntry: state.currentEntry
              ? { ...state.currentEntry, ...updates }
              : null,
            isDirty: true,
          }),
          false,
          'updateCurrentEntry'
        ),

      markClean: () => set({ isDirty: false }, false, 'markClean'),

      setSaving: (saving) => set({ isSaving: saving }, false, 'setSaving'),
    }),
    { name: 'app-store' }
  )
);
