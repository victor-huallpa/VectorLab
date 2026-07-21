import { BookOpen, Sparkles } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import HelpIconButton from '../help/HelpIconButton.jsx';
import { FIELD_TYPE_LABELS } from '../../domain/field-analysis/index.js';
import { getEducationalContent } from '../../content/educational/fieldEducationalContent.js';

const CONFIDENCE_TONE = { alta: 'accent', media: 'ember', baja: 'muted' };

/**
 * AnalysisCard: la primera tarjeta del módulo "Análisis del Campo".
 * Muestra QUÉ detectó el clasificador y por qué, y debajo consume el
 * contenido educativo correspondiente desde fieldEducationalContent.js
 * (nunca escribe explicaciones propias aquí).
 */
export default function AnalysisCard({ classification, status }) {
  if (status !== 'ready' || !classification) {
    return (
      <Card className="animate-fade-in">
        <CardHeader title="Análisis del campo" description="Se actualiza automáticamente" />
        <div className="flex items-center gap-2 px-5 py-6 text-sm text-ink-muted">
          <Sparkles size={16} />
          Esperando una función válida para clasificar el campo…
        </div>
      </Card>
    );
  }

  const content = getEducationalContent(classification.type);

  return (
    <Card className="animate-fade-in">
      <CardHeader
        title="Análisis del campo"
        description="Clasificación automática según el comportamiento matemático"
        action={<HelpIconButton sectionId="analisis" />}
      />
      <div className="space-y-4 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{FIELD_TYPE_LABELS[classification.type]}</Badge>
          <Badge tone={CONFIDENCE_TONE[classification.confidence] ?? 'muted'}>
            Confianza {classification.confidence}
          </Badge>
        </div>

        <p className="text-sm text-ink-muted">{classification.reason}</p>

        <div className="rounded-lg border border-border-subtle bg-surface-sunken p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-ink">
            <BookOpen size={13} /> {content.nombre}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{content.explicacion}</p>
        </div>
      </div>
    </Card>
  );
}
