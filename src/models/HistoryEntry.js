/**
 * @typedef {Object} HistoryEntry
 * @property {string} id
 * @property {string} fecha            ISO string
 * @property {{p: string, q: string}} campoVectorial
 * @property {import('./VectorFieldConfig.js').VectorFieldConfig} configuracion
 * @property {string} tipoVisualizacion  Ej: 'campo-vectorial-2d'
 */

/**
 * @param {{p: string, q: string, config: import('./VectorFieldConfig.js').VectorFieldConfig}} params
 * @returns {HistoryEntry}
 */
export function createHistoryEntry({ p, q, config }) {
  return {
    id: generateId(),
    fecha: new Date().toISOString(),
    campoVectorial: { p, q },
    configuracion: config,
    tipoVisualizacion: 'campo-vectorial-2d',
  };
}

function generateId() {
  return `hist_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
