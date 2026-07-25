import { simulateRequest } from './api/httpClient.js';
import { computeLineIntegralWithProcedure, discretizeCurve, evaluateFieldAt } from '../domain/line-integral/index.js';
import { LINE_INTEGRAL_PRESETS } from '../mock/lineIntegralPresets.mock.js';

/**
 * Capa de datos del módulo "Integrales de Línea". Sigue el mismo
 * contrato que vectorFieldService.js: funciones puras y síncronas
 * envueltas en simulateRequest (services/api/httpClient.js), para que
 * cuando exista un backend real solo haya que tocar este archivo.
 *
 * `fetchLineIntegralResult` invoca el motor real
 * (domain/line-integral/), que valida las entradas, calcula la integral
 * y arma el procedimiento paso a paso.
 *
 * @param {{ field: {p:string,q:string,r?:string}, curve: {x:string,y:string,z?:string,t0:number,t1:number}, samples: number, is3D?: boolean }} params
 * @returns {Promise<ReturnType<typeof computeLineIntegralWithProcedure>>}
 */
export function fetchLineIntegralResult({ field, curve, samples, is3D = false }) {
  const result = computeLineIntegralWithProcedure({ field, curve, samples, is3D });
  return simulateRequest(result, { latency: 120 });
}

/**
 * Discretiza la curva para el canvas (usado por LineIntegralCanvas.jsx
 * cuando dibuje la curva real). Síncrono: es puramente local al canvas,
 * igual que evaluateFieldAtPoint en vectorFieldService.js.
 * @param {{ x:string, y:string, z?:string, t0:number, t1:number }} curve
 * @param {number} samples
 * @param {boolean} [is3D=false]
 */
export function getDiscretizedCurve(curve, samples, is3D = false) {
  return discretizeCurve(curve, samples, is3D);
}

/**
 * Calcula una grilla de vectores del campo F sobre un dominio 2D, para
 * dibujar el campo de fondo en LineIntegralCanvas.jsx. Solo tiene
 * sentido en 2D (F(x,y)): reutiliza `evaluateFieldAt` del motor real en
 * vez de reimplementar la evaluación, igual que vectorFieldService.js
 * reutiliza `evaluateAt`. Síncrono: es puramente local al canvas.
 * @param {{ p: string, q: string }} field
 * @param {{ xmin:number, xmax:number, ymin:number, ymax:number }} domain
 * @param {number} density
 */
export function getFieldGrid(field, domain, density = 14) {
  const { xmin, xmax, ymin, ymax } = domain;
  const stepX = (xmax - xmin) / (density - 1);
  const stepY = (ymax - ymin) / (density - 1);
  const vectors = [];

  for (let i = 0; i < density; i++) {
    for (let j = 0; j < density; j++) {
      const x = xmin + i * stepX;
      const y = ymin + j * stepY;
      const F = evaluateFieldAt(field, { x, y }, false);
      if (!F) continue;
      vectors.push({ x, y, vx: F.Fx, vy: F.Fy, magnitude: Math.hypot(F.Fx, F.Fy) });
    }
  }
  return vectors;
}

/**
 * "GET /api/line-integral-presets" simulado, misma convención que
 * fetchFieldPresets en vectorFieldService.js.
 */
export function fetchLineIntegralPresets() {
  return simulateRequest(LINE_INTEGRAL_PRESETS, { latency: 150 });
}
