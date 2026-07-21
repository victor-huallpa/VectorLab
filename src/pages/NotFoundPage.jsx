import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import Button from '../components/ui/Button.jsx';

export default function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <span className="font-display text-5xl font-bold text-ink-faint">404</span>
      <p className="text-sm text-ink-muted">Esta página no existe en el laboratorio.</p>
      <Link to={ROUTES.HOME}>
        <Button variant="secondary">Volver al inicio</Button>
      </Link>
    </div>
  );
}
