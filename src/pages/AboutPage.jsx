import Card, { CardHeader } from '../components/ui/Card.jsx';

const STACK = [
  ['React + Vite', 'Interfaz y tooling de desarrollo.'],
  ['Tailwind CSS', 'Sistema de diseño utilitario, sin librerías de componentes.'],
  ['Zustand', 'Estado global ligero, un store por dominio.'],
  ['Math.js', 'Evaluación segura de expresiones P(x,y), Q(x,y).'],
  ['Canvas 2D nativo', 'Render del campo y simulación de partículas a 60fps.'],
  ['jsPDF', 'Exportación de reportes en PDF.'],
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Acerca del proyecto</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Vector Lab es la base arquitectónica de un futuro laboratorio virtual de cálculo
          vectorial. Esta versión implementa un único módulo completo — el visualizador de campos
          vectoriales 2D — para validar los patrones de arquitectura que usarán todos los módulos
          siguientes.
        </p>
      </div>

      <Card>
        <CardHeader title="Stack tecnológico" />
        <div className="divide-y divide-border-subtle">
          {STACK.map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-0.5 px-5 py-3.5 sm:flex-row sm:justify-between">
              <span className="text-sm font-medium text-ink">{name}</span>
              <span className="text-xs text-ink-muted sm:max-w-xs sm:text-right">{desc}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Sin backend, por diseño" />
        <p className="px-5 py-4 text-sm leading-relaxed text-ink-muted">
          No hay base de datos ni servidor. Toda la información pasa por una capa de servicios que
          simula peticiones HTTP (con latencia real) y persiste el historial en LocalStorage. El
          día que exista una API, solo esa capa cambia — componentes y estado no se tocan.
        </p>
      </Card>
    </div>
  );
}
