export function NumberField({ label, value, onChange, step = 1 }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-ink-muted">{label}</span>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-9 rounded-lg border border-border bg-surface-sunken px-3 font-mono text-sm text-ink outline-none transition-colors focus:border-accent"
      />
    </label>
  );
}

export function ExpressionField({ label, value, onChange, error, placeholder }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-ink-muted">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`h-10 rounded-lg border bg-surface-sunken px-3 font-mono text-sm text-ink outline-none transition-colors focus:border-accent ${
          error ? 'border-danger' : 'border-border'
        }`}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}
