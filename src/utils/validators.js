/**
 * @param {import('../models/VectorFieldConfig.js').Domain} domain
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateDomain(domain) {
  const { xmin, xmax, ymin, ymax } = domain;
  if ([xmin, xmax, ymin, ymax].some((v) => Number.isNaN(v))) {
    return { valid: false, error: 'Todos los límites del dominio deben ser números.' };
  }
  if (xmin >= xmax) {
    return { valid: false, error: 'xmin debe ser menor que xmax.' };
  }
  if (ymin >= ymax) {
    return { valid: false, error: 'ymin debe ser menor que ymax.' };
  }
  const width = xmax - xmin;
  const height = ymax - ymin;
  if (width > 200 || height > 200) {
    return { valid: false, error: 'El dominio es demasiado grande (máx. 200 unidades por eje).' };
  }
  return { valid: true };
}

/**
 * Valida el intervalo del parámetro [t0, t1] usado por una curva
 * paramétrica (módulo Integrales de Línea). Misma forma que
 * validateDomain: solo cotas numéricas de UI, sin evaluar matemática.
 * @param {number} t0
 * @param {number} t1
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateInterval(t0, t1) {
  if (Number.isNaN(t0) || Number.isNaN(t1)) {
    return { valid: false, error: 't0 y t1 deben ser números.' };
  }
  if (t0 === t1) {
    return { valid: false, error: 't0 debe ser distinto de t1.' };
  }
  if (t0 > t1) {
    return { valid: false, error: 't0 debe ser menor que t1.' };
  }
  if (t1 - t0 > 1000) {
    return { valid: false, error: 'El intervalo [t0, t1] es demasiado grande (máx. 1000 unidades).' };
  }
  return { valid: true };
}
