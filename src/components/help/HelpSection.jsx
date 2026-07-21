import { forwardRef } from 'react';
import HelpCard from './HelpCard.jsx';
import HelpExample from './HelpExample.jsx';

/**
 * HelpSection: composición genérica de una sección de ayuda a partir
 * de datos puros (ver vectorFieldHelpContent.js). No contiene ningún
 * texto propio — todo viene de `section`.
 */
const HelpSection = forwardRef(function HelpSection({ section, onUseExample, highlighted }, ref) {
  return (
    <section
      ref={ref}
      id={`help-section-${section.id}`}
      className={`scroll-mt-4 rounded-xl border p-4 transition-colors ${
        highlighted ? 'border-accent/50 bg-accent/5' : 'border-border-subtle bg-surface-sunken/40'
      }`}
    >
      <h4 className="font-display text-sm font-semibold text-ink">{section.title}</h4>
      <div className="mt-2 space-y-2">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-xs leading-relaxed text-ink-muted">
            {paragraph}
          </p>
        ))}
      </div>

      {section.items && (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {section.items.map((item) => (
            <HelpCard key={item.term} term={item.term} detail={item.detail} />
          ))}
        </div>
      )}

      {section.examples && (
        <div className="mt-3 space-y-2">
          {section.examples.map((example) => (
            <HelpExample key={`${example.p}-${example.q}`} {...example} onUse={onUseExample} />
          ))}
        </div>
      )}
    </section>
  );
});

export default HelpSection;
