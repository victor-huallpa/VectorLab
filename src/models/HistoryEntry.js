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

/**
 * @typedef {Object} LineIntegralHistoryEntry
 * @property {string} id
 * @property {string} fecha                ISO string
 * @property {{p: string, q: string, r: string}} campoVectorial
 * @property {{x: string, y: string, z: string, t0: number, t1: number}} curva
 * @property {import('./LineIntegralConfig.js').LineIntegralConfig} configuracion
 * @property {string} tipoVisualizacion     'integral-linea-2d' | 'integral-linea-3d'
 */

/**
 * Análoga a `createHistoryEntry`, para el módulo "Integrales de Línea".
 * Se guarda en el mismo historial (misma forma de lista, mismo servicio
 * de persistencia); el discriminador `tipoVisualizacion` es lo que
 * permite a cada panel de historial mostrar solo las entradas de su
 * propio dominio, sin duplicar `historyService.js` ni el store.
 * @param {{field: {p: string, q: string, r: string}, curve: {x: string, y: string, z: string, t0: number, t1: number}, config: import('./LineIntegralConfig.js').LineIntegralConfig}} params
 * @returns {LineIntegralHistoryEntry}
 */
export function createLineIntegralHistoryEntry({ field, curve, config }) {
  return {
    id: generateId(),
    fecha: new Date().toISOString(),
    campoVectorial: { p: field.p, q: field.q, r: field.r },
    curva: { x: curve.x, y: curve.y, z: curve.z, t0: curve.t0, t1: curve.t1 },
    configuracion: config,
    tipoVisualizacion: config.is3D ? 'integral-linea-3d' : 'integral-linea-2d',
  };
}
