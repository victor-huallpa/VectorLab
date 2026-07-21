import { Link } from 'react-router-dom';
import { ArrowRight, Wind, TrendingUp, GitFork, RotateCw, Sigma } from 'lucide-react';
import { ROUTES } from '../constants/routes.js';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';

const ROADMAP = [
  { icon: Wind, name: 'Campos Vectoriales 2D', status: 'Disponible', tone: 'accent' },
  { icon: TrendingUp, name: 'Gradiente', status: 'Próximamente', tone: 'muted' },
  { icon: GitFork, name: 'Divergencia', status: 'Próximamente', tone: 'muted' },
  { icon: RotateCw, name: 'Rotacional', status: 'Próximamente', tone: 'muted' },
  { icon: Sigma, name: 'Integrales de línea, dobles y triples', status: 'Próximamente', tone: 'muted' },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-6 py-12">
      {/* Hero */}
      <section className="space-y-4">
        <Badge tone="accent">MVP · v0.1</Badge>
        <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
          Laboratorio Virtual de <span className="text-accent">Cálculo Vectorial</span>
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
          Un espacio interactivo para explorar visualmente los conceptos del cálculo vectorial:
          campos, gradientes, divergencia, rotacional e integrales. Esta primera versión entrega
          el visualizador de campos vectoriales 2D sobre una arquitectura pensada para crecer,
          módulo por módulo, durante varios semestres.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link to={ROUTES.VECTOR_FIELD}>
            <Button icon={ArrowRight}>Abrir Campos Vectoriales</Button>
          </Link>
          <Link to={ROUTES.ABOUT}>
            <Button variant="secondary">Acerca del proyecto</Button>
          </Link>
        </div>
      </section>

      {/* Objetivos */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <h3 className="font-display text-sm font-semibold text-ink">Comprender, no memorizar</h3>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            Cada módulo traduce una idea abstracta del cálculo vectorial en una imagen manipulable.
          </p>
        </Card>
        <Card className="p-5">
          <h3 className="font-display text-sm font-semibold text-ink">Crecer sin rehacerse</h3>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            Arquitectura modular por capas: servicios, estado y UI desacoplados desde el día uno.
          </p>
        </Card>
        <Card className="p-5">
          <h3 className="font-display text-sm font-semibold text-ink">De simulado a real</h3>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            Hoy los datos son simulados; mañana, una API real se conecta sin tocar la interfaz.
          </p>
        </Card>
      </section>

      {/* Roadmap */}
      <section>
        <h2 className="font-display text-lg font-semibold text-ink">Estado de desarrollo</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Módulos planeados para el laboratorio completo.
        </p>
        <Card className="mt-4 divide-y divide-border-subtle">
          {ROADMAP.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <item.icon size={18} className="text-ink-muted" />
                <span className="text-sm text-ink">{item.name}</span>
              </div>
              <Badge tone={item.tone}>{item.status}</Badge>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}
