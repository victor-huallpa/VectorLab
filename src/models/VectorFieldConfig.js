/**
 * @typedef {Object} Domain
 * @property {number} xmin
 * @property {number} xmax
 * @property {number} ymin
 * @property {number} ymax
 */

/**
 * @typedef {Object} VectorFieldConfig
 * @property {string} p            Expresión P(x,y)
 * @property {string} q            Expresión Q(x,y)
 * @property {Domain} domain
 * @property {number} density       Vectores por eje (resolución de la grilla)
 * @property {number} scale        Factor de escala visual de las flechas
 * @property {boolean} colorByMagnitude
 * @property {boolean} showParticles
 */

export const DEFAULT_DOMAIN = { xmin: -5, xmax: 5, ymin: -5, ymax: 5 };

/** @returns {VectorFieldConfig} */
export function createDefaultFieldConfig() {
  return {
    p: '-y',
    q: 'x',
    domain: { ...DEFAULT_DOMAIN },
    density: 17,
    scale: 1,
    colorByMagnitude: true,
    showParticles: true,
  };
}

/**
 * Normaliza y acota valores de configuración a rangos seguros para el render.
 * @param {Partial<VectorFieldConfig>} config
 * @returns {VectorFieldConfig}
 */
export function sanitizeFieldConfig(config) {
  const base = createDefaultFieldConfig();
  const merged = { ...base, ...config, domain: { ...base.domain, ...(config?.domain || {}) } };

  merged.density = clamp(Math.round(merged.density), 5, 40);
  merged.scale = clamp(merged.scale, 0.1, 3);

  if (merged.domain.xmin >= merged.domain.xmax) {
    merged.domain.xmax = merged.domain.xmin + 1;
  }
  if (merged.domain.ymin >= merged.domain.ymax) {
    merged.domain.ymax = merged.domain.ymin + 1;
  }
  return merged;
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}
