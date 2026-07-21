export default function Card({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={`rounded-xl border border-border bg-surface shadow-panel ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border-subtle px-5 py-4">
      <div>
        <h3 className="font-display text-sm font-semibold tracking-wide text-ink">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
