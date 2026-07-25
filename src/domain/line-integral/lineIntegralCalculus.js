import {
  evaluateScope,
  evaluateDerivativeAt,
  validateExpression,
} from '../../utils/mathParser.js';
import { validateInterval } from '../../utils/validators.js';

/**
 * Motor de cálculo del módulo "Integrales de Línea".
 *
 * Sigue la misma convención que domain/field-analysis/vectorCalculus.js:
 * funciones puras, sin React, que solo reciben strings/números y
 * devuelven strings/números. Esto permite probarlas de forma aislada y
 * que otros módulos futuros (integrales dobles, triples) puedan
 * reutilizarlas sin arrastrar UI.
 *
 * Soporta curvas y campos tanto 2D (x, y) como 3D (x, y, z) a través del
 * flag `is3D`: cuando es true, se incorpora la componente z de la curva
 * (`curve.z`) y la componente R del campo (`field.r`).
 */

/**
 * Evalúa el vector posición r(t) = (x(t), y(t)[, z(t)]) en un valor de t.
 * @param {{ x: string, y: string, z?: string }} curve
 * @param {number} t
 * @param {boolean} [is3D=false]
 * @returns {{ x: number, y: number, z?: number } | null} null si algún
 *   componente no es evaluable en ese t (p. ej. división por cero).
 */
export function evaluateCurveAt(curve, t, is3D = false) {
  const scope = { t };
  const x = evaluateScope(curve.x, scope);
  const y = evaluateScope(curve.y, scope);
  if (Number.isNaN(x) || Number.isNaN(y)) return null;

  if (!is3D) return { x, y };

  const z = evaluateScope(curve.z, scope);
  if (Number.isNaN(z)) return null;
  return { x, y, z };
}

/**
 * Evalúa la derivada r'(t) = (x'(t), y'(t)[, z'(t)]) en un valor de t.
 * Usa derivada simbólica cuando mathjs puede calcularla y cae a
 * diferencias finitas centradas en caso contrario (ver mathParser.js).
 * @param {{ x: string, y: string, z?: string }} curve
 * @param {number} t
 * @param {boolean} [is3D=false]
 * @returns {{ dx: number, dy: number, dz?: number } | null}
 */
export function curveDerivativeAt(curve, t, is3D = false) {
  const scope = { t };
  const dx = evaluateDerivativeAt(curve.x, 't', scope);
  const dy = evaluateDerivativeAt(curve.y, 't', scope);
  if (Number.isNaN(dx) || Number.isNaN(dy)) return null;

  if (!is3D) return { dx, dy };

  const dz = evaluateDerivativeAt(curve.z, 't', scope);
  if (Number.isNaN(dz)) return null;
  return { dx, dy, dz };
}

/**
 * Evalúa el campo vectorial F sobre un punto de la curva:
 * F(r(t)) = (P(x,y,z), Q(x,y,z)[, R(x,y,z)]).
 * @param {{ p: string, q: string, r?: string }} field
 * @param {{ x: number, y: number, z?: number }} point
 * @param {boolean} [is3D=false]
 * @returns {{ Fx: number, Fy: number, Fz?: number } | null}
 */
export function evaluateFieldAt(field, point, is3D = false) {
  const scope = is3D ? { x: point.x, y: point.y, z: point.z } : { x: point.x, y: point.y };
  const Fx = evaluateScope(field.p, scope);
  const Fy = evaluateScope(field.q, scope);
  if (Number.isNaN(Fx) || Number.isNaN(Fy)) return null;

  if (!is3D) return { Fx, Fy };

  const Fz = evaluateScope(field.r, scope);
  if (Number.isNaN(Fz)) return null;
  return { Fx, Fy, Fz };
}

/**
 * Producto punto F(r(t)) · r'(t), integrando escalar de la integral de
 * línea de un campo vectorial.
 * @param {{ Fx: number, Fy: number, Fz?: number }} F
 * @param {{ dx: number, dy: number, dz?: number }} rPrime
 * @param {boolean} [is3D=false]
 * @returns {number}
 */
export function dotProduct(F, rPrime, is3D = false) {
  const base = F.Fx * rPrime.dx + F.Fy * rPrime.dy;
  return is3D ? base + F.Fz * rPrime.dz : base;
}

/**
 * Discretiza la curva en `samples` puntos equiespaciados en t, para
 * poder dibujarla (análogo a computeGrid en vectorFieldService.js).
 * Los puntos donde la curva no es evaluable se omiten.
 * @param {{ x: string, y: string, z?: string, t0: number, t1: number }} curve
 * @param {number} samples
 * @param {boolean} [is3D=false]
 * @returns {{ x: number, y: number, z?: number, t: number }[]}
 */
export function discretizeCurve(curve, samples, is3D = false) {
  const { t0, t1 } = curve;
  const n = Math.max(2, Math.round(samples));
  const step = (t1 - t0) / (n - 1);
  const points = [];

  for (let i = 0; i < n; i++) {
    const t = t0 + i * step;
    const point = evaluateCurveAt(curve, t, is3D);
    if (point) points.push({ ...point, t });
  }
  return points;
}

/**
 * Integración numérica por la regla de Simpson compuesta de `fn` en
 * [a, b] con `n` subintervalos (se ajusta a par si es impar, requisito
 * de Simpson). Devuelve NaN si `fn` no es evaluable en algún nodo.
 * @param {(t:number) => number} fn
 * @param {number} a
 * @param {number} b
 * @param {number} n
 * @returns {number}
 */
export function simpsonIntegrate(fn, a, b, n) {
  const evenN = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / evenN;

  const fa = fn(a);
  const fb = fn(b);
  if (Number.isNaN(fa) || Number.isNaN(fb)) return NaN;

  let sum = fa + fb;
  for (let i = 1; i < evenN; i++) {
    const t = a + i * h;
    const value = fn(t);
    if (Number.isNaN(value)) return NaN;
    sum += (i % 2 === 0 ? 2 : 4) * value;
  }
  return (h / 3) * sum;
}

/**
 * Calcula la integral de línea ∫_C F · dr de un campo vectorial a lo
 * largo de la curva, entre t0 y t1, usando la regla de Simpson sobre el
 * integrando escalar g(t) = F(r(t)) · r'(t).
 * @param {{ p: string, q: string, r?: string }} field
 * @param {{ x: string, y: string, z?: string, t0: number, t1: number }} curve
 * @param {number} samples
 * @param {boolean} [is3D=false]
 * @returns {number} el valor de la integral, o NaN si el integrando no
 *   es evaluable en algún nodo de muestreo.
 */
export function computeLineIntegral(field, curve, samples, is3D = false) {
  const integrand = (t) => {
    const point = evaluateCurveAt(curve, t, is3D);
    if (!point) return NaN;
    const rPrime = curveDerivativeAt(curve, t, is3D);
    if (!rPrime) return NaN;
    const F = evaluateFieldAt(field, point, is3D);
    if (!F) return NaN;
    return dotProduct(F, rPrime, is3D);
  };

  return simpsonIntegrate(integrand, curve.t0, curve.t1, Math.max(10, Math.round(samples)));
}

/**
 * Valida las entradas del módulo antes de calcular nada: sintaxis de
 * cada expresión (con el scope de variables que le corresponde) y el
 * intervalo [t0, t1]. Misma forma de retorno que validateDomain /
 * validateExpression, para que la UI pueda mostrar `error={...}` por
 * campo igual que hace FieldForm.
 * @param {{ field: {p:string,q:string,r?:string}, curve: {x:string,y:string,z?:string,t0:number,t1:number}, is3D?: boolean }} params
 * @returns {{ valid: boolean, errors: Object.<string, string> }}
 */
export function validateLineIntegralInputs({ field, curve, is3D = false }) {
  const errors = {};
  const fieldScope = is3D ? { x: 1, y: 1, z: 1 } : { x: 1, y: 1 };

  const pCheck = validateExpression(field.p, fieldScope);
  if (!pCheck.valid) errors.p = pCheck.error;

  const qCheck = validateExpression(field.q, fieldScope);
  if (!qCheck.valid) errors.q = qCheck.error;

  if (is3D) {
    const rCheck = validateExpression(field.r, fieldScope);
    if (!rCheck.valid) errors.r = rCheck.error;
  }

  const xCheck = validateExpression(curve.x, { t: 1 });
  if (!xCheck.valid) errors.x = xCheck.error;

  const yCheck = validateExpression(curve.y, { t: 1 });
  if (!yCheck.valid) errors.y = yCheck.error;

  if (is3D) {
    const zCheck = validateExpression(curve.z, { t: 1 });
    if (!zCheck.valid) errors.z = zCheck.error;
  }

  const intervalCheck = validateInterval(curve.t0, curve.t1);
  if (!intervalCheck.valid) errors.interval = intervalCheck.error;

  return { valid: Object.keys(errors).length === 0, errors };
}
