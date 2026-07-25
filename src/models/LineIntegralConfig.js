/**
 * @typedef {Object} LineIntegralField
 * @property {string} p            Expresión P(x,y,z) del campo F = P i + Q j [+ R k]
 * @property {string} q            Expresión Q(x,y,z) del campo F = P i + Q j [+ R k]
 * @property {string} r            Expresión R(x,y,z), componente k. Solo se usa si is3D es true.
 */

/**
 * @typedef {Object} LineIntegralCurve
 * @property {string} x            Parametrización x(t)
 * @property {string} y            Parametrización y(t)
 * @property {string} z            Parametrización z(t). Solo se usa si is3D es true.
 * @property {number} t0           Límite inferior del parámetro t
 * @property {number} t1           Límite superior del parámetro t
 */

/**
 * @typedef {Object} LineIntegralConfig
 * @property {number} samples       Cantidad de subdivisiones para aproximar la curva / integrar
 * @property {boolean} showField    Mostrar el campo vectorial de fondo junto a la curva
 * @property {boolean} showOrientation  Mostrar flechas de orientación sobre la curva
 * @property {boolean} is3D         Si la curva/campo es 2D (x,y) o 3D (x,y,z)
 */

/**
 * Estructura base del módulo "Integrales de Línea". Define la FORMA de
 * los datos (valores por defecto + acotamiento de UI), igual que
 * VectorFieldConfig.js hace para Campos Vectoriales. El propio cómputo
 * matemático (evaluación de P, Q, R, x(t), y(t), z(t) y de la integral)
 * vive en domain/line-integral/lineIntegralCalculus.js.
 */

/** @returns {LineIntegralField} */
export function createDefaultLineIntegralField() {
  return { p: '', q: '', r: '' };
}

/** @returns {LineIntegralCurve} */
export function createDefaultLineIntegralCurve() {
  return { x: '', y: '', z: '', t0: 0, t1: 1 };
}

/** @returns {LineIntegralConfig} */
export function createDefaultLineIntegralConfig() {
  return {
    samples: 100,
    showField: true,
    showOrientation: true,
    is3D: false,
  };
}

/**
 * Normaliza y acota valores de configuración a rangos seguros para el
 * render/cómputo (misma responsabilidad que sanitizeFieldConfig en
 * VectorFieldConfig.js: solo forma/rango de UI, no matemática de dominio).
 * @param {Partial<LineIntegralConfig>} config
 * @returns {LineIntegralConfig}
 */
export function sanitizeLineIntegralConfig(config) {
  const base = createDefaultLineIntegralConfig();
  const merged = { ...base, ...config };
  merged.samples = clamp(Math.round(merged.samples), 10, 500);
  merged.is3D = Boolean(merged.is3D);
  return merged;
}

/**
 * Acota el rango del parámetro t para que t0 < t1 (misma idea que el
 * saneo de dominio en VectorFieldConfig.js).
 * @param {Partial<LineIntegralCurve>} curve
 * @returns {LineIntegralCurve}
 */
export function sanitizeLineIntegralCurve(curve) {
  const base = createDefaultLineIntegralCurve();
  const merged = { ...base, ...curve };
  if (merged.t0 >= merged.t1) {
    merged.t1 = merged.t0 + 1;
  }
  return merged;
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}
