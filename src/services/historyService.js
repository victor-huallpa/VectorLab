import { simulateRequest, simulateRequestWithFailure } from './api/httpClient.js';

const STORAGE_KEY = 'vector-lab:history';

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/**
 * Historial de consultas persistido en LocalStorage, expuesto con la
 * misma forma que tendría una API REST real (GET/POST/DELETE).
 * Cuando exista backend, solo este archivo cambia: cambiar
 * localStorage por llamadas a `services/api/httpClient.js` real.
 */

/** "GET /api/history" simulado. */
export function fetchHistory() {
  const entries = readStorage().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  return simulateRequest(entries);
}

/**
 * "POST /api/history" simulado.
 * @param {import('../models/HistoryEntry.js').HistoryEntry} entry
 */
export function saveHistoryEntry(entry) {
  return simulateRequestWithFailure(
    () => {
      const entries = readStorage();
      entries.push(entry);
      writeStorage(entries);
      return entry;
    },
    { failureRate: 0 }
  );
}

/** "DELETE /api/history/:id" simulado. */
export function deleteHistoryEntry(id) {
  return simulateRequestWithFailure(() => {
    const entries = readStorage().filter((e) => e.id !== id);
    writeStorage(entries);
    return { id };
  });
}

/** "DELETE /api/history" simulado (vaciar todo). */
export function clearHistory() {
  return simulateRequestWithFailure(() => {
    writeStorage([]);
    return true;
  });
}
