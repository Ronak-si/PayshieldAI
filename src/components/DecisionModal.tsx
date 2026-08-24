import type { Decision } from '@/types';
import { AlertTriangle, Check, Eye, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

const cfg = {
  APPROVE: {
    icon: Check,
    title: 'Approve Transaction?',
    color: 'text-emerald-300',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    btn: 'bg-emerald-500 hover:bg-emerald-400 text-white',
  },
  REVIEW: {
    icon: Eye,
    title: 'Hold Transaction for Review?',
    color: 'text-amber-300',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    btn: 'bg-amber-500 hover:bg-amber-400 text-white',
  },
  BLOCK: {
    icon: Ban,
    title: 'Block Transaction?',
    color: 'text-red-300',
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    btn: 'bg-red-500 hover:bg-red-400 text-white',
  },
} as const;

export function DecisionModal({
  decision,
  transactionId,
  onConfirm,
  onCancel,
}: {
  decision: Decision;
  transactionId: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const c = cfg[decision];
  const Icon = c.icon;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in-fast" onClick={onCancel} />
      <div className={cn('relative w-full max-w-md rounded-2xl border bg-space-850/95 p-6 shadow-card backdrop-blur-xl animate-scale-in', c.border)}>
        <div className="flex items-start gap-3">
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl border', c.bg, c.border)}>
            <AlertTriangle className={cn('h-5 w-5', c.color)} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-ink-50">{c.title}</h3>
            <p className="mt-1 text-sm text-ink-300">
              This action will be recorded in the audit trail for{' '}
              <span className="font-mono text-brand-300">{transactionId}</span>.
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-white/[0.06] bg-space-900/50 p-3">
          <p className="text-xs text-ink-400">
            {decision === 'APPROVE' && 'The transaction will be released for completion.'}
            {decision === 'REVIEW' && 'The transaction will be held pending manual verification.'}
            {decision === 'BLOCK' && 'The transaction will be blocked and the customer notified.'}
          </p>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
          <button onClick={onConfirm} className={cn('btn', c.btn)}>
            <Icon className="h-4 w-4" />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
