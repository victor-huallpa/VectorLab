import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useCanvasSize } from '../../hooks/useCanvasSize.js';
import { useAnimationFrame } from '../../hooks/useAnimationFrame.js';
import { createTransform } from '../../utils/coordinateTransform.js';
import { drawAxesAndGrid, drawVectors, drawParticles } from '../../utils/fieldRenderer.js';
import { ParticleSystem } from '../../utils/particleSystem.js';
import { evaluateFieldAtPoint } from '../../services/vectorFieldService.js';
import { DEFAULT_PARTICLE_COUNT } from '../../constants/theme.js';
import FieldTooltip from './FieldTooltip.jsx';

/**
 * Dos canvases apilados:
 *  - "field": ejes + flechas, se redibuja solo cuando cambian los datos.
 *  - "particles": se redibuja cada frame vía requestAnimationFrame.
 * Separarlos evita recalcular miles de flechas 60 veces por segundo.
 */
const FieldCanvas = forwardRef(function FieldCanvas({ p, q, config, vectors }, ref) {
  const { containerRef, size } = useCanvasSize();
  const fieldCanvasRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const particleSystemRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  useImperativeHandle(ref, () => ({
    /** Compone ambas capas en un único canvas para exportar a PDF. */
    getSnapshotCanvas() {
      const output = document.createElement('canvas');
      output.width = size.width;
      output.height = size.height;
      const ctx = output.getContext('2d');
      if (fieldCanvasRef.current) ctx.drawImage(fieldCanvasRef.current, 0, 0);
      if (particleCanvasRef.current) ctx.drawImage(particleCanvasRef.current, 0, 0);
      return output;
    },
  }));

  // Redibuja la capa estática (ejes + vectores) cuando cambian los datos o el tamaño.
  useEffect(() => {
    const canvas = fieldCanvasRef.current;
    if (!canvas || size.width <= 1) return;
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');
    const transform = createTransform(config.domain, size.width, size.height);

    drawAxesAndGrid(ctx, transform, config.domain, size.width, size.height);
    const maxMagnitude = vectors.reduce((max, v) => Math.max(max, v.magnitude), 0);
    drawVectors(ctx, transform, vectors, config, maxMagnitude);
  }, [vectors, config, size]);

  // Inicializa / sincroniza el sistema de partículas con el dominio actual.
  useEffect(() => {
    if (!particleSystemRef.current) {
      particleSystemRef.current = new ParticleSystem(DEFAULT_PARTICLE_COUNT, config.domain);
    } else {
      particleSystemRef.current.setDomain(config.domain);
    }
  }, [config.domain]);

  // Loop de animación de partículas (capa superior, transparente).
  useAnimationFrame((dt) => {
    const canvas = particleCanvasRef.current;
    const system = particleSystemRef.current;
    if (!canvas || !system || size.width <= 1) return;

    if (canvas.width !== size.width || canvas.height !== size.height) {
      canvas.width = size.width;
      canvas.height = size.height;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size.width, size.height);

    if (!config.showParticles) return;

    system.step(p, q, dt, 1);
    const transform = createTransform(config.domain, size.width, size.height);
    drawParticles(ctx, transform, system.particles);
  }, true);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    const transform = createTransform(config.domain, size.width, size.height);
    const { x, y } = transform.screenToWorld(px, py);
    const { vx, vy, magnitude } = evaluateFieldAtPoint(p, q, x, y);

    setTooltip(Number.isNaN(vx) || Number.isNaN(vy) ? null : { screenX: px, screenY: py, x, y, vx, vy, magnitude });
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden rounded-xl bg-void"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTooltip(null)}
    >
      <canvas ref={fieldCanvasRef} className="absolute inset-0" />
      <canvas ref={particleCanvasRef} className="absolute inset-0" />
      {tooltip && <FieldTooltip x={tooltip.screenX} y={tooltip.screenY} data={tooltip} />}
    </div>
  );
});

export default FieldCanvas;
