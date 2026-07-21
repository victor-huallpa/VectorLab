import { evaluateAt } from '../../utils/mathParser.js';

/**
 * Cálculo numérico de derivadas parciales por diferencias centradas.
 * Vive fuera de FieldAnalyzer porque tanto el analizador como el
 * clasificador necesitan el jacobiano puntual (ej. en el origen) y no
 * queremos que el clasificador dependa de haber corrido el análisis
 * completo primero.
 *
 * h pequeño pero no extremo: valores más chicos que 1e-4 amplifican el
 * ruido de mathjs en expresiones con funciones trigonométricas.
 */
const H = 1e-3;

/** @returns {number} dF/dx en (x,y), o NaN si la expresión no es evaluable ahí. */
export function partialX(expression, x, y) {
  const a = evaluateAt(expression, x + H, y);
  const b = evaluateAt(expression, x - H, y);
  if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
  return (a - b) / (2 * H);
}

/** @returns {number} dF/dy en (x,y), o NaN si la expresión no es evaluable ahí. */
export function partialY(expression, x, y) {
  const a = evaluateAt(expression, x, y + H);
  const b = evaluateAt(expression, x, y - H);
  if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
  return (a - b) / (2 * H);
}

/**
 * Jacobiano de (P, Q) en un punto:
 *   [ dP/dx  dP/dy ]
 *   [ dQ/dx  dQ/dy ]
 * Es la base tanto de la divergencia y el rotacional puntuales como de
 * la clasificación por plano traza-determinante que usa FieldClassifier.
 * @returns {{ dPdx:number, dPdy:number, dQdx:number, dQdy:number } | null}
 */
export function jacobianAt(p, q, x, y) {
  const dPdx = partialX(p, x, y);
  const dPdy = partialY(p, x, y);
  const dQdx = partialX(q, x, y);
  const dQdy = partialY(q, x, y);
  if ([dPdx, dPdy, dQdx, dQdy].some(Number.isNaN)) return null;
  return { dPdx, dPdy, dQdx, dQdy };
}

/** Divergencia puntual: dP/dx + dQ/dy. */
export function divergenceAt(p, q, x, y) {
  const j = jacobianAt(p, q, x, y);
  if (!j) return NaN;
  return j.dPdx + j.dQdy;
}

/** Rotacional escalar (componente z) puntual: dQ/dx - dP/dy. */
export function curlAt(p, q, x, y) {
  const j = jacobianAt(p, q, x, y);
  if (!j) return NaN;
  return j.dQdx - j.dPdy;
}

/** Magnitud del vector (P(x,y), Q(x,y)). */
export function magnitudeAt(p, q, x, y) {
  const px = evaluateAt(p, x, y);
  const qy = evaluateAt(q, x, y);
  if (Number.isNaN(px) || Number.isNaN(qy)) return NaN;
  return Math.hypot(px, qy);
}

/**
 * Genera puntos de muestreo en el dominio, evitando el origen exacto
 * (donde muchos campos con división por x/y no son evaluables).
 * @returns {Array<{x:number, y:number}>}
 */
export function samplePoints(domain, resolution = 12) {
  const points = [];
  const stepX = (domain.xmax - domain.xmin) / resolution;
  const stepY = (domain.ymax - domain.ymin) / resolution;
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const x = domain.xmin + i * stepX;
      const y = domain.ymin + j * stepY;
      if (Math.abs(x) < 1e-6 && Math.abs(y) < 1e-6) continue;
      points.push({ x, y });
    }
  }
  return points;
}
