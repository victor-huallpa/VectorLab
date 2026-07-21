/**
 * Espejo en JS puro de los tokens de color de tailwind.config.js.
 * El <canvas> del campo vectorial no puede leer clases de Tailwind,
 * así que estos valores se mantienen sincronizados manualmente.
 * Si cambias un color aquí, cambia también el equivalente en tailwind.config.js.
 */
export const CHART_COLORS = {
  background: '#0B0E14',
  gridLine: 'rgba(138, 147, 166, 0.10)',
  axis: 'rgba(231, 234, 240, 0.35)',
  accent: '#4EE1D0',
  ember: '#F2A65A',
  danger: '#F2607A',
  ink: '#E7EAF0',
  inkMuted: '#8A93A6',
};

/** Escala de color por magnitud: teal (baja) → ámbar (media) → coral (alta). */
export const MAGNITUDE_GRADIENT = ['#2A6E68', '#4EE1D0', '#F2A65A', '#F2607A'];

export const DEFAULT_PARTICLE_COUNT = 140;
