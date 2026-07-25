import { useState } from 'react';
import { Download, Save, RotateCcw, Check, HelpCircle } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { useUIStore } from '../../store/useUIStore.js';

/**
 * Barra de acciones del laboratorio de Integrales de Línea, misma
 * convención que FieldToolbar.jsx. "Exportar PDF" se habilita solo
 * cuando hay un resultado calculado con éxito (`canExport`), y
 * reutiliza LineIntegralReportGenerator (mismas primitivas de
 * pdfDrawHelpers.js que usa el reporte de Campos Vectoriales).
 * "Guardar en historial" sigue el mismo patrón de feedback local
 * (icono Check por 1.8s) que ya usaba FieldToolbar.jsx.
 */
export default function LineIntegralToolbar({ onReset, onExportPdf, onSaveHistory, canExport }) {
  const [saved, setSaved] = useState(false);
  const openHelp = useUIStore((s) => s.openHelp);

  async function handleSave() {
    await onSaveHistory();
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface/60 px-4 py-3">
      <Button
        variant="secondary"
        size="sm"
        icon={Download}
        onClick={onExportPdf}
        disabled={!canExport}
        title={canExport ? undefined : 'Disponible cuando el resultado se calcule correctamente'}
      >
        Exportar PDF
      </Button>
      <Button variant="secondary" size="sm" icon={saved ? Check : Save} onClick={handleSave}>
        {saved ? 'Guardado' : 'Guardar en historial'}
      </Button>
      <Button variant="ghost" size="sm" icon={HelpCircle} onClick={() => openHelp('que-es-integral-linea')}>
        Ayuda
      </Button>
      <Button variant="ghost" size="sm" icon={RotateCcw} onClick={onReset} className="ml-auto">
        Restablecer
      </Button>
    </div>
  );
}
