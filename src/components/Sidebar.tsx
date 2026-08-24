import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanSearch,
  ListChecks,
  BrainCircuit,
  BarChart3,
  ScrollText,
  Settings,
  Shield,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
}

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Risk Operations',
    items: [
      { to: '/analyze', label: 'Analyze Transaction', icon: ScanSearch },
      { to: '/transactions', label: 'Transactions', icon: ListChecks },
      { to: '/intelligence', label: 'Risk Intelligence', icon: BarChart3 },
    ],
  },
  {
    title: 'AI & Model',
    items: [
      { to: '/model', label: 'Model Performance', icon: BrainCircuit },
      { to: '/audit', label: 'Audit Trail', icon: ScrollText },
    ],
  },
  {
    title: 'System',
    items: [{ to: '/settings', label: 'Settings', icon: Settings }],
  },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-[260px] flex-col border-r border-white/[0.06] bg-space-900/80 backdrop-blur-xl transition-transform md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 shadow-glow-brand">
              <Shield className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-tight text-ink-50">
                PayShield <span className="text-brand-300">AI</span>
              </span>
              <span className="mt-0.5 text-[10px] font-medium text-ink-400">
                Risk Intelligence
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 hover:bg-white/5 hover:text-ink-100 md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {groups.map((g) => (
            <div key={g.title} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-500">
                {g.title}
              </p>
              <div className="space-y-0.5">
                {g.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-brand-500/10 text-brand-200 shadow-[inset_0_0_0_1px_rgba(26,130,245,0.25)]'
                          : 'text-ink-300 hover:bg-white/[0.04] hover:text-ink-100',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={cn(
                            'h-4.5 w-4.5 shrink-0',
                            isActive ? 'text-brand-300' : 'text-ink-400 group-hover:text-ink-200',
                          )}
                        />
                        {item.label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Model status */}
        <div className="border-t border-white/[0.06] px-4 py-4">
          <div className="rounded-xl border border-white/[0.06] bg-space-850/60 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-300">Model Status</span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Online
              </span>
            </div>
            <p className="mt-2 text-[11px] text-ink-400">Risk Engine v1.0</p>
            <p className="mt-0.5 text-[10px] text-ink-500">Prototype · 142ms latency</p>
          </div>
        </div>
      </aside>
    </>
  );
}
