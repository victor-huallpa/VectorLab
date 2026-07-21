import { FIELD_TYPES } from './fieldTypes.constants.js';
import { evaluateAt } from '../../utils/mathParser.js';

const EPS = 0.08;

/**
 * FieldClassifier: motor de clasificación puro (sin React, sin textos
 * educativos). Recibe la expresión del campo y el resultado ya calculado
 * por FieldAnalyzer (para no recalcular el jacobiano dos veces) y
 * devuelve SIEMPRE uno de los valores de FIELD_TYPES.
 *
 * Regla de oro: si ninguna condición matemática coincide con claridad,
 * se devuelve FIELD_TYPES.CUSTOM. Nunca se inventa una categoría nueva.
 *
 * @param {{ p:string, q:string, domain:object, analysis: import('./FieldAnalyzer.js').FieldAnalysisResult }} params
 * @returns {{ type: string, confidence: 'alta'|'media'|'baja', reason: string }}
 */
export function classifyField({ p, q, analysis }) {
  const { jacobianAtOrigin: j, magnitude } = analysis;

  if (!j || !magnitude) {
    return { type: FIELD_TYPES.CUSTOM, confidence: 'baja', reason: 'No hay suficientes datos numéricos para clasificar.' };
  }

  // 1) Campo uniforme: el jacobiano es ~0 en todo el dominio (P y Q no
  //    dependen realmente de x,y) y la magnitud casi no varía.
  if (isUniform(j, magnitude)) {
    return { type: FIELD_TYPES.UNIFORM, confidence: 'alta', reason: 'El jacobiano es aproximadamente nulo y la magnitud es casi constante.' };
  }

  const trace = j.dPdx + j.dQdy;
  const det = j.dPdx * j.dQdy - j.dPdy * j.dQdx;
  const discriminant = trace * trace - 4 * det;

  // 2) Punto silla: determinante negativo -> autovalores reales de signo opuesto.
  if (det < -EPS) {
    return { type: FIELD_TYPES.SADDLE, confidence: 'alta', reason: 'El determinante del jacobiano en el origen es negativo (autovalores de signo opuesto).' };
  }

  // 3) Nodo fuente / sumidero: determinante positivo, autovalores reales del mismo signo.
  if (det > EPS && discriminant >= 0) {
    if (trace > EPS) {
      return { type: FIELD_TYPES.RADIAL_SOURCE, confidence: 'alta', reason: 'Autovalores reales positivos: el flujo se expande radialmente.' };
    }
    if (trace < -EPS) {
      return { type: FIELD_TYPES.SINK, confidence: 'alta', reason: 'Autovalores reales negativos: el flujo converge radialmente.' };
    }
  }

  // 4) Rotación pura: determinante positivo, autovalores complejos con parte real ~0.
  if (det > EPS && discriminant < 0 && Math.abs(trace) <= EPS) {
    return { type: FIELD_TYPES.PURE_ROTATION, confidence: 'alta', reason: 'Autovalores imaginarios puros: el flujo orbita el origen sin expandirse ni contraerse.' };
  }

  // 5) Campo ondulatorio: la expresión usa funciones periódicas y la
  //    divergencia/rotacional cambian de signo varias veces en el dominio
  //    (indicio de oscilación espacial, no de un único comportamiento local).
  if (looksPeriodic(p, q) && hasOscillatingBehavior(analysis)) {
    return { type: FIELD_TYPES.WAVE, confidence: 'media', reason: 'La expresión usa funciones periódicas y el signo de divergencia/rotacional oscila en el dominio.' };
  }

  return { type: FIELD_TYPES.CUSTOM, confidence: 'baja', reason: 'El comportamiento local no coincide con ninguna categoría reconocida.' };
}

function isUniform(jacobian, magnitude) {
  const jacobianIsFlat = Object.values(jacobian).every((v) => Math.abs(v) <= EPS);
  const magnitudeRange = magnitude.max - magnitude.min;
  const magnitudeIsFlat = magnitude.avg > 0 ? magnitudeRange / magnitude.avg < 0.1 : magnitudeRange < EPS;
  return jacobianIsFlat && magnitudeIsFlat;
}

function looksPeriodic(p, q) {
  const periodicFns = /\b(sin|cos|tan)\s*\(/i;
  return periodicFns.test(p) || periodicFns.test(q);
}

/**
 * Heurística barata: si la divergencia o el rotacional cambian de signo
 * en varios puntos separados del dominio, el comportamiento no es un
 * único patrón local (fuente/sumidero/rotación), sino uno que se repite
 * espacialmente — consistente con un campo ondulatorio.
 */
function hasOscillatingBehavior(analysis) {
  const { divergenceAvg, curlAvg } = analysis;
  if (divergenceAvg === null || curlAvg === null) return false;
  // Si ninguno de los dos promedios es claramente dominante, es señal de
  // que el signo local varía mucho de punto a punto (se cancela en promedio).
  return Math.abs(divergenceAvg) < 0.3 && Math.abs(curlAvg) < 0.3;
}

/** Utilidad exportada para que la UI muestre P/Q evaluados en un punto puntual si lo necesita. */
export function evaluateFieldComponents(p, q, x, y) {
  return { px: evaluateAt(p, x, y), qy: evaluateAt(q, x, y) };
}
