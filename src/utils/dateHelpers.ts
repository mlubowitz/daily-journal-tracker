import { format, parseISO, isToday, isSameDay, startOfWeek, endOfWeek } from 'date-fns';

export const formatDateForDB = (date: Date): string => format(date, 'yyyy-MM-dd');

export const formatDateDisplay = (date: Date): string =>
  format(date, 'EEEE, MMMM d, yyyy');

export const formatMonthYear = (date: Date): string => format(date, 'MMMM yyyy');

export const formatMonthShort = (date: Date): string => format(date, 'MMM');

export const formatWeekRange = (date: Date): string => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
};

export const parseDateString = (dateString: string): Date => parseISO(dateString);

export const checkIsToday = (date: Date): boolean => isToday(date);

export const checkIsSameDay = (date1: Date, date2: Date): boolean =>
  isSameDay(date1, date2);
