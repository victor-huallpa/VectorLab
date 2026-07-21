import { Trash2 } from 'lucide-react';
import Card, { CardHeader } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { useHistoryStore } from '../store/useHistoryStore.js';
import { useFieldStore } from '../store/useFieldStore.js';

export default function SettingsPage() {
  const clearAll = useHistoryStore((s) => s.clearAll);
  const resetField = useFieldStore((s) => s.reset);

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <Card>
        <CardHeader
          title="Historial de consultas"
          description="El historial se guarda localmente en tu navegador (LocalStorage)."
        />
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-sm text-ink-muted">Elimina permanentemente todas las consultas guardadas.</p>
          <Button variant="danger" icon={Trash2} onClick={() => clearAll()}>
            Vaciar historial
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Campo vectorial"
          description="Restablece el módulo de visualización a sus valores por defecto."
        />
        <div className="flex items-center justify-between px-5 py-4">
          <p className="text-sm text-ink-muted">P(x,y) = -y, Q(x,y) = x, dominio [-5, 5].</p>
          <Button variant="secondary" onClick={() => resetField()}>
            Restablecer
          </Button>
        </div>
      </Card>
    </div>
  );
}
