import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { BarChart3, Clock, CreditCard, MapPin, Signal } from 'lucide-react';
import { useStore } from '@/lib/store';
import { levelFromScore } from '@/lib/riskEngine';
import { cn } from '@/lib/utils';

const riskColors = { SAFE: '#10B981', MEDIUM: '#F59E0B', HIGH: '#F97316', CRITICAL: '#EF4444' };

const tooltipStyle = {
  background: '#0B1026',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  fontSize: 12,
};

export default function Intelligence() {
  const transactions = useStore((s) => s.transactions);

  const byHour = useMemo(() => {
    const buckets = Array.from({ length: 24 }, (_, h) => ({ hour: h, avgRisk: 0, count: 0 }));
    transactions.forEach((t) => {
      buckets[t.transactionHour].avgRisk += t.riskScore;
      buckets[t.transactionHour].count++;
    });
    return buckets.map((b) => ({ hour: `${b.hour}:00`, avgRisk: b.count ? Math.round(b.avgRisk / b.count) : 0, count: b.count }));
  }, [transactions]);

  const byMethod = useMemo(() => {
    const map = new Map<string, { total: number; riskSum: number; count: number }>();
    transactions.forEach((t) => {
      const e = map.get(t.paymentMethod) ?? { total: 0, riskSum: 0, count: 0 };
      e.total++;
      e.riskSum += t.riskScore;
      e.count++;
      map.set(t.paymentMethod, e);
    });
    return Array.from(map.entries()).map(([method, v]) => ({
      method,
      avgRisk: Math.round(v.riskSum / v.count),
      count: v.total,
    }));
  }, [transactions]);

  const byAmount = useMemo(() => {
    return transactions.map((t) => ({
      amount: t.amount,
      risk: t.riskScore,
      level: t.riskLevel,
    }));
  }, [transactions]);

  const signalLibrary = useMemo(() => {
    const map = new Map<string, { count: number; total: number; max: number }>();
    transactions.forEach((t) => {
      t.signals?.forEach((s) => {
        const e = map.get(s.name) ?? { count: 0, total: 0, max: 0 };
        e.count++;
        e.total += s.contribution;
        e.max = Math.max(e.max, s.contribution);
        map.set(s.name, e);
      });
    });
    return Array.from(map.entries())
      .map(([name, v]) => ({
        name,
        frequency: v.count,
        avgContribution: Math.round((v.total / v.count) * 10) / 10,
        maxImpact: v.max,
      }))
      .sort((a, b) => b.avgContribution - a.avgContribution)
      .slice(0, 8);
  }, [transactions]);

  const regions = [
    { region: 'Mumbai', risk: 42, count: 4820 },
    { region: 'Delhi', risk: 58, count: 3910 },
    { region: 'Bengaluru', risk: 35, count: 5200 },
    { region: 'Hyderabad', risk: 49, count: 2640 },
    { region: 'Chennai', risk: 38, count: 2980 },
    { region: 'Kolkata', risk: 61, count: 1870 },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Fraud risk by hour */}
        <div className="card card-pad animate-fade-in">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-300" />
            <h3 className="section-title">Fraud Risk by Hour</h3>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byHour} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} interval={3} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="avgRisk" name="Avg Risk" stroke="#1A82F5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk by payment method */}
        <div className="card card-pad animate-fade-in" style={{ animationDelay: '60ms' }}>
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-brand-300" />
            <h3 className="section-title">Risk by Payment Method</h3>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byMethod} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="method" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="avgRisk" name="Avg Risk" radius={[6, 6, 0, 0]}>
                  {byMethod.map((d, i) => (
                    <Cell key={i} fill={d.avgRisk >= 60 ? '#EF4444' : d.avgRisk >= 40 ? '#F97316' : d.avgRisk >= 25 ? '#F59E0B' : '#10B981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Risk by amount scatter */}
      <div className="card card-pad animate-fade-in" style={{ animationDelay: '120ms' }}>
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand-300" />
          <h3 className="section-title">Risk by Transaction Amount</h3>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="amount" name="Amount" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} type="number" />
              <YAxis dataKey="risk" name="Risk" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} type="number" domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={byAmount}>
                {byAmount.map((d, i) => (
                  <Cell key={i} fill={riskColors[levelFromScore(d.risk)]} fillOpacity={0.6} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Top risk signals */}
        <div className="card card-pad animate-fade-in" style={{ animationDelay: '180ms' }}>
          <div className="mb-4 flex items-center gap-2">
            <Signal className="h-4 w-4 text-brand-300" />
            <h3 className="section-title">Top Risk Signals</h3>
          </div>
          <div className="space-y-2.5">
            {signalLibrary.map((s) => (
              <div key={s.name} className="rounded-xl border border-white/[0.06] bg-space-900/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink-100">{s.name}</span>
                  <span className="font-mono text-xs text-ink-400">×{s.frequency}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-500"
                    style={{ width: `${(s.avgContribution / 25) * 100}%` }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] text-ink-500">
                  <span>Avg contribution: +{s.avgContribution}</span>
                  <span>Max impact: +{s.maxImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic risk */}
        <div className="card card-pad animate-fade-in" style={{ animationDelay: '240ms' }}>
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand-300" />
            <h3 className="section-title">Geographic Risk</h3>
          </div>
          <p className="mb-3 text-xs text-ink-500">Abstract region cards — no real customer location data.</p>
          <div className="grid grid-cols-2 gap-3">
            {regions.map((r) => {
              const tone =
                r.risk >= 60 ? 'border-red-500/20 bg-red-500/[0.06]' :
                r.risk >= 45 ? 'border-orange-500/20 bg-orange-500/[0.06]' :
                r.risk >= 30 ? 'border-amber-500/20 bg-amber-500/[0.06]' :
                'border-emerald-500/20 bg-emerald-500/[0.06]';
              const color =
                r.risk >= 60 ? 'text-red-300' :
                r.risk >= 45 ? 'text-orange-300' :
                r.risk >= 30 ? 'text-amber-300' :
                'text-emerald-300';
              return (
                <div key={r.region} className={cn('rounded-xl border p-3.5', tone)}>
                  <p className="text-sm font-semibold text-ink-100">{r.region}</p>
                  <p className={cn('mt-1 font-mono text-2xl font-bold', color)}>{r.risk}</p>
                  <p className="mt-0.5 text-[11px] text-ink-400">{r.count.toLocaleString('en-IN')} txns</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
