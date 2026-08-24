import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Menu, Activity, ChevronDown } from 'lucide-react';
import { useStore } from '@/lib/store';

const titles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Risk Operations Center', subtitle: 'Real-time overview of payment risk and model health.' },
  '/analyze': { title: 'Analyze a Transaction', subtitle: 'Evaluate payment risk using transaction, customer and behavioral signals.' },
  '/transactions': { title: 'Transaction History', subtitle: 'Search, filter and audit every analyzed transaction.' },
  '/model': { title: 'Model Performance', subtitle: 'Measure what the model gets right — and where it fails.' },
  '/intelligence': { title: 'Risk Intelligence', subtitle: 'Patterns and signals across your transaction landscape.' },
  '/audit': { title: 'Decision Audit Trail', subtitle: 'Every risk decision, traceable end-to-end.' },
  '/settings': { title: 'Settings', subtitle: 'Configure risk policy, model and notifications.' },
};

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const { pathname } = useLocation();
  const demoMode = useStore((s) => s.settings.demoMode);
  const toggleDemo = useStore((s) => s.toggleDemoMode);
  const meta = titles[pathname] ?? { title: 'PayShield AI', subtitle: '' };
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-space-950/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onMenu}
          className="rounded-lg p-2 text-ink-300 hover:bg-white/5 hover:text-ink-100 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-ink-50 sm:text-lg">{meta.title}</h1>
          <p className="hidden truncate text-xs text-ink-400 sm:block">{meta.subtitle}</p>
        </div>

        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            placeholder="Search transactions…"
            className="w-56 rounded-xl border border-white/[0.08] bg-space-900/60 py-2 pl-9 pr-3 text-sm text-ink-100 placeholder:text-ink-500 outline-none transition focus:border-brand-400/50 focus:ring-2 focus:ring-brand-500/15 lg:w-72"
          />
        </div>

        {/* Demo mode toggle */}
        <button
          onClick={toggleDemo}
          className={
            'hidden items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition sm:flex ' +
            (demoMode
              ? 'border-brand-500/40 bg-brand-500/15 text-brand-200'
              : 'border-white/[0.08] bg-white/[0.02] text-ink-300 hover:text-ink-100')
          }
          aria-pressed={demoMode}
        >
          <span className={demoMode ? 'h-1.5 w-1.5 rounded-full bg-brand-400' : 'h-1.5 w-1.5 rounded-full bg-ink-500'} />
          Demo Mode
        </button>

        {/* Live status */}
        <div className="hidden items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2 lg:flex">
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-300">LIVE RISK ENGINE</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif((v) => !v)}
            className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-2 text-ink-300 transition hover:text-ink-100"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-400" />
          </button>
          {showNotif && (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-white/[0.08] bg-space-850/95 p-3 shadow-card backdrop-blur-xl animate-scale-in">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">Notifications</p>
              <div className="space-y-2">
                <NotifItem title="High-risk transaction flagged" detail="TXN-92831 · Score 91" color="orange" />
                <NotifItem title="Model latency nominal" detail="142ms · within SLA" color="emerald" />
                <NotifItem title="New audit event recorded" detail="Decision: MANUAL REVIEW" color="brand" />
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] py-1.5 pl-1.5 pr-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 text-xs font-bold text-white">
            RS
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-semibold text-ink-50">Ronak Singh</p>
            <p className="text-[10px] text-ink-400">Risk Analyst</p>
          </div>
          <ChevronDown className="hidden h-3.5 w-3.5 text-ink-500 sm:block" />
        </div>
      </div>
    </header>
  );
}

function NotifItem({ title, detail, color }: { title: string; detail: string; color: string }) {
  const colors: Record<string, string> = {
    orange: 'bg-orange-400',
    emerald: 'bg-emerald-400',
    brand: 'bg-brand-400',
  };
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-white/[0.05] bg-space-900/50 p-2.5">
      <span className={'mt-1 h-2 w-2 shrink-0 rounded-full ' + colors[color]} />
      <div>
        <p className="text-xs font-medium text-ink-100">{title}</p>
        <p className="text-[11px] text-ink-400">{detail}</p>
      </div>
    </div>
  );
}
