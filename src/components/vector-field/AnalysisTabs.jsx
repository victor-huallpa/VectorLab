import { useState } from 'react';
import AnalysisCard from './AnalysisCard.jsx';
import PropertiesPanel from './PropertiesPanel.jsx';
import InterpretationCard from './InterpretationCard.jsx';

const TABS = [
  { id: 'analysis', label: 'Análisis' },
  { id: 'properties', label: 'Propiedades' },
  { id: 'interpretation', label: 'Interpretación' },
];

/**
 * Versión compacta del bloque "Análisis del campo / Propiedades
 * matemáticas / Interpretación educativa" para pantallas de poca
 * altura (p. ej. laptops 1366x720). En vez de apilar las tres tarjetas
 * completas -que en esas resoluciones empujan el canvas fuera de
 * vista y obligan a scrollear de más-, muestra una a la vez detrás de
 * un selector de pestañas, dentro de un contenedor de altura acotada
 * con scroll propio.
 *
 * No es un módulo nuevo ni elimina información: reutiliza los mismos
 * componentes (AnalysisCard, PropertiesPanel, InterpretationCard) que
 * ya se usan en el grid de 3 columnas de pantallas grandes. Solo
 * cambia CÓMO se distribuyen cuando falta altura vertical. Ver
 * VectorFieldPage.jsx: el grid original sigue existiendo tal cual y
 * se oculta con `short:hidden`; este componente aparece únicamente en
 * su lugar con `hidden short:block`.
 */
export default function AnalysisTabs({ classification, analysis, interpretation, status }) {
  const [active, setActive] = useState('analysis');

  return (
    <div className="flex max-h-56 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-panel">
      <div className="flex shrink-0 gap-1 border-b border-border-subtle p-1.5" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
              active === tab.id
                ? 'bg-accent/10 text-accent'
                : 'text-ink-muted hover:bg-surface-raised hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* El wrapper [&>div] anula el borde/sombra propios de <Card> para
          no duplicar el marco, ya que aquí el marco lo pone este contenedor. */}
      <div className="overflow-y-auto [&>div]:rounded-none [&>div]:border-none [&>div]:shadow-none">
        {active === 'analysis' && <AnalysisCard classification={classification} status={status} />}
        {active === 'properties' && <PropertiesPanel analysis={analysis} status={status} />}
        {active === 'interpretation' && (
          <InterpretationCard interpretation={interpretation} status={status} />
        )}
      </div>
    </div>
  );
}
