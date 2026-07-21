import { create } from 'zustand';
import { createDefaultFieldConfig, sanitizeFieldConfig } from '../models/VectorFieldConfig.js';

/**
 * Estado global del módulo "Campos Vectoriales". Vive en un store
 * separado del historial y de la UI para que futuros módulos
 * (Gradiente, Divergencia...) puedan tener el suyo propio sin
 * arrastrar este estado.
 */
export const useFieldStore = create((set, get) => ({
  p: createDefaultFieldConfig().p,
  q: createDefaultFieldConfig().q,
  config: createDefaultFieldConfig(),

  setExpressions: (p, q) => set({ p, q }),

  updateConfig: (partial) =>
    set((state) => ({ config: sanitizeFieldConfig({ ...state.config, ...partial }) })),

  updateDomain: (partialDomain) =>
    set((state) => ({
      config: sanitizeFieldConfig({
        ...state.config,
        domain: { ...state.config.domain, ...partialDomain },
      }),
    })),

  loadPreset: (preset) =>
    set({
      p: preset.p,
      q: preset.q,
      config: sanitizeFieldConfig({ domain: preset.domain }),
    }),

  reset: () => {
    const def = createDefaultFieldConfig();
    set({ p: def.p, q: def.q, config: def });
  },
}));
