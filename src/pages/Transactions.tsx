import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { TransactionTable } from '@/components/TransactionTable';
import { RiskBadge } from '@/components/RiskBadge';
import { DecisionBadge } from '@/components/DecisionBadge';
import { useStore } from '@/lib/store';
import type { RiskLevel, Decision } from '@/types';
import { cn } from '@/lib/utils';

type SortKey = 'riskScore' | 'amount' | 'createdAt';
type SortDir = 'asc' | 'desc';

export default function Transactions() {
  const transactions = useStore((s) => s.transactions);
  const [search, setSearch] = useState('');
  const [risk, setRisk] = useState<RiskLevel | 'ALL'>('ALL');
  const [decision, setDecision] = useState<Decision | 'ALL'>('ALL');
  const [method, setMethod] = useState<string>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const methods = useMemo(() => Array.from(new Set(transactions.map((t) => t.paymentMethod))), [transactions]);

  const rows = useMemo(() => {
    let r = transactions.slice();
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((t) => t.id.toLowerCase().includes(q) || t.customerId.toLowerCase().includes(q) || (t.customerName?.toLowerCase().includes(q)));
    }
    if (risk !== 'ALL') r = r.filter((t) => t.riskLevel === risk);
    if (decision !== 'ALL') r = r.filter((t) => t.decision === decision);
    if (method !== 'ALL') r = r.filter((t) => t.paymentMethod === method);
    r.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'amount') cmp = a.amount - b.amount;
      else if (sortKey === 'riskScore') cmp = a.riskScore - b.riskScore;
      else cmp = +new Date(a.createdAt) - +new Date(b.createdAt);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return r;
  }, [transactions, search, risk, decision, method, sortKey, sortDir]);

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(k);
      setSortDir('desc');
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* Toolbar */}
      <div className="card card-pad animate-fade-in">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by transaction ID or customer…"
              className="input pl-9"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={cn('btn-ghost', showFilters && 'border-brand-500/40 bg-brand-500/10 text-brand-200')}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-fast">
            <FilterGroup label="Risk Level">
              <Pill active={risk === 'ALL'} onClick={() => setRisk('ALL')}>All</Pill>
              {(['SAFE', 'MEDIUM', 'HIGH', 'CRITICAL'] as RiskLevel[]).map((l) => (
                <Pill key={l} active={risk === l} onClick={() => setRisk(l)}>{l}</Pill>
              ))}
            </FilterGroup>
            <FilterGroup label="Decision">
              <Pill active={decision === 'ALL'} onClick={() => setDecision('ALL')}>All</Pill>
              {(['APPROVE', 'REVIEW', 'BLOCK'] as Decision[]).map((d) => (
                <Pill key={d} active={decision === d} onClick={() => setDecision(d)}>{d}</Pill>
              ))}
            </FilterGroup>
            <FilterGroup label="Payment Method">
              <Pill active={method === 'ALL'} onClick={() => setMethod('ALL')}>All</Pill>
              {methods.map((m) => (
                <Pill key={m} active={method === m} onClick={() => setMethod(m)}>{m}</Pill>
              ))}
            </FilterGroup>
            <FilterGroup label="Sort By">
              <SortBtn active={sortKey === 'riskScore'} onClick={() => toggleSort('riskScore')} dir={sortKey === 'riskScore' ? sortDir : undefined}>Risk</SortBtn>
              <SortBtn active={sortKey === 'amount'} onClick={() => toggleSort('amount')} dir={sortKey === 'amount' ? sortDir : undefined}>Amount</SortBtn>
              <SortBtn active={sortKey === 'createdAt'} onClick={() => toggleSort('createdAt')} dir={sortKey === 'createdAt' ? sortDir : undefined}>Date</SortBtn>
            </FilterGroup>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card animate-fade-in" style={{ animationDelay: '60ms' }}>
        <div className="flex items-center justify-between px-5 py-4 sm:px-6">
          <h3 className="section-title">
            Transactions <span className="ml-1 font-mono text-sm font-normal text-ink-400">{rows.length}</span>
          </h3>
          <div className="hidden items-center gap-2 sm:flex">
            {risk !== 'ALL' && <RiskBadge level={risk} size="xs" />}
            {decision !== 'ALL' && <DecisionBadge decision={decision} size="xs" />}
          </div>
        </div>
        <TransactionTable rows={rows} />
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-500">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-lg border px-2.5 py-1 text-xs font-medium transition',
        active ? 'border-brand-500/40 bg-brand-500/15 text-brand-200' : 'border-white/[0.08] bg-space-900/50 text-ink-300 hover:text-ink-100',
      )}
    >
      {children}
    </button>
  );
}

function SortBtn({ active, onClick, dir, children }: { active: boolean; onClick: () => void; dir?: SortDir; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition',
        active ? 'border-brand-500/40 bg-brand-500/15 text-brand-200' : 'border-white/[0.08] bg-space-900/50 text-ink-300 hover:text-ink-100',
      )}
    >
      <ArrowUpDown className="h-3 w-3" />
      {children}
      {dir && <span className="text-[9px]">{dir === 'asc' ? '↑' : '↓'}</span>}
    </button>
  );
}
