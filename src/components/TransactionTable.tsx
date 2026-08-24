import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Transaction } from '@/types';
import { RiskBadge } from './RiskBadge';
import { DecisionBadge } from './DecisionBadge';
import { formatINR, formatTime, timeAgo, cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
  className?: string;
  render: (t: Transaction) => React.ReactNode;
  mobileHidden?: boolean;
}

const columns: Column[] = [
  {
    key: 'id',
    label: 'Transaction ID',
    render: (t) => (
      <span className="font-mono text-xs font-medium text-brand-300">{t.id}</span>
    ),
  },
  {
    key: 'amount',
    label: 'Amount',
    render: (t) => <span className="font-mono text-sm font-medium text-ink-50">{formatINR(t.amount)}</span>,
  },
  {
    key: 'customer',
    label: 'Customer',
    render: (t) => (
      <div className="flex flex-col">
        <span className="text-sm text-ink-100">{t.customerName ?? 'Customer'}</span>
        <span className="font-mono text-[11px] text-ink-400">{t.customerId}</span>
      </div>
    ),
    mobileHidden: true,
  },
  {
    key: 'riskScore',
    label: 'Risk Score',
    render: (t) => (
      <span
        className={cn(
          'font-mono text-sm font-semibold',
          t.riskLevel === 'CRITICAL'
            ? 'text-red-300'
            : t.riskLevel === 'HIGH'
            ? 'text-orange-300'
            : t.riskLevel === 'MEDIUM'
            ? 'text-amber-300'
            : 'text-emerald-300',
        )}
      >
        {t.riskScore}
      </span>
    ),
  },
  {
    key: 'riskLevel',
    label: 'Risk Level',
    render: (t) => <RiskBadge level={t.riskLevel} size="xs" />,
  },
  {
    key: 'decision',
    label: 'Decision',
    render: (t) => <DecisionBadge decision={t.decision} size="xs" />,
  },
  {
    key: 'method',
    label: 'Method',
    render: (t) => <span className="text-xs text-ink-300">{t.paymentMethod}</span>,
    mobileHidden: true,
  },
  {
    key: 'time',
    label: 'Time',
    render: (t) => <span className="text-xs text-ink-400">{timeAgo(t.createdAt)}</span>,
    mobileHidden: true,
  },
];

export function TransactionTable({ rows }: { rows: Transaction[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        <p className="text-sm font-medium text-ink-200">No transactions found</p>
        <p className="text-xs text-ink-400">Try adjusting your filters or search query.</p>
      </div>
    );
  }
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] text-left">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-400"
                >
                  {c.label}
                </th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr
                key={t.id}
                className="group border-b border-white/[0.04] transition-colors hover:bg-white/[0.025]"
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3">
                    {c.render(t)}
                  </td>
                ))}
                <td className="px-2">
                  <ChevronRight className="h-4 w-4 text-ink-500 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-300" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2 md:hidden">
        {rows.map((t) => (
          <Link
            key={t.id}
            to={`/transactions/${t.id}`}
            className="block rounded-xl border border-white/[0.06] bg-space-900/50 p-3.5 transition-colors hover:border-white/10"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-medium text-brand-300">{t.id}</span>
              <span className="font-mono text-sm font-semibold text-ink-50">{formatINR(t.amount)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <RiskBadge level={t.riskLevel} size="xs" />
                <DecisionBadge decision={t.decision} size="xs" />
              </div>
              <span className="text-[11px] text-ink-400">{timeAgo(t.createdAt)}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-[11px] text-ink-400">
              <span>{t.customerName ?? t.customerId}</span>
              <span>·</span>
              <span>{t.paymentMethod}</span>
              <span>·</span>
              <span className="font-mono">Score {t.riskScore}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
