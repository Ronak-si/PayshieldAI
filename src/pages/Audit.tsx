import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollText, ChevronRight, X, User, Cpu, ShieldCheck, Activity } from 'lucide-react';
import { useStore } from '@/lib/store';
import { RiskBadge } from '@/components/RiskBadge';
import { DecisionBadge } from '@/components/DecisionBadge';
import type { AuditEvent } from '@/types';
import { cn, formatDateTime, formatTime } from '@/lib/utils';

export default function Audit() {
  const audit = useStore((s) => s.audit);
  const [selected, setSelected] = useState<AuditEvent | null>(null);

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="card animate-fade-in">
        <div className="flex items-center gap-2 px-5 py-4 sm:px-6">
          <ScrollText className="h-4 w-4 text-brand-300" />
          <h3 className="section-title">Decision Audit Trail</h3>
          <span className="ml-1 font-mono text-sm font-normal text-ink-400">{audit.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] text-left">
                {['Timestamp', 'Transaction', 'Model', 'Risk Score', 'Decision', 'Analyst', 'Action', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {audit.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className="group cursor-pointer border-b border-white/[0.04] transition-colors hover:bg-white/[0.025]"
                >
                  <td className="px-4 py-3 font-mono text-xs text-ink-400">{formatTime(e.timestamp)}</td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/transactions/${e.transactionId}`}
                      onClick={(ev) => ev.stopPropagation()}
                      className="font-mono text-xs font-medium text-brand-300 hover:text-brand-200"
                    >
                      {e.transactionId}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-ink-400 sm:table-cell">{e.modelVersion.split(' ').slice(-2).join(' ')}</td>
                  <td className="px-4 py-3 font-mono text-sm font-semibold text-ink-100">{e.riskScore}</td>
                  <td className="px-4 py-3"><RiskBadge level={e.riskScore >= 90 ? 'CRITICAL' : e.riskScore >= 70 ? 'HIGH' : e.riskScore >= 30 ? 'MEDIUM' : 'SAFE'} size="xs" /></td>
                  <td className="px-4 py-3"><DecisionBadge decision={e.decision} size="xs" /></td>
                  <td className="hidden px-4 py-3 text-xs text-ink-300 md:table-cell">{e.analyst}</td>
                  <td className="px-4 py-3 text-xs text-ink-300">{e.action}</td>
                  <td className="px-2">
                    <ChevronRight className="h-4 w-4 text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <AuditDetailDrawer event={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function AuditDetailDrawer({ event, onClose }: { event: AuditEvent; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in-fast" onClick={onClose} />
      <div className="relative h-full w-full max-w-md overflow-y-auto border-l border-white/[0.08] bg-space-850/95 backdrop-blur-xl animate-fade-in">
        <div className="sticky top-0 flex items-center justify-between border-b border-white/[0.06] bg-space-850/90 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-brand-300" />
            <h3 className="text-sm font-semibold text-ink-50">Audit Detail</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-white/5 hover:text-ink-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <Section icon={Activity} title="Overview">
            <Row label="Audit ID" value={event.id} mono />
            <Row label="Timestamp" value={formatDateTime(event.timestamp)} />
            <Row label="Transaction" value={event.transactionId} mono />
            <Row label="Model Version" value={event.modelVersion} />
            <Row label="Risk Score" value={String(event.riskScore)} mono />
            <Row label="Reason" value={event.reason} />
          </Section>

          <Section icon={User} title="Analyst">
            <Row label="Analyst" value={event.analyst} />
            <Row label="Recommended" value={event.recommended ?? '—'} />
            <Row label="Final Action" value={event.finalAction ?? '—'} />
            <Row label="Action Recorded" value={event.action} />
          </Section>

          {event.signals && event.signals.length > 0 && (
            <Section icon={ShieldCheck} title="Risk Factors">
              <div className="space-y-2">
                {event.signals.map((s) => (
                  <div key={s.name} className="rounded-lg border border-white/[0.06] bg-space-900/50 p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-ink-100">{s.name}</span>
                      <span className="font-mono text-xs text-orange-300">+{s.contribution}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-ink-400">{s.explanation}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section icon={Cpu} title="Model Output">
            <Row label="Decision" value={event.decision} />
            <Row label="Model Version" value={event.modelVersion} />
          </Section>

          <Link
            to={`/transactions/${event.transactionId}`}
            className="btn-ghost w-full"
          >
            View full transaction →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof User; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-space-900/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-300" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-300">{title}</h4>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/[0.04] py-1.5 last:border-0">
      <span className="shrink-0 text-xs text-ink-400">{label}</span>
      <span className={cn('text-right text-xs font-medium text-ink-100', mono && 'font-mono')}>{value}</span>
    </div>
  );
}
