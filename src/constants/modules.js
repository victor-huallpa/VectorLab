import { ROUTES } from './routes.js';

/**
 * Catálogo de módulos del laboratorio. Cada módulo declara si ya está
 * disponible; el Sidebar usa este flag para deshabilitar los que
 * llegarán en futuras versiones, sin tocar el componente de navegación.
 */
export const MODULES = [
  {
    id: 'inicio',
    label: 'Inicio',
    icon: 'Home',
    route: ROUTES.HOME,
    available: true,
  },
  {
    id: 'campos-vectoriales',
    label: 'Campos Vectoriales',
    icon: 'Wind',
    route: ROUTES.VECTOR_FIELD,
    available: true,
  },
  {
    id: 'gradiente',
    label: 'Gradiente',
    icon: 'TrendingUp',
    route: ROUTES.GRADIENT,
    available: false,
  },
  {
    id: 'divergencia',
    label: 'Divergencia',
    icon: 'GitFork',
    route: ROUTES.DIVERGENCE,
    available: false,
  },
  {
    id: 'rotacional',
    label: 'Rotacional',
    icon: 'RotateCw',
    route: ROUTES.CURL,
    available: false,
  },
  {
    id: 'integrales',
    label: 'Integrales',
    icon: 'Sigma',
    route: ROUTES.INTEGRALS,
    available: false,
  },
];

export const SECONDARY_MODULES = [
  {
    id: 'configuracion',
    label: 'Configuración',
    icon: 'Settings',
    route: ROUTES.SETTINGS,
    available: true,
  },
  {
    id: 'acerca-de',
    label: 'Acerca del proyecto',
    icon: 'Info',
    route: ROUTES.ABOUT,
    available: true,
  },
];
