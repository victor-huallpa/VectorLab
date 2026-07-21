import { Menu } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore.js';

export default function TopBar({ title, subtitle }) {
  const { setMobileMenuOpen } = useUIStore();

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface/60 px-4 backdrop-blur">
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="rounded-md p-1.5 text-ink-muted hover:bg-surface-raised md:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>
      <div className="min-w-0">
        <h1 className="truncate font-display text-sm font-semibold text-ink">{title}</h1>
        {subtitle && <p className="truncate text-xs text-ink-muted">{subtitle}</p>}
      </div>
    </header>
  );
}
