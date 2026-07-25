import { useRef } from 'react';
import { useLineIntegralStore } from '../store/useLineIntegralStore.js';
import { useHistoryStore } from '../store/useHistoryStore.js';
import { useLineIntegralComputation } from '../hooks/useLineIntegralComputation.js';
import LineIntegralForm from '../components/line-integral/LineIntegralForm.jsx';
import LineIntegralCanvas from '../components/line-integral/LineIntegralCanvas.jsx';
import LineIntegralToolbar from '../components/line-integral/LineIntegralToolbar.jsx';
import LineIntegralHistoryPanel from '../components/line-integral/LineIntegralHistoryPanel.jsx';
import ResultPanel from '../components/line-integral/ResultPanel.jsx';
import HelpDrawer from '../components/help/HelpDrawer.jsx';
import { LINE_INTEGRAL_HELP_CONTENT } from '../content/help/lineIntegralHelpContent.js';
import { exportLineIntegralToPdf } from '../services/exportService.js';

/**
 * Página del laboratorio "Integrales de Línea".
 *
 * Estructura idéntica a VectorFieldPage.jsx (toolbar → aside con
 * formulario + historial → área de visualización → panel de resultado →
 * drawer de ayuda), para que integrarse a la arquitectura existente no
 * requiera ningún componente ni patrón nuevo. useLineIntegralComputation
 * llama al motor real (domain/line-integral/), que valida las entradas,
 * calcula la integral (2D o 3D según config.is3D) y arma el
 * procedimiento paso a paso que consume ResultPanel. El historial usa
 * el mismo store/servicio que Campos Vectoriales (useHistoryStore),
 * vía addLineIntegralEntry (ver store y HistoryEntry.js).
 */
export default function LineIntegralPage() {
  const { field, curve, config, setField, setCurve, updateConfig, loadPreset, reset } = useLineIntegralStore();
  const addLineIntegralEntry = useHistoryStore((s) => s.addLineIntegralEntry);
  const { result, status } = useLineIntegralComputation(field, curve, config.samples, config.is3D);
  const canvasRef = useRef(null);

  function handleExportPdf() {
    const canvas = canvasRef.current?.getSnapshotCanvas();
    exportLineIntegralToPdf({ canvas, field, curve, config, result, status });
  }

  function handleSaveHistory() {
    return addLineIntegralEntry({ field, curve, config });
  }

  function handleRestore(entry) {
    setField(entry.campoVectorial);
    setCurve(entry.curva);
    updateConfig(entry.configuracion);
  }

  return (
    <div className="flex h-full flex-col">
      <LineIntegralToolbar
        onReset={reset}
        onExportPdf={handleExportPdf}
        onSaveHistory={handleSaveHistory}
        canExport={status === 'success'}
      />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 lg:flex-row lg:overflow-hidden">
        <aside className="w-full shrink-0 space-y-4 lg:h-full lg:w-80 lg:overflow-y-auto lg:pr-1">
          <LineIntegralForm
            field={field}
            curve={curve}
            config={config}
            onFieldChange={setField}
            onCurveChange={setCurve}
            onConfigChange={updateConfig}
            onLoadPreset={loadPreset}
          />
          <LineIntegralHistoryPanel onRestore={handleRestore} />
        </aside>

        <section className="flex flex-1 flex-col gap-4 lg:overflow-y-auto lg:pr-1">
          <div className="min-h-[420px] flex-1">
            <LineIntegralCanvas ref={canvasRef} field={field} curve={curve} config={config} />
          </div>
          <ResultPanel result={result} status={status} />
        </section>
      </div>

      <HelpDrawer content={LINE_INTEGRAL_HELP_CONTENT} />
    </div>
  );
}
