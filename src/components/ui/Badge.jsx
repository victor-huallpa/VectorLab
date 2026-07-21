const TONES = {
  accent: 'bg-accent/10 text-accent border-accent/30',
  ember: 'bg-ember/10 text-ember border-ember/30',
  muted: 'bg-surface-raised text-ink-muted border-border',
};

export default function Badge({ children, tone = 'muted', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
