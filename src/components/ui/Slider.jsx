/**
 * Slider con etiqueta y valor visible. Usado para densidad, escala de
 * vectores y velocidad de partículas.
 */
export default function Slider({ label, value, onChange, min, max, step = 1, unit = '', formatValue }) {
  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center justify-between text-xs text-ink-muted">
        <span>{label}</span>
        <span className="font-mono text-ink">
          {displayValue}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
      />
    </label>
  );
}
