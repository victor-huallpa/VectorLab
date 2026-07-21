import { useEffect, useRef } from 'react';

/**
 * Ejecuta `callback(deltaSeconds)` en cada frame mientras `active` sea true.
 * Se usa para la simulación de partículas del campo vectorial.
 */
export function useAnimationFrame(callback, active = true) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!active) return undefined;

    let frameId;
    let lastTime = performance.now();

    const loop = (time) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05); // clamp para evitar saltos tras cambiar de pestaña
      lastTime = time;
      callbackRef.current(delta);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [active]);
}
