import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Transaction } from '@/types';
import { levelFromScore } from '@/lib/riskEngine';

const colors: Record<string, string> = {
  SAFE: '#10B981',
  MEDIUM: '#F59E0B',
  HIGH: '#F97316',
  CRITICAL: '#EF4444',
};

export function RiskDonut({ transactions }: { transactions: Transaction[] }) {
  const counts = { SAFE: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 } as Record<string, number>;
  transactions.forEach((t) => {
    counts[levelFromScore(t.riskScore)]++;
  });
  const total = transactions.length || 1;
  const data = (Object.keys(counts) as (keyof typeof counts)[]).map((k) => ({
    name: k,
    value: counts[k],
    pct: ((counts[k] / total) * 100).toFixed(1),
    color: colors[k],
  }));

  return (
    <div className="relative h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={88}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#0B1026',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(value) => {
              const p = data.find((d) => d.value === value);
              return [`${value} (${p?.pct ?? 0}%)`, p?.name ?? ''];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-bold text-ink-50">{total}</span>
        <span className="text-[10px] uppercase tracking-wider text-ink-400">Total</span>
      </div>
    </div>
  );
}

export function RiskDonutLegend({ transactions }: { transactions: Transaction[] }) {
  const counts = { SAFE: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 } as Record<string, number>;
  transactions.forEach((t) => counts[levelFromScore(t.riskScore)]++);
  const total = transactions.length || 1;
  return (
    <div className="grid grid-cols-2 gap-2">
      {(Object.keys(counts) as (keyof typeof counts)[]).map((k) => (
        <div key={k} className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-space-900/40 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[k] }} />
            <span className="text-xs font-medium text-ink-200">{k}</span>
          </div>
          <span className="font-mono text-xs text-ink-400">
            {counts[k]} · {((counts[k] / total) * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
}
