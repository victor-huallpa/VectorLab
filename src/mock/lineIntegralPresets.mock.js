/**
 * Catálogo simulado de ejemplos clásicos de integrales de línea
 * (curva + campo ya combinados, porque el resultado educativo depende
 * de ambos a la vez). Mismo rol que FIELD_PRESETS en
 * mock/fieldPresets.mock.js: en una futura versión con API real este
 * archivo se reemplaza por la respuesta de GET /api/presets sin tocar
 * el resto de la app.
 */
export const LINE_INTEGRAL_PRESETS = [
  {
    id: 'circulo-rotacional',
    name: 'Círculo unitario en campo rotacional',
    description: 'F = (-y, x) a lo largo de la circunferencia unitaria, t ∈ [0, 2π].',
    is3D: false,
    field: { p: '-y', q: 'x', r: '' },
    curve: { x: 'cos(t)', y: 'sin(t)', z: '', t0: 0, t1: 2 * Math.PI },
  },
  {
    id: 'segmento-conservativo',
    name: 'Segmento de recta en campo conservativo',
    description: 'F = (2x, 2y) (gradiente de x²+y²) sobre el segmento de (0,0) a (1,1).',
    is3D: false,
    field: { p: '2*x', q: '2*y', r: '' },
    curve: { x: 't', y: 't', z: '', t0: 0, t1: 1 },
  },
  {
    id: 'parabola-campo-uniforme',
    name: 'Trayectoria parabólica en campo uniforme',
    description: 'F = (1, 0) a lo largo de la parábola y = x², t ∈ [-1, 1].',
    is3D: false,
    field: { p: '1', q: '0', r: '' },
    curve: { x: 't', y: 't^2', z: '', t0: -1, t1: 1 },
  },
  {
    id: 'helice-3d',
    name: 'Hélice en campo 3D',
    description: 'F = (y, -x, z) a lo largo de una hélice, t ∈ [0, 2π].',
    is3D: true,
    field: { p: 'y', q: '-x', r: 'z' },
    curve: { x: 'cos(t)', y: 'sin(t)', z: 't', t0: 0, t1: 2 * Math.PI },
  },
];

export const DEFAULT_LINE_INTEGRAL_PRESET_ID = 'circulo-rotacional';
