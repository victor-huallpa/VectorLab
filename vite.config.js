import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración estándar de Vite + React.
// Se mantiene deliberadamente simple: la complejidad del proyecto
// vive en la arquitectura de /src, no en el build tool.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
