import { CircleHelp } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore.js';

/**
 * HelpIconButton: el iconito "?" que se coloca en el header de cada
 * bloque importante (Funciones, Dominio, Visualización, Análisis...).
 * Un clic abre el HelpDrawer ya posicionado en `sectionId`, en lugar de
 * mostrar un Alert/Prompt/Tooltip con todo el texto — cumple con
 * "no usar Alert, no usar Prompt, no usar Tooltips para explicar todo".
 */
export default function HelpIconButton({ sectionId, label = 'Ayuda' }) {
  const openHelp = useUIStore((s) => s.openHelp);

  return (
    <button
      type="button"
      onClick={() => openHelp(sectionId)}
      aria-label={label}
      title={label}
      className="rounded-full p-1 text-ink-faint transition-colors hover:bg-surface-raised hover:text-accent"
    >
      <CircleHelp size={15} />
    </button>
  );
}
