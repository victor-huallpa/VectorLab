import {
  divergenceAt,
  curlAt,
  magnitudeAt,
  jacobianAt,
  samplePoints,
} from './vectorCalculus.js';
import { evaluateAt } from '../../utils/mathParser.js';

const NOT_AVAILABLE = 'No determinable en este dominio';

/**
 * @typedef {Object} FieldAnalysisResult
 * @property {number|null} divergenceAvg
 * @property {number|null} divergenceAtOrigin
 * @property {number|null} curlAvg
 * @property {number|null} curlAtOrigin
 * @property {{min:number, max:number, avg:number}|null} magnitude
 * @property {{angleDeg:number, label:string}|null} predominantDirection
 * @property {string} flowType          'divergente' | 'convergente' | 'rotacional' | 'mixto' | 'no determinable'
 * @property {string} originBehavior    Descripción corta y objetiva del comportamiento cerca del origen
 * @property {{dPdx:number,dPdy:number,dQdx:number,dQdy:number}|null} jacobianAtOrigin
 */

/**
 * FieldAnalyzer: única fuente de cálculo matemático sobre un campo
 * vectorial P(x,y), Q(x,y). No sabe nada de React, de UI ni de textos
 * educativos — solo produce números y etiquetas cortas y objetivas.
 * FieldClassifier y FieldInterpreter consumen su salida.
 *
 * @param {{ p: string, q: string, domain: {xmin:number,xmax:number,ymin:number,ymax:number}, resolution?: number }} params
 * @returns {FieldAnalysisResult}
 */
export function analyzeField({ p, q, domain, resolution = 12 }) {
  const points = samplePoints(domain, resolution);

  const divergences = [];
  const curls = [];
  const magnitudes = [];
  let sumPx = 0;
  let sumPy = 0;
  let validVectorCount = 0;

  for (const { x, y } of points) {
    const div = divergenceAt(p, q, x, y);
    if (!Number.isNaN(div)) divergences.push(div);

    const curl = curlAt(p, q, x, y);
    if (!Number.isNaN(curl)) curls.push(curl);

    const mag = magnitudeAt(p, q, x, y);
    if (!Number.isNaN(mag)) {
      magnitudes.push(mag);
      const px = evaluateAt(p, x, y);
      const py = evaluateAt(q, x, y);
      sumPx += px;
      sumPy += py;
      validVectorCount += 1;
    }
  }

  const divergenceAvg = average(divergences);
  const curlAvg = average(curls);
  const magnitude = magnitudes.length
    ? { min: Math.min(...magnitudes), max: Math.max(...magnitudes), avg: average(magnitudes) }
    : null;

  const divergenceOrigin = safeAtOrigin(divergenceAt, p, q);
  const curlOrigin = safeAtOrigin(curlAt, p, q);
  const jacobianOrigin = jacobianAt(p, q, 1e-3, 1e-3); // el origen exacto suele ser singular

  return {
    divergenceAvg,
    divergenceAtOrigin: divergenceOrigin,
    curlAvg,
    curlAtOrigin: curlOrigin,
    magnitude,
    predominantDirection: validVectorCount > 0 ? predominantDirection(sumPx, sumPy) : null,
    flowType: classifyFlowType(divergenceAvg, curlAvg),
    originBehavior: describeOriginBehavior(divergenceOrigin, curlOrigin, jacobianOrigin),
    jacobianAtOrigin: jacobianOrigin,
  };
}

function average(values) {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function safeAtOrigin(fn, p, q) {
  const value = fn(p, q, 1e-3, 1e-3);
  return Number.isNaN(value) ? null : value;
}

/** Traduce el vector promedio a una dirección cardinal aproximada. */
function predominantDirection(sumPx, sumPy) {
  if (sumPx === 0 && sumPy === 0) {
    return { angleDeg: null, label: 'Sin dirección predominante (se cancela en promedio)' };
  }
  const angleDeg = (Math.atan2(sumPy, sumPx) * 180) / Math.PI;
  return { angleDeg, label: cardinalLabel(angleDeg) };
}

function cardinalLabel(angleDeg) {
  const normalized = ((angleDeg % 360) + 360) % 360;
  const directions = [
    'este (→)', 'noreste (↗)', 'norte (↑)', 'noroeste (↖)',
    'oeste (←)', 'suroeste (↙)', 'sur (↓)', 'sureste (↘)',
  ];
  const index = Math.round(normalized / 45) % 8;
  return directions[index];
}

/** Tipo de flujo global, derivado solo de signos de divergencia/rotacional promedio. */
function classifyFlowType(divergenceAvg, curlAvg) {
  if (divergenceAvg === null || curlAvg === null) return 'no determinable';
  const divThreshold = 0.05;
  const curlThreshold = 0.05;
  const hasDivergence = Math.abs(divergenceAvg) > divThreshold;
  const hasCurl = Math.abs(curlAvg) > curlThreshold;

  if (hasDivergence && !hasCurl) return divergenceAvg > 0 ? 'divergente' : 'convergente';
  if (hasCurl && !hasDivergence) return 'rotacional';
  if (hasDivergence && hasCurl) return 'mixto';
  return 'aproximadamente uniforme';
}

/** Descripción objetiva (no educativa) del comportamiento cerca del origen. */
function describeOriginBehavior(divergenceOrigin, curlOrigin, jacobian) {
  if (divergenceOrigin === null || curlOrigin === null || !jacobian) return NOT_AVAILABLE;

  const threshold = 0.05;
  const div = divergenceOrigin;
  const curl = curlOrigin;

  if (Math.abs(div) <= threshold && Math.abs(curl) <= threshold) {
    return 'El campo es aproximadamente nulo o estable en las cercanías del origen.';
  }
  if (div > threshold && Math.abs(curl) <= threshold) {
    return 'Los vectores se alejan del origen (comportamiento de fuente).';
  }
  if (div < -threshold && Math.abs(curl) <= threshold) {
    return 'Los vectores convergen hacia el origen (comportamiento de sumidero).';
  }
  if (Math.abs(div) <= threshold && Math.abs(curl) > threshold) {
    return `Los vectores giran alrededor del origen en sentido ${curl > 0 ? 'antihorario' : 'horario'}.`;
  }
  return 'El origen combina rotación con expansión o contracción (comportamiento mixto).';
}
