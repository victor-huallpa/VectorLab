import { NavLink } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { MODULES, SECONDARY_MODULES } from '../../constants/modules.js';
import { ICONS } from '../../constants/icons.js';
import { useUIStore } from '../../store/useUIStore.js';
import Badge from '../ui/Badge.jsx';

function NavItem({ mod, collapsed }) {
  const Icon = ICONS[mod.icon];

  if (!mod.available) {
    return (
      <div
        className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-ink-faint"
        title="Próximamente"
      >
        <Icon size={18} strokeWidth={1.75} />
        {!collapsed && (
          <span className="flex flex-1 items-center justify-between text-sm">
            {mod.label}
            <Badge tone="muted">Próximamente</Badge>
          </span>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={mod.route}
      end={mod.route === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
          isActive
            ? 'bg-accent/10 text-accent'
            : 'text-ink-muted hover:bg-surface-raised hover:text-ink'
        }`
      }
    >
      <Icon size={18} strokeWidth={1.75} />
      {!collapsed && <span>{mod.label}</span>}
    </NavLink>
  );
}

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <aside
      className={`hidden shrink-0 flex-col border-r border-border bg-surface transition-all duration-200 md:flex ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex h-14 items-center justify-between border-b border-border-subtle px-4">
        {!sidebarCollapsed && (
          <span className="font-display text-sm font-semibold tracking-wide text-ink">
            Vector<span className="text-accent">Lab</span>
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1.5 text-ink-muted hover:bg-surface-raised hover:text-ink"
          aria-label={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {MODULES.map((mod) => (
          <NavItem key={mod.id} mod={mod} collapsed={sidebarCollapsed} />
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-border-subtle p-3">
        {SECONDARY_MODULES.map((mod) => (
          <NavItem key={mod.id} mod={mod} collapsed={sidebarCollapsed} />
        ))}
      </div>
    </aside>
  );
}
