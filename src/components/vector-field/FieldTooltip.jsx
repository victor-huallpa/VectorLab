import { formatNumber } from '../../utils/formatters.js';

export default function FieldTooltip({ x, y, data }) {
  if (!data) return null;

  return (
    <div
      className="pointer-events-none absolute z-10 min-w-[160px] rounded-lg border border-border bg-surface-raised/95 px-3 py-2 text-xs shadow-panel backdrop-blur"
      style={{ left: x + 14, top: y + 14 }}
    >
      <div className="font-mono text-ink-muted">
        (x, y) = ({formatNumber(data.x)}, {formatNumber(data.y)})
      </div>
      <div className="mt-1 font-mono text-accent">
        (P, Q) = ({formatNumber(data.vx)}, {formatNumber(data.vy)})
      </div>
      <div className="mt-1 flex items-center justify-between text-ink-muted">
        <span>Magnitud</span>
        <span className="font-mono text-ink">{formatNumber(data.magnitude)}</span>
      </div>
    </div>
  );
}
