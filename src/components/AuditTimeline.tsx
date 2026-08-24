import { useEffect, useState } from 'react';
import type { Transaction } from '@/types';
import { cn, formatTime } from '@/lib/utils';

interface TimelineEntry {
  time: string;
  label: string;
  detail?: string;
}

function buildTimeline(txn: Transaction, finalAction?: string): TimelineEntry[] {
  const base = new Date(txn.createdAt);
  const steps: TimelineEntry[] = [];
  const add = (sec: number, label: string, detail?: string) => {
    const d = new Date(+base + sec * 1000);
    steps.push({ time: formatTime(d.toISOString()), label, detail });
  };
  add(0, 'Transaction received', `${txn.id} · ₹${txn.amount.toLocaleString('en-IN')}`);
  add(1, 'Features extracted', `${txn.signals?.length ?? 0} signals identified`);
  add(1, 'Risk model executed', txn.modelVersion);
  add(2, 'Risk score calculated', `Score: ${txn.riskScore} · ${txn.riskLevel}`);
  add(2, 'Decision recommendation', txn.decision);
  if (finalAction) {
    add(4, 'Analyst action recorded', finalAction);
  }
  return steps;
}

export function AuditTimeline({
  txn,
  finalAction,
  compact = false,
}: {
  txn: Transaction;
  finalAction?: string;
  compact?: boolean;
}) {
  const [visible, setVisible] = useState(0);
  const steps = buildTimeline(txn, finalAction);

  useEffect(() => {
    setVisible(0);
    const id = setInterval(() => {
      setVisible((v) => {
        if (v >= steps.length) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, 220);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txn.id]);

  return (
    <div className={cn('relative', compact ? 'pl-4' : 'pl-6')}>
      <div className="absolute left-[7px] top-1 bottom-1 w-px bg-gradient-to-b from-brand-500/40 via-white/10 to-transparent" />
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li
            key={i}
            className={cn(
              'relative transition-all duration-500',
              i < visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2',
            )}
          >
            <span
              className={cn(
                'absolute -left-[18px] top-1.5 h-3 w-3 rounded-full border-2 border-space-850',
                i === 0
                  ? 'bg-brand-400'
                  : i === steps.length - 1 && finalAction
                  ? 'bg-emerald-400'
                  : 'bg-brand-500',
              )}
            />
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs text-ink-400">{s.time}</span>
              <span className="text-sm font-medium text-ink-100">{s.label}</span>
            </div>
            {s.detail && <p className="text-xs text-ink-400">{s.detail}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
