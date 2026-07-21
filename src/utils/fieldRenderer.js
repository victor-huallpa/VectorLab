import { CHART_COLORS } from '../constants/theme.js';
import { magnitudeToColor } from './colorScale.js';

/** Dibuja la grilla fina y los ejes cartesianos con sus marcas numéricas. */
export function drawAxesAndGrid(ctx, transform, domain, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = CHART_COLORS.background;
  ctx.fillRect(0, 0, width, height);

  const { xmin, xmax, ymin, ymax } = domain;
  const step = niceStep(xmax - xmin);

  ctx.strokeStyle = CHART_COLORS.gridLine;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = Math.ceil(xmin / step) * step; x <= xmax; x += step) {
    const { sx } = transform.worldToScreen(x, 0);
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, height);
  }
  for (let y = Math.ceil(ymin / step) * step; y <= ymax; y += step) {
    const { sy } = transform.worldToScreen(0, y);
    ctx.moveTo(0, sy);
    ctx.lineTo(width, sy);
  }
  ctx.stroke();

  // Ejes principales
  ctx.strokeStyle = CHART_COLORS.axis;
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  const origin = transform.worldToScreen(0, 0);
  ctx.moveTo(0, origin.sy);
  ctx.lineTo(width, origin.sy);
  ctx.moveTo(origin.sx, 0);
  ctx.lineTo(origin.sx, height);
  ctx.stroke();

  // Marcas numéricas
  ctx.fillStyle = CHART_COLORS.inkMuted;
  ctx.font = '10px "JetBrains Mono", monospace';
  for (let x = Math.ceil(xmin / step) * step; x <= xmax; x += step) {
    if (Math.abs(x) < step / 2) continue;
    const { sx } = transform.worldToScreen(x, 0);
    ctx.fillText(formatTick(x), sx + 3, origin.sy - 4);
  }
  for (let y = Math.ceil(ymin / step) * step; y <= ymax; y += step) {
    if (Math.abs(y) < step / 2) continue;
    const { sy } = transform.worldToScreen(0, y);
    ctx.fillText(formatTick(y), origin.sx + 4, sy - 3);
  }
}

/** Dibuja las flechas del campo vectorial, opcionalmente coloreadas por magnitud. */
export function drawVectors(ctx, transform, vectors, config, maxMagnitude) {
  const { scale, colorByMagnitude } = config;

  for (const vec of vectors) {
    const { sx, sy } = transform.worldToScreen(vec.x, vec.y);
    const normalized = maxMagnitude > 0 ? vec.magnitude / maxMagnitude : 0;

    // Longitud visual proporcional a la magnitud normalizada, acotada
    // para que la grilla no se sature de flechas gigantes.
    const baseLength = Math.min(transform.scaleX, transform.scaleY) * 0.85;
    const length = baseLength * (0.25 + 0.75 * normalized) * scale;

    const angle = Math.atan2(-vec.vy, vec.vx); // -vy porque la pantalla invierte el eje y
    const ex = sx + Math.cos(angle) * length;
    const ey = sy + Math.sin(angle) * length;

    const color = colorByMagnitude ? magnitudeToColor(normalized) : CHART_COLORS.accent;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.4;

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // Cabeza de flecha
    const headLength = Math.min(6, length * 0.4);
    const headAngle = Math.PI / 7;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - headLength * Math.cos(angle - headAngle), ey - headLength * Math.sin(angle - headAngle));
    ctx.lineTo(ex - headLength * Math.cos(angle + headAngle), ey - headLength * Math.sin(angle + headAngle));
    ctx.closePath();
    ctx.fill();
  }
}

/** Dibuja las partículas del flujo como puntos con una ligera estela. */
export function drawParticles(ctx, transform, particles) {
  ctx.fillStyle = CHART_COLORS.ember;
  for (const particle of particles) {
    const { sx, sy } = transform.worldToScreen(particle.x, particle.y);
    const fade = Math.max(0, 1 - particle.age / particle.life);
    ctx.globalAlpha = 0.15 + fade * 0.6;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function niceStep(span) {
  const raw = span / 8;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const residual = raw / magnitude;
  let niceResidual = 1;
  if (residual > 5) niceResidual = 10;
  else if (residual > 2) niceResidual = 5;
  else if (residual > 1) niceResidual = 2;
  return niceResidual * magnitude;
}

function formatTick(value) {
  return Math.abs(value) < 1 ? value.toFixed(1) : Math.round(value * 100) / 100;
}
