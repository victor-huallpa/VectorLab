import { useEffect, useRef, useState } from 'react';

/**
 * Observa el tamaño de un contenedor y expone {width, height} en
 * píxeles, para que el canvas del campo vectorial siempre llene su
 * panel sin distorsión, incluso al redimensionar la ventana.
 */
export function useCanvasSize() {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 600, height: 480 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize({ width: Math.max(1, Math.floor(width)), height: Math.max(1, Math.floor(height)) });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { containerRef, size };
}
