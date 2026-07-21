import { useEffect } from 'react';
import { RotateCw, Trash2, History } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card.jsx';
import { useHistoryStore } from '../../store/useHistoryStore.js';
import { formatDate } from '../../utils/formatters.js';

export default function HistoryPanel({ onRestore }) {
  const { entries, status, loadHistory, removeEntry } = useHistoryStore();

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <Card>
      <CardHeader title="Historial de consultas" description="Guardado localmente en tu navegador" />
      <div className="max-h-72 divide-y divide-border-subtle overflow-y-auto">
        {status === 'loading' && (
          <p className="px-5 py-4 text-xs text-ink-muted">Cargando historial…</p>
        )}
        {status === 'success' && entries.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-5 py-8 text-center">
            <History size={20} className="text-ink-faint" />
            <p className="text-xs text-ink-muted">Aún no guardaste ninguna consulta.</p>
          </div>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="min-w-0">
              <p className="truncate font-mono text-xs text-ink">
                P={entry.campoVectorial.p} · Q={entry.campoVectorial.q}
              </p>
              <p className="mt-0.5 text-[11px] text-ink-muted">{formatDate(entry.fecha)}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => onRestore(entry)}
                className="rounded-md p-1.5 text-ink-muted hover:bg-surface-raised hover:text-accent"
                aria-label="Restaurar esta consulta"
                title="Restaurar"
              >
                <RotateCw size={14} />
              </button>
              <button
                onClick={() => removeEntry(entry.id)}
                className="rounded-md p-1.5 text-ink-muted hover:bg-danger/10 hover:text-danger"
                aria-label="Eliminar esta consulta"
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
