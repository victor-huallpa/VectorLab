import { symbolicDerivative } from '../../utils/mathParser.js';
import {
  evaluateCurveAt,
  curveDerivativeAt,
  evaluateFieldAt,
  dotProduct,
  computeLineIntegral,
  validateLineIntegralInputs,
} from './lineIntegralCalculus.js';

/**
 * LineIntegralInterpreter: única capa que produce el procedimiento
 * paso a paso orientado al estudiante a partir de lineIntegralCalculus.js.
 * No decide validez (eso es validateLineIntegralInputs) ni hace la
 * integración numérica final por su cuenta (reutiliza computeLineIntegral);
 * solo arma la narrativa y las tablas intermedias, igual que
 * FieldInterpreter.js hace para el análisis de campos.
 */

const SAMPLE_POINTS_IN_PROCEDURE = 5;

/**
 * Sustitución textual de las variables de una expresión por las
 * parametrizaciones de la curva, solo para mostrar en el procedimiento
 * (ej. "x^2 + y" con x(t)=cos(t), y(t)=t → "(cos(t))^2 + (t)"). No se usa
 * para calcular: el cómputo real siempre pasa por mathjs (evaluateScope).
 */
function substituteVariables(expression, substitutions) {
  let result = expression;
  for (const [variable, replacement] of Object.entries(substitutions)) {
    result = result.replace(new RegExp(`\\b${variable}\\b`, 'g'), `(${replacement})`);
  }
  return result;
}

function formatNumber(value, decimals = 4) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return Number(value.toFixed(decimals)).toString();
}

function formatVector(components, is3D) {
  const parts = is3D ? [components[0], components[1], components[2]] : [components[0], components[1]];
  return `(${parts.map((v) => formatNumber(v)).join(', ')})`;
}

/**
 * Calcula el resultado completo de la integral de línea, junto con el
 * procedimiento paso a paso listo para mostrar en la UI.
 * @param {{ field: {p:string,q:string,r?:string}, curve: {x:string,y:string,z?:string,t0:number,t1:number}, samples: number, is3D?: boolean }} params
 * @returns {{
 *   status: 'success'|'error',
 *   value: number|null,
 *   steps: Array<{ id:string, title:string, lines:string[] }>,
 *   samplesTable: Array<Object>|null,
 *   errors: Object.<string,string>|null,
 * }}
 */
export function computeLineIntegralWithProcedure({ field, curve, samples, is3D = false }) {
  const { valid, errors } = validateLineIntegralInputs({ field, curve, is3D });
  if (!valid) {
    return { status: 'error', value: null, steps: [], samplesTable: null, errors };
  }

  const value = computeLineIntegral(field, curve, samples, is3D);

  if (Number.isNaN(value)) {
    return {
      status: 'error',
      value: null,
      steps: [],
      samplesTable: null,
      errors: {
        computation:
          'La curva o el campo no son evaluables en todo el intervalo [t0, t1] (por ejemplo, una división por cero). Revisa las expresiones o el intervalo.',
      },
    };
  }

  const steps = buildSteps({ field, curve, is3D, samples, value });
  const samplesTable = buildSamplesTable({ field, curve, is3D });

  return { status: 'success', value, steps, samplesTable, errors: null };
}

/** @returns {Array<{ id:string, title:string, lines:string[] }>} */
function buildSteps({ field, curve, is3D, samples, value }) {
  const dxdt = symbolicDerivative(curve.x, 't');
  const dydt = symbolicDerivative(curve.y, 't');
  const dzdt = is3D ? symbolicDerivative(curve.z, 't') : null;

  const subs = is3D
    ? { x: curve.x, y: curve.y, z: curve.z }
    : { x: curve.x, y: curve.y };

  const steps = [];

  steps.push({
    id: 'curva',
    title: '1. Parametrización de la curva C',
    lines: is3D
      ? [`r(t) = (x(t), y(t), z(t)) = (${curve.x}, ${curve.y}, ${curve.z})`, `t ∈ [${curve.t0}, ${curve.t1}]`]
      : [`r(t) = (x(t), y(t)) = (${curve.x}, ${curve.y})`, `t ∈ [${curve.t0}, ${curve.t1}]`],
  });

  steps.push({
    id: 'derivada',
    title: "2. Derivada r'(t)",
    lines: is3D
      ? [
          `x'(t) = ${dxdt ?? '(derivada numérica por diferencias finitas)'}`,
          `y'(t) = ${dydt ?? '(derivada numérica por diferencias finitas)'}`,
          `z'(t) = ${dzdt ?? '(derivada numérica por diferencias finitas)'}`,
        ]
      : [
          `x'(t) = ${dxdt ?? '(derivada numérica por diferencias finitas)'}`,
          `y'(t) = ${dydt ?? '(derivada numérica por diferencias finitas)'}`,
        ],
  });

  steps.push({
    id: 'campo',
    title: '3. Campo vectorial F',
    lines: is3D
      ? [`F(x, y, z) = (${field.p}, ${field.q}, ${field.r})`]
      : [`F(x, y) = (${field.p}, ${field.q})`],
  });

  steps.push({
    id: 'sustitucion',
    title: '4. Sustitución F(r(t))',
    lines: is3D
      ? [
          `P(x(t), y(t), z(t)) = ${substituteVariables(field.p, subs)}`,
          `Q(x(t), y(t), z(t)) = ${substituteVariables(field.q, subs)}`,
          `R(x(t), y(t), z(t)) = ${substituteVariables(field.r, subs)}`,
        ]
      : [
          `P(x(t), y(t)) = ${substituteVariables(field.p, subs)}`,
          `Q(x(t), y(t)) = ${substituteVariables(field.q, subs)}`,
        ],
  });

  steps.push({
    id: 'producto-punto',
    title: '5. Producto punto F(r(t)) · r\'(t)',
    lines: is3D
      ? ['F(r(t)) · r\'(t) = P(r(t))·x\'(t) + Q(r(t))·y\'(t) + R(r(t))·z\'(t)']
      : ['F(r(t)) · r\'(t) = P(r(t))·x\'(t) + Q(r(t))·y\'(t)'],
  });

  steps.push({
    id: 'integral',
    title: '6. Integral de línea (regla de Simpson compuesta)',
    lines: [
      `∫_C F · dr = ∫[${curve.t0} → ${curve.t1}] F(r(t)) · r'(t) dt`,
      `Subdivisiones usadas: ${Math.max(10, Math.round(samples))}`,
    ],
  });

  steps.push({
    id: 'resultado',
    title: '7. Resultado final',
    lines: [`∫_C F · dr ≈ ${formatNumber(value, 6)}`],
  });

  return steps;
}

/**
 * Tabla de evaluación en unos pocos puntos de muestra del intervalo
 * (t0, punto intermedio, t1 y equiespaciados entre medio), para ilustrar
 * el procedimiento sin tener que imprimir los cientos de nodos que usa
 * realmente la integración numérica.
 */
function buildSamplesTable({ field, curve, is3D }) {
  const { t0, t1 } = curve;
  const n = SAMPLE_POINTS_IN_PROCEDURE;
  const step = (t1 - t0) / (n - 1);
  const rows = [];

  for (let i = 0; i < n; i++) {
    const t = t0 + i * step;
    const point = evaluateCurveAt(curve, t, is3D);
    const rPrime = curveDerivativeAt(curve, t, is3D);
    const F = point ? evaluateFieldAt(field, point, is3D) : null;
    const dot = point && rPrime && F ? dotProduct(F, rPrime, is3D) : NaN;

    rows.push({
      t: formatNumber(t, 4),
      rt: point ? formatVector(is3D ? [point.x, point.y, point.z] : [point.x, point.y], is3D) : '—',
      rPrime: rPrime
        ? formatVector(is3D ? [rPrime.dx, rPrime.dy, rPrime.dz] : [rPrime.dx, rPrime.dy], is3D)
        : '—',
      F: F ? formatVector(is3D ? [F.Fx, F.Fy, F.Fz] : [F.Fx, F.Fy], is3D) : '—',
      dot: formatNumber(dot, 4),
    });
  }

  return rows;
}
