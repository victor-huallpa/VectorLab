import { MAGNITUDE_GRADIENT } from '../constants/theme.js';

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

const STOPS = MAGNITUDE_GRADIENT.map(hexToRgb);

/**
 * Interpola linealmente entre los colores de MAGNITUDE_GRADIENT según
 * la magnitud normalizada (0..1). Devuelve un string rgba() listo
 * para usar como fillStyle/strokeStyle en canvas.
 * @param {number} t  Magnitud normalizada, 0 a 1
 * @param {number} [alpha]
 */
export function magnitudeToColor(t, alpha = 1) {
  const clamped = Math.min(1, Math.max(0, t));
  const segments = STOPS.length - 1;
  const pos = clamped * segments;
  const idx = Math.min(segments - 1, Math.floor(pos));
  const localT = pos - idx;

  const a = STOPS[idx];
  const b = STOPS[idx + 1];
  const r = Math.round(a.r + (b.r - a.r) * localT);
  const g = Math.round(a.g + (b.g - a.g) * localT);
  const bl = Math.round(a.b + (b.b - a.b) * localT);

  return `rgba(${r}, ${g}, ${bl}, ${alpha})`;
}
