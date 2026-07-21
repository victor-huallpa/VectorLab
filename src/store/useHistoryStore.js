import { create } from 'zustand';
import * as historyService from '../services/historyService.js';
import { createHistoryEntry } from '../models/HistoryEntry.js';

export const useHistoryStore = create((set, get) => ({
  entries: [],
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  error: null,

  loadHistory: async () => {
    set({ status: 'loading', error: null });
    try {
      const entries = await historyService.fetchHistory();
      set({ entries, status: 'success' });
    } catch (err) {
      set({ status: 'error', error: err.message });
    }
  },

  addEntry: async ({ p, q, config }) => {
    const entry = createHistoryEntry({ p, q, config });
    try {
      await historyService.saveHistoryEntry(entry);
      set((state) => ({ entries: [entry, ...state.entries] }));
      return entry;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  removeEntry: async (id) => {
    await historyService.deleteHistoryEntry(id);
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) }));
  },

  clearAll: async () => {
    await historyService.clearHistory();
    set({ entries: [] });
  },
}));
