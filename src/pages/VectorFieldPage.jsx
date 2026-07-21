import { useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useFieldStore } from '../store/useFieldStore.js';
import { useHistoryStore } from '../store/useHistoryStore.js';
import { useVectorFieldGrid } from '../hooks/useVectorFieldGrid.js';
import { useFieldAnalysis } from '../hooks/useFieldAnalysis.js';
import FieldForm from '../components/vector-field/FieldForm.jsx';
import FieldCanvas from '../components/vector-field/FieldCanvas.jsx';
import FieldToolbar from '../components/vector-field/FieldToolbar.jsx';
import HistoryPanel from '../components/vector-field/HistoryPanel.jsx';
import AnalysisCard from '../components/vector-field/AnalysisCard.jsx';
import PropertiesPanel from '../components/vector-field/PropertiesPanel.jsx';
import InterpretationCard from '../components/vector-field/InterpretationCard.jsx';
import HelpDrawer from '../components/help/HelpDrawer.jsx';
import { VECTOR_FIELD_HELP_CONTENT } from '../content/help/vectorFieldHelpContent.js';
import { exportFieldToPdf } from '../services/exportService.js';

export default function VectorFieldPage() {
  const { p, q, config, setExpressions, updateConfig, updateDomain, loadPreset, reset } = useFieldStore();
  const addHistoryEntry = useHistoryStore((s) => s.addEntry);
  const { vectors, validationError } = useVectorFieldGrid(p, q, config);
  const { analysis, classification, interpretation, status: analysisStatus } = useFieldAnalysis(p, q, config);
  const canvasRef = useRef(null);

  function handleExportPdf() {
    const canvas = canvasRef.current?.getSnapshotCanvas();
    if (!canvas) return;
    exportFieldToPdf({ canvas, p, q, config, analysis, classification, interpretation });
  }

  function handleSaveHistory() {
    return addHistoryEntry({ p, q, config });
  }

  function handleRestore(entry) {
    setExpressions(entry.campoVectorial.p, entry.campoVectorial.q);
    updateConfig(entry.configuracion);
  }

  function handleUseExample({ p: newP, q: newQ }) {
    setExpressions(newP, newQ);
  }

  return (
    <div className="flex h-full flex-col">
      <FieldToolbar onExportPdf={handleExportPdf} onSaveHistory={handleSaveHistory} onReset={reset} />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:overflow-hidden">
          <aside className="w-full shrink-0 space-y-4 lg:h-full lg:w-80 lg:overflow-y-auto lg:pr-1">
            <FieldForm
              p={p}
              q={q}
              config={config}
              onExpressionsChange={setExpressions}
              onConfigChange={updateConfig}
              onDomainChange={updateDomain}
              onLoadPreset={loadPreset}
            />
            <HistoryPanel onRestore={handleRestore} />
          </aside>

          <section className="relative min-h-[420px] flex-1">
            {validationError ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface-sunken text-center">
                <AlertTriangle size={20} className="text-danger" />
                <p className="max-w-xs text-sm text-danger">{validationError}</p>
              </div>
            ) : (
              <FieldCanvas ref={canvasRef} p={p} q={q} config={config} vectors={vectors} />
            )}
          </section>
        </div>

        {/* Módulo "Análisis del Campo": se actualiza solo, sin botón, cada
            vez que cambian p, q o el dominio (ver useFieldAnalysis). */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <AnalysisCard classification={classification} status={analysisStatus} />
          <PropertiesPanel analysis={analysis} status={analysisStatus} />
          <InterpretationCard interpretation={interpretation} status={analysisStatus} />
        </div>
      </div>

      <HelpDrawer content={VECTOR_FIELD_HELP_CONTENT} onUseExample={handleUseExample} />
    </div>
  );
}
