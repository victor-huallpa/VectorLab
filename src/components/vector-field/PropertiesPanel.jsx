import Card, { CardHeader } from '../ui/Card.jsx';
import HelpIconButton from '../help/HelpIconButton.jsx';

/**
 * PropertiesPanel: muestra los números crudos que produjo FieldAnalyzer.
 * No formatea explicaciones (eso es InterpretationCard) — es la vista
 * "técnica" para quien quiere ver los valores exactos.
 */
export default function PropertiesPanel({ analysis, status }) {
  return (
    <Card className="animate-fade-in">
      <CardHeader
        title="Propiedades matemáticas"
        description="Calculadas automáticamente sobre el dominio actual"
        action={<HelpIconButton sectionId="divergencia-rotacional" />}
      />
      <div className="grid grid-cols-2 gap-3 px-5 py-4 sm:grid-cols-3">
        <Property label="Divergencia (prom.)" value={formatNumber(analysis?.divergenceAvg)} />
        <Property label="Divergencia (origen)" value={formatNumber(analysis?.divergenceAtOrigin)} />
        <Property label="Rotacional (prom.)" value={formatNumber(analysis?.curlAvg)} />
        <Property label="Rotacional (origen)" value={formatNumber(analysis?.curlAtOrigin)} />
        <Property label="Magnitud mínima" value={formatNumber(analysis?.magnitude?.min)} />
        <Property label="Magnitud máxima" value={formatNumber(analysis?.magnitude?.max)} />
        <Property label="Magnitud promedio" value={formatNumber(analysis?.magnitude?.avg)} />
        <Property label="Dirección predominante" value={analysis?.predominantDirection?.label ?? 'No determinable'} mono={false} />
        <Property label="Tipo de flujo" value={analysis?.flowType ?? 'No determinable'} mono={false} />
      </div>
      {status === 'idle' && (
        <p className="border-t border-border-subtle px-5 py-3 text-xs text-ink-muted">
          Ingresa funciones P(x, y) y Q(x, y) válidas para ver las propiedades del campo.
        </p>
      )}
    </Card>
  );
}

function Property({ label, value, mono = true }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-sunken px-3 py-2.5">
      <p className="text-[11px] text-ink-muted">{label}</p>
      <p className={`mt-1 text-sm text-ink ${mono ? 'font-mono' : ''}`}>{value ?? 'N/D'}</p>
    </div>
  );
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/D';
  return value.toFixed(3);
}
