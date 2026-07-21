import { evaluateAt } from '../utils/mathParser.js';
import { simulateRequest } from './api/httpClient.js';
import { FIELD_PRESETS } from '../mock/fieldPresets.mock.js';

/**
 * @typedef {Object} FieldVector
 * @property {number} x
 * @property {number} y
 * @property {number} vx
 * @property {number} vy
 * @property {number} magnitude
 */

/**
 * Calcula la grilla de vectores para P(x,y), Q(x,y) sobre un dominio.
 * Es una función pura y síncrona: el "servicio" solo la envuelve en
 * una Promise para respetar el contrato de capa de datos asíncrona.
 * @param {string} p
 * @param {string} q
 * @param {import('../models/VectorFieldConfig.js').Domain} domain
 * @param {number} density
 * @returns {FieldVector[]}
 */
function computeGrid(p, q, domain, density) {
  const { xmin, xmax, ymin, ymax } = domain;
  const stepX = (xmax - xmin) / (density - 1);
  const stepY = (ymax - ymin) / (density - 1);
  const vectors = [];

  for (let i = 0; i < density; i++) {
    for (let j = 0; j < density; j++) {
      const x = xmin + i * stepX;
      const y = ymin + j * stepY;
      const vx = evaluateAt(p, x, y);
      const vy = evaluateAt(q, x, y);
      if (Number.isNaN(vx) || Number.isNaN(vy)) continue;
      vectors.push({ x, y, vx, vy, magnitude: Math.hypot(vx, vy) });
    }
  }
  return vectors;
}

/**
 * "GET /api/vector-field" simulado: recibe la configuración y devuelve
 * la grilla ya calculada, como si un backend hiciera el cómputo pesado.
 * @param {{ p: string, q: string, domain: import('../models/VectorFieldConfig.js').Domain, density: number }} params
 * @returns {Promise<FieldVector[]>}
 */
export function fetchVectorField({ p, q, domain, density }) {
  const grid = computeGrid(p, q, domain, density);
  return simulateRequest(grid, { latency: 120 });
}

/** "GET /api/presets" simulado. */
export function fetchFieldPresets() {
  return simulateRequest(FIELD_PRESETS, { latency: 150 });
}

/** Evalúa el campo en un único punto (usado por el tooltip on-hover). Síncrono: es puramente local al canvas. */
export function evaluateFieldAtPoint(p, q, x, y) {
  const vx = evaluateAt(p, x, y);
  const vy = evaluateAt(q, x, y);
  return { vx, vy, magnitude: Math.hypot(vx, vy) };
}
