import { create } from 'zustand';
import {
  createDefaultLineIntegralField,
  createDefaultLineIntegralCurve,
  createDefaultLineIntegralConfig,
  sanitizeLineIntegralConfig,
  sanitizeLineIntegralCurve,
} from '../models/LineIntegralConfig.js';

/**
 * Estado global del módulo "Integrales de Línea". Vive en un store
 * separado del de Campos Vectoriales y del de UI, siguiendo la misma
 * convención documentada en docs/ARCHITECTURE.md (§4): un store por
 * dominio, para que ningún módulo arrastre el estado de otro.
 *
 * Solo guarda lo que el usuario escribe (campo, curva, opciones de
 * visualización/dimensión). El cómputo real de la integral vive en
 * domain/line-integral/ y se conecta a través de
 * useLineIntegralComputation, que lee este estado y llama a
 * services/lineIntegralService.js.
 */
export const useLineIntegralStore = create((set) => ({
  field: createDefaultLineIntegralField(),
  curve: createDefaultLineIntegralCurve(),
  config: createDefaultLineIntegralConfig(),

  setField: (partial) => set((state) => ({ field: { ...state.field, ...partial } })),

  setCurve: (partial) =>
    set((state) => ({ curve: sanitizeLineIntegralCurve({ ...state.curve, ...partial }) })),

  updateConfig: (partial) =>
    set((state) => ({ config: sanitizeLineIntegralConfig({ ...state.config, ...partial }) })),

  loadPreset: (preset) =>
    set((state) => ({
      field: { ...createDefaultLineIntegralField(), ...preset.field },
      curve: sanitizeLineIntegralCurve(preset.curve),
      config: sanitizeLineIntegralConfig({ ...state.config, is3D: Boolean(preset.is3D) }),
    })),

  reset: () =>
    set({
      field: createDefaultLineIntegralField(),
      curve: createDefaultLineIntegralCurve(),
      config: createDefaultLineIntegralConfig(),
    }),
}));
