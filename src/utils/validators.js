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
