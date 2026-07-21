import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { MODULES, SECONDARY_MODULES } from '../../constants/modules.js';
import { ICONS } from '../../constants/icons.js';
import { useUIStore } from '../../store/useUIStore.js';
import Badge from '../ui/Badge.jsx';

export default function MobileNav() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();

  if (!mobileMenuOpen) return null;

  const allModules = [...MODULES, ...SECONDARY_MODULES];

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
      <div className="relative z-10 flex w-72 flex-col bg-surface animate-fade-in">
        <div className="flex h-14 items-center justify-between border-b border-border-subtle px-4">
          <span className="font-display text-sm font-semibold text-ink">
            Vector<span className="text-accent">Lab</span>
          </span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-md p-1.5 text-ink-muted hover:bg-surface-raised"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {allModules.map((mod) => {
            const Icon = ICONS[mod.icon];
            if (!mod.available) {
              return (
                <div
                  key={mod.id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-ink-faint"
                >
                  <Icon size={18} />
                  <span className="flex flex-1 items-center justify-between text-sm">
                    {mod.label}
                    <Badge tone="muted">Próximamente</Badge>
                  </span>
                </div>
              );
            }
            return (
              <NavLink
                key={mod.id}
                to={mod.route}
                end={mod.route === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                    isActive ? 'bg-accent/10 text-accent' : 'text-ink-muted hover:bg-surface-raised'
                  }`
                }
              >
                <Icon size={18} />
                {mod.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
