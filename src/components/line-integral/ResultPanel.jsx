import { Sigma, AlertTriangle } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';

/**
 * Panel de resultado del laboratorio de Integrales de Línea, misma
 * convención visual que AnalysisCard.jsx (Card + CardHeader + estado
 * por status). Recibe `result`/`status` desde useLineIntegralComputation:
 * `result` es la salida de computeLineIntegralWithProcedure
 * (domain/line-integral/LineIntegralInterpreter.js), con el valor final,
 * el procedimiento paso a paso y una tabla de puntos de muestra.
 */
export default function ResultPanel({ result, status }) {
  if (status === 'loading' || !result) {
    return (
      <Card>
        <CardHeader title="Resultado" description="∫_C F · dr" action={<Badge tone="muted">Calculando…</Badge>} />
        <div className="flex flex-col items-center gap-2 px-5 py-6 text-center">
          <Sigma size={20} className="text-ink-faint" />
          <p className="max-w-xs text-xs text-ink-muted">Calculando…</p>
        </div>
      </Card>
    );
  }

  if (result.status === 'error') {
    const messages = Object.values(result.errors ?? {});
    return (
      <Card>
        <CardHeader title="Resultado" description="∫_C F · dr" action={<Badge tone="ember">Entrada inválida</Badge>} />
        <div className="flex flex-col items-center gap-2 px-5 py-6 text-center">
          <AlertTriangle size={20} className="text-ember" />
          <p className="max-w-xs text-xs text-ink-muted">
            Completa y corrige los campos marcados en el formulario para calcular la integral.
          </p>
          {messages.length > 0 && (
            <ul className="mt-1 space-y-1 text-left text-xs text-ember">
              {messages.map((msg, i) => (
                <li key={i}>• {msg}</li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    );
  }

  const { value, steps, samplesTable } = result;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Resultado" description="∫_C F · dr" action={<Badge tone="accent">Calculado</Badge>} />
        <div className="flex flex-col items-center gap-1 px-5 py-6 text-center">
          <Sigma size={20} className="text-accent" />
          <p className="font-mono text-2xl text-ink">{formatResult(value)}</p>
        </div>
      </Card>

      <Card>
        <CardHeader title="Procedimiento paso a paso" description="Cómo se llegó al resultado" />
        <ol className="space-y-4 px-5 py-4">
          {steps.map((step) => (
            <li key={step.id}>
              <p className="text-xs font-semibold tracking-wide text-ink">{step.title}</p>
              <div className="mt-1 space-y-0.5">
                {step.lines.map((line, i) => (
                  <p key={i} className="break-words font-mono text-xs text-ink-muted">
                    {line}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {samplesTable && samplesTable.length > 0 && (
        <Card>
          <CardHeader title="Evaluación en puntos de muestra" description="r(t), r'(t), F(r(t)) y su producto punto" />
          <div className="overflow-x-auto px-5 py-4">
            <table className="w-full min-w-[480px] text-left font-mono text-xs text-ink-muted">
              <thead>
                <tr className="border-b border-border-subtle text-ink">
                  <th className="py-1 pr-3">t</th>
                  <th className="py-1 pr-3">r(t)</th>
                  <th className="py-1 pr-3">r'(t)</th>
                  <th className="py-1 pr-3">F(r(t))</th>
                  <th className="py-1">F · r'</th>
                </tr>
              </thead>
              <tbody>
                {samplesTable.map((row, i) => (
                  <tr key={i} className="border-b border-border-subtle/50 last:border-0">
                    <td className="py-1 pr-3">{row.t}</td>
                    <td className="py-1 pr-3">{row.rt}</td>
                    <td className="py-1 pr-3">{row.rPrime}</td>
                    <td className="py-1 pr-3">{row.F}</td>
                    <td className="py-1">{row.dot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function formatResult(value) {
  if (value === null || Number.isNaN(value)) return '—';
  return Number(value.toFixed(6)).toString();
}
