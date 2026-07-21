import { MessageCircleMore } from 'lucide-react';
import Card, { CardHeader } from '../ui/Card.jsx';

/**
 * InterpretationCard: el resumen educativo en lenguaje simple que pide
 * el prompt ("Las flechas apuntan hacia el origen.", etc.). Solo
 * renderiza el texto que ya produjo FieldInterpreter — no interpreta
 * nada por su cuenta.
 */
export default function InterpretationCard({ interpretation, status }) {
  if (status !== 'ready' || !interpretation) return null;

  return (
    <Card className="animate-fade-in">
      <CardHeader title="Interpretación" description="Qué significa esto en palabras simples" />
      <div className="space-y-3 px-5 py-4">
        <p className="flex items-start gap-2 text-sm leading-relaxed text-ink">
          <MessageCircleMore size={16} className="mt-0.5 shrink-0 text-accent" />
          {interpretation.summary}
        </p>
        {interpretation.details.length > 0 && (
          <ul className="space-y-1.5 border-t border-border-subtle pt-3">
            {interpretation.details.map((phrase) => (
              <li key={phrase} className="text-xs text-ink-muted">
                • {phrase}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
