/**
 * Catálogo simulado de campos vectoriales clásicos.
 * En una futura versión con API real, este archivo se reemplaza por
 * una respuesta de GET /api/presets — el resto de la app no cambia.
 */
export const FIELD_PRESETS = [
  {
    id: 'rotacional',
    name: 'Rotación pura',
    p: '-y',
    q: 'x',
    domain: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 },
    description: 'Un campo circular: cada vector es perpendicular a su radio.',
  },
  {
    id: 'radial',
    name: 'Fuente radial',
    p: 'x',
    q: 'y',
    domain: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 },
    description: 'Todo apunta hacia afuera del origen, como una fuente.',
  },
  {
    id: 'sumidero',
    name: 'Sumidero',
    p: '-x',
    q: '-y',
    domain: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 },
    description: 'Todo converge hacia el origen.',
  },
  {
    id: 'silla',
    name: 'Punto silla',
    p: 'x',
    q: '-y',
    domain: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 },
    description: 'Comportamiento hiperbólico: atrae en un eje, repele en otro.',
  },
  {
    id: 'ondulatorio',
    name: 'Campo ondulatorio',
    p: 'sin(y)',
    q: 'cos(x)',
    domain: { xmin: -6, xmax: 6, ymin: -6, ymax: 6 },
    description: 'Un patrón periódico inspirado en ondas armónicas.',
  },
];

export const DEFAULT_PRESET_ID = 'rotacional';
