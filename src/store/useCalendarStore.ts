import { create } from 'zustand';
import { startOfMonth, addMonths, subMonths } from 'date-fns';

interface CalendarState {
  selectedDate: Date;
  viewingMonth: Date;

  setSelectedDate: (date: Date) => void;
  setViewingMonth: (date: Date) => void;
  goToToday: () => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  selectedDate: new Date(),
  viewingMonth: startOfMonth(new Date()),

  setSelectedDate: (date) =>
    set({
      selectedDate: date,
      viewingMonth: startOfMonth(date),
    }),

  setViewingMonth: (date) =>
    set({
      viewingMonth: startOfMonth(date),
    }),

  goToToday: () =>
    set({
      selectedDate: new Date(),
      viewingMonth: startOfMonth(new Date()),
    }),

  goToPreviousMonth: () =>
    set((state) => ({
      viewingMonth: subMonths(state.viewingMonth, 1),
    })),

  goToNextMonth: () =>
    set((state) => ({
      viewingMonth: addMonths(state.viewingMonth, 1),
    })),
}));
