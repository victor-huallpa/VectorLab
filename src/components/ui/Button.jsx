const VARIANTS = {
  primary: 'bg-accent text-void hover:bg-accent-hover font-medium',
  secondary: 'bg-surface-raised text-ink hover:bg-border border border-border',
  ghost: 'text-ink-muted hover:text-ink hover:bg-surface-raised',
  danger: 'bg-danger/10 text-danger hover:bg-danger/20 border border-danger/30',
};

const SIZES = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
};

/**
 * Botón base de todo el laboratorio. Un solo componente con variantes
 * evita que cada pantalla reinvente su propio estilo de botón.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} strokeWidth={2} />}
      {children}
    </button>
  );
}
