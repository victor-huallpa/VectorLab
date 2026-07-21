import { useEffect, useRef } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore.js';
import HelpSection from './HelpSection.jsx';

/**
 * HelpDrawer: panel lateral genérico de ayuda. Se controla enteramente
 * desde useUIStore (helpOpen / helpActiveSectionId), así que CUALQUIER
 * laboratorio puede montarlo pasándole su propio `content` (con la
 * forma de vectorFieldHelpContent.js) sin duplicar el drawer en sí.
 *
 * Deliberadamente un Drawer (no un Alert ni un Prompt): permite leer
 * varias secciones con calma sin bloquear el resto de la pantalla.
 *
 * @param {{ content: { labTitle: string, sections: object[] }, onUseExample?: Function }} props
 */
export default function HelpDrawer({ content, onUseExample }) {
  const open = useUIStore((s) => s.helpOpen);
  const activeSectionId = useUIStore((s) => s.helpActiveSectionId);
  const closeHelp = useUIStore((s) => s.closeHelp);
  const sectionRefs = useRef({});

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') closeHelp();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, closeHelp]);

  useEffect(() => {
    if (open && activeSectionId && sectionRefs.current[activeSectionId]) {
      sectionRefs.current[activeSectionId].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [open, activeSectionId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar ayuda"
        onClick={closeHelp}
        className="absolute inset-0 bg-void/70 backdrop-blur-sm"
      />
      <aside className="animate-fade-in relative flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-panel">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-accent" />
            <div>
              <h3 className="font-display text-sm font-semibold text-ink">Centro de ayuda</h3>
              <p className="text-xs text-ink-muted">{content.labTitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeHelp}
            aria-label="Cerrar"
            className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {content.sections.map((section) => (
            <HelpSection
              key={section.id}
              section={section}
              highlighted={section.id === activeSectionId}
              onUseExample={onUseExample}
              ref={(el) => {
                sectionRefs.current[section.id] = el;
              }}
            />
          ))}
        </div>
      </aside>
    </div>
  );
}
