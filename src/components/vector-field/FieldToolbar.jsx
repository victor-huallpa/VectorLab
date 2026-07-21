import { useState } from 'react';
import { Download, Save, RotateCcw, Check, HelpCircle } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { useUIStore } from '../../store/useUIStore.js';

export default function FieldToolbar({ onExportPdf, onSaveHistory, onReset }) {
  const [saved, setSaved] = useState(false);
  const openHelp = useUIStore((s) => s.openHelp);

  async function handleSave() {
    await onSaveHistory();
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface/60 px-4 py-3">
      <Button variant="secondary" size="sm" icon={Download} onClick={onExportPdf}>
        Exportar PDF
      </Button>
      <Button variant="secondary" size="sm" icon={saved ? Check : Save} onClick={handleSave}>
        {saved ? 'Guardado' : 'Guardar en historial'}
      </Button>
      <Button variant="ghost" size="sm" icon={HelpCircle} onClick={() => openHelp('que-es-campo')}>
        Ayuda
      </Button>
      <Button variant="ghost" size="sm" icon={RotateCcw} onClick={onReset} className="ml-auto">
        Restablecer
      </Button>
    </div>
  );
}
