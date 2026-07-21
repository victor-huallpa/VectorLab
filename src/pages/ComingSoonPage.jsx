import { Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import Button from '../components/ui/Button.jsx';

export default function ComingSoonPage({ moduleName }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="rounded-full bg-surface-raised p-4">
        <Construction size={28} className="text-ember" />
      </div>
      <h2 className="font-display text-xl font-semibold text-ink">Módulo {moduleName}</h2>
      <p className="max-w-md text-sm text-ink-muted">
        Este módulo todavía no está disponible. Forma parte de la hoja de ruta del laboratorio y
        se construirá sobre la misma arquitectura de servicios y estado que ya ves en Campos
        Vectoriales.
      </p>
      <Link to={ROUTES.VECTOR_FIELD}>
        <Button variant="secondary">Ir a Campos Vectoriales</Button>
      </Link>
    </div>
  );
}
