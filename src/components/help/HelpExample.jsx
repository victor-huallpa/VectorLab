import { ArrowRight } from 'lucide-react';

/**
 * HelpExample: muestra una pareja de funciones de ejemplo con su
 * descripción. Si se le pasa onUse, además permite aplicarlo al
 * laboratorio con un clic — pero es opcional, porque un laboratorio
 * futuro que no trabaje con P/Q (ej. Integrales) puede reutilizar el
 * mismo componente solo para mostrar, sin la acción.
 */
export default function HelpExample({ p, q, description, onUse }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-surface-sunken px-3 py-2.5">
      <div>
        <p className="font-mono text-xs text-accent">
          P = {p} &nbsp;·&nbsp; Q = {q}
        </p>
        {description && <p className="mt-1 text-xs text-ink-muted">{description}</p>}
      </div>
      {onUse && (
        <button
          type="button"
          onClick={() => onUse({ p, q })}
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-ink-muted transition-colors hover:border-accent hover:text-accent"
        >
          Usar <ArrowRight size={12} />
        </button>
      )}
    </div>
  );
}
