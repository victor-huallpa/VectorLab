import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración estándar de Vite + React.
// Se mantiene deliberadamente simple: la complejidad del proyecto
// vive en la arquitectura de /src, no en el build tool.
//
// `base`: GitHub Pages sirve este proyecto como "project site" bajo
// https://victor-huallpa.github.io/VectorLab/, es decir, NO en la raíz
// del dominio. Sin este `base`, los assets generados (JS/CSS) y las
// rutas del router se calculan como si vivieran en "/", lo que rompe
// tanto los assets como la navegación interna en producción.
// En desarrollo (`vite`/`vite preview`) se mantiene "/" para no alterar
// el flujo local habitual.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/VectorLab/' : '/',
  server: {
    port: 5173,
    open: true,
  },
}));
