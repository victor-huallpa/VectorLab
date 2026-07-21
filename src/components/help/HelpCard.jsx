/**
 * HelpCard: bloque pequeño y genérico "término → detalle". No sabe
 * nada de campos vectoriales ni de ningún dominio en particular, así
 * que sirve igual para la sintaxis de expresiones de este laboratorio
 * o para cualquier glosario de un laboratorio futuro.
 */
export default function HelpCard({ term, detail }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-sunken px-3 py-2">
      <p className="text-xs font-medium text-ink">{term}</p>
      <p className="mt-0.5 font-mono text-xs text-ink-muted">{detail}</p>
    </div>
  );
}
