import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import MainLayout from '../layouts/MainLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import VectorFieldPage from '../pages/VectorFieldPage.jsx';
import ComingSoonPage from '../pages/ComingSoonPage.jsx';
import SettingsPage from '../pages/SettingsPage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        handle: { title: 'Inicio', subtitle: 'Laboratorio Virtual de Cálculo Vectorial' },
      },
      {
        path: ROUTES.VECTOR_FIELD.slice(1),
        element: <VectorFieldPage />,
        handle: { title: 'Campos Vectoriales', subtitle: 'Visualizador 2D interactivo' },
      },
      {
        path: ROUTES.GRADIENT.slice(1),
        element: <ComingSoonPage moduleName="Gradiente" />,
        handle: { title: 'Gradiente', subtitle: 'Próximamente' },
      },
      {
        path: ROUTES.DIVERGENCE.slice(1),
        element: <ComingSoonPage moduleName="Divergencia" />,
        handle: { title: 'Divergencia', subtitle: 'Próximamente' },
      },
      {
        path: ROUTES.CURL.slice(1),
        element: <ComingSoonPage moduleName="Rotacional" />,
        handle: { title: 'Rotacional', subtitle: 'Próximamente' },
      },
      {
        path: ROUTES.INTEGRALS.slice(1),
        element: <ComingSoonPage moduleName="Integrales" />,
        handle: { title: 'Integrales', subtitle: 'Próximamente' },
      },
      {
        path: ROUTES.SETTINGS.slice(1),
        element: <SettingsPage />,
        handle: { title: 'Configuración' },
      },
      {
        path: ROUTES.ABOUT.slice(1),
        element: <AboutPage />,
        handle: { title: 'Acerca del proyecto' },
      },
      {
        path: '*',
        element: <NotFoundPage />,
        handle: { title: 'No encontrado' },
      },
    ],
  },
]);
