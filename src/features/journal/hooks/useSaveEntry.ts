import { useCallback, useRef } from 'react';
import { db } from '@/db';
import type { DayEntry } from '@/types/models';

const DEBOUNCE_DELAY = 500; // 500ms debounce for auto-save

export function useSaveEntry() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pendingPromiseRef = useRef<{
    resolve: () => void;
    reject: (error: Error) => void;
  } | null>(null);

  const saveEntryToDb = async (entry: DayEntry): Promise<void> => {
    const now = new Date().toISOString();

    try {
      if (entry.id) {
        // Update existing entry
        await db.dayEntries.update(entry.id, {
          ...entry,
          updatedAt: now,
        });
      } else {
        // Create new entry
        await db.dayEntries.add({
          ...entry,
          createdAt: now,
          updatedAt: now,
        });
      }
    } catch (error) {
      console.error('Failed to save entry:', error);
      throw error;
    }
  };

  const saveEntry = useCallback((entry: DayEntry): Promise<void> => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Resolve any previous pending promise
    if (pendingPromiseRef.current) {
      pendingPromiseRef.current.resolve();
    }

    // Return a new promise that resolves when save completes
    return new Promise((resolve, reject) => {
      pendingPromiseRef.current = { resolve, reject };

      // Debounce the actual save
      timeoutRef.current = setTimeout(async () => {
        try {
          await saveEntryToDb(entry);
          resolve();
        } catch (error) {
          reject(error as Error);
        } finally {
          pendingPromiseRef.current = null;
        }
      }, DEBOUNCE_DELAY);
    });
  }, []);

  return { saveEntry };
}
