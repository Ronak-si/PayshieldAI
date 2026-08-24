import type { RiskSignal } from '@/types';
import { cn } from '@/lib/utils';

const sevColor = {
  LOW: 'bg-emerald-400',
  MEDIUM: 'bg-amber-400',
  HIGH: 'bg-orange-400',
};

export function RiskSignalBar({ signal, max }: { signal: RiskSignal; max: number }) {
  const pct = Math.min(100, (signal.contribution / max) * 100);
  const sev = sevColor[signal.severity];
  return (
    <div className="group rounded-xl border border-white/[0.06] bg-space-900/50 p-3.5 transition-colors hover:border-white/10 hover:bg-space-850/70">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn('h-1.5 w-1.5 rounded-full', sev)} />
          <span className="text-sm font-medium text-ink-100">{signal.name}</span>
        </div>
        <span className="font-mono text-sm font-semibold text-ink-50">
          +{signal.contribution}
        </span>
      </div>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background:
              signal.severity === 'HIGH'
                ? 'linear-gradient(90deg, #f97316, #ef4444)'
                : signal.severity === 'MEDIUM'
                ? 'linear-gradient(90deg, #f59e0b, #f97316)'
                : 'linear-gradient(90deg, #10b981, #f59e0b)',
          }}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-ink-400">{signal.explanation}</p>
      <span className="mt-1.5 inline-block text-[10px] font-semibold uppercase tracking-wider text-ink-500">
        Severity: {signal.severity}
      </span>
    </div>
  );
}
