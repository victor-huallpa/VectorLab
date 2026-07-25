import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useCanvasSize } from '../../hooks/useCanvasSize.js';
import { createTransform } from '../../utils/coordinateTransform.js';
import { drawAxesAndGrid, drawVectors } from '../../utils/fieldRenderer.js';
import { getDiscretizedCurve, getFieldGrid } from '../../services/lineIntegralService.js';
import { CHART_COLORS } from '../../constants/theme.js';

const CURVE_SAMPLES = 160;
const FIELD_DENSITY = 12;
const DOMAIN_PADDING_RATIO = 0.25;
const MIN_DOMAIN_SPAN = 2;

/**
 * Proyección isométrica simple para curvas 3D: aplana (x, y, z) a un
 * plano 2D antes de reutilizar el mismo pipeline de dibujo 2D
 * (createTransform + drawAxesAndGrid). No es una proyección de cámara
 * completa, solo lo suficiente para que la forma de la trayectoria
 * (p. ej. una hélice) sea reconocible sin introducir un motor 3D nuevo.
 */
function isoProject({ x, y, z }) {
  const cos30 = Math.cos(Math.PI / 6);
  const sin30 = Math.sin(Math.PI / 6);
  return { x: (x - z) * cos30, y: y + (x + z) * sin30 };
}

/** Calcula un dominio cuadrado con margen a partir de un conjunto de puntos 2D. */
function computeDomainFromPoints(points) {
  if (points.length === 0) {
    return { xmin: -5, xmax: 5, ymin: -5, ymax: 5 };
  }
  let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
  for (const p of points) {
    if (p.x < xmin) xmin = p.x;
    if (p.x > xmax) xmax = p.x;
    if (p.y < ymin) ymin = p.y;
    if (p.y > ymax) ymax = p.y;
  }
  const spanX = Math.max(xmax - xmin, MIN_DOMAIN_SPAN);
  const spanY = Math.max(ymax - ymin, MIN_DOMAIN_SPAN);
  const span = Math.max(spanX, spanY);
  const cx = (xmin + xmax) / 2;
  const cy = (ymin + ymax) / 2;
  const half = (span / 2) * (1 + DOMAIN_PADDING_RATIO);
  return { xmin: cx - half, xmax: cx + half, ymin: cy - half, ymax: cy + half };
}

/** Dibuja la trayectoria como una polilínea continua sobre el transform dado. */
function drawTrajectory(ctx, transform, points, color) {
  if (points.length < 2) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  points.forEach((p, i) => {
    const { sx, sy } = transform.worldToScreen(p.x, p.y);
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  });
  ctx.stroke();
}

/** Marca el punto inicial (círculo) y final (cuadrado) de la curva. */
function drawEndpoints(ctx, transform, points, color) {
  if (points.length === 0) return;
  const start = transform.worldToScreen(points[0].x, points[0].y);
  const end = transform.worldToScreen(points[points.length - 1].x, points[points.length - 1].y);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(start.sx, start.sy, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillRect(end.sx - 3.5, end.sy - 3.5, 7, 7);
}

/** Flechas de orientación a lo largo de la curva, indicando el sentido de recorrido. */
function drawOrientationArrows(ctx, transform, points, color) {
  if (points.length < 6) return;
  const step = Math.max(1, Math.floor(points.length / 8));
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.4;

  for (let i = step; i < points.length - 1; i += step) {
    const a = transform.worldToScreen(points[i - 1].x, points[i - 1].y);
    const b = transform.worldToScreen(points[i].x, points[i].y);
    const angle = Math.atan2(b.sy - a.sy, b.sx - a.sx);
    const headLength = 7;
    const headAngle = Math.PI / 7;
    ctx.beginPath();
    ctx.moveTo(b.sx, b.sy);
    ctx.lineTo(b.sx - headLength * Math.cos(angle - headAngle), b.sy - headLength * Math.sin(angle - headAngle));
    ctx.lineTo(b.sx - headLength * Math.cos(angle + headAngle), b.sy - headLength * Math.sin(angle + headAngle));
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * Área de visualización del laboratorio de Integrales de Línea.
 *
 * Reutiliza el mismo pipeline de dibujo que FieldCanvas.jsx
 * (createTransform + drawAxesAndGrid + drawVectors, todos de
 * utils/coordinateTransform.js y utils/fieldRenderer.js) en vez de
 * reimplementar ejes, grilla o flechas: solo agrega el dibujo de la
 * trayectoria (polilínea + flechas de orientación) encima.
 *
 * - En 2D, si `config.showField` está activo, dibuja de fondo el campo
 *   vectorial F(x,y) (misma lógica que FieldCanvas, vía
 *   getFieldGrid → drawVectors) sobre el dominio calculado a partir de
 *   la curva.
 * - En 3D, se omite el campo de fondo (F(x,y,z) no se puede dibujar
 *   como flechas 2D sin una proyección más compleja) y la curva se
 *   proyecta isométricamente con `isoProject`.
 *
 * Expone `getSnapshotCanvas()` vía ref, mismo contrato que
 * FieldCanvas.jsx, para que LineIntegralPage pueda incluir esta misma
 * imagen en el reporte PDF.
 */
const LineIntegralCanvas = forwardRef(function LineIntegralCanvas({ field, curve, config }, ref) {
  const { containerRef, size } = useCanvasSize();
  const canvasRef = useRef(null);
  const is3D = config.is3D;

  useImperativeHandle(ref, () => ({
    getSnapshotCanvas() {
      return canvasRef.current;
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width <= 1) return;
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');

    const rawPoints = getDiscretizedCurve(curve, CURVE_SAMPLES, is3D);
    const points = is3D ? rawPoints.map((p) => ({ ...isoProject(p), t: p.t })) : rawPoints;
    const domain = computeDomainFromPoints(points);
    const transform = createTransform(domain, size.width, size.height);

    drawAxesAndGrid(ctx, transform, domain, size.width, size.height);

    if (!is3D && config.showField && field.p.trim() && field.q.trim()) {
      const vectors = getFieldGrid(field, domain, FIELD_DENSITY);
      const maxMagnitude = vectors.reduce((max, v) => Math.max(max, v.magnitude), 0);
      drawVectors(ctx, transform, vectors, { scale: 0.8, colorByMagnitude: false }, maxMagnitude);
    }

    drawTrajectory(ctx, transform, points, CHART_COLORS.ember);
    if (config.showOrientation) {
      drawOrientationArrows(ctx, transform, points, CHART_COLORS.ember);
    }
    drawEndpoints(ctx, transform, points, CHART_COLORS.ember);
  }, [field, curve, config, is3D, size]);

  const hasValidCurve = curve.x.trim() && curve.y.trim() && (!is3D || curve.z.trim());

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden rounded-xl bg-void">
      <canvas ref={canvasRef} className="absolute inset-0" />
      {!hasValidCurve && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-void/80 text-center">
          <AlertTriangle size={20} className="text-ink-faint" />
          <p className="max-w-xs text-xs text-ink-muted">
            Completa x(t), y(t){is3D ? ' y z(t)' : ''} para ver la curva y el campo.
          </p>
        </div>
      )}
    </div>
  );
});

export default LineIntegralCanvas;
