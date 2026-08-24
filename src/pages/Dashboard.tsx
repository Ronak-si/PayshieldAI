import { Link } from 'react-router-dom';
import {
  Activity,
  ShieldAlert,
  IndianRupee,
  Target,
  Cpu,
  Clock,
  ArrowRight,
  Server,
} from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { RiskDonut, RiskDonutLegend } from '@/components/charts/RiskDonut';
import { RiskTrendChart, buildTrendData } from '@/components/charts/RiskTrend';
import { TransactionTable } from '@/components/TransactionTable';
import { useStore } from '@/lib/store';
import { formatINRShort } from '@/lib/utils';

export default function Dashboard() {
  const transactions = useStore((s) => s.transactions);
  const total = transactions.length;
  const highRisk = transactions.filter((t) => t.riskScore >= 70).length;
  const prevented = transactions
    .filter((t) => t.decision !== 'APPROVE')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Transactions Analyzed" value="24,821" icon={Activity} trend={{ value: '+12.4%', up: true }} accent="brand" footnote="Demo dataset" delay={0} />
        <MetricCard label="High-Risk Transactions" value="1,284" icon={ShieldAlert} trend={{ value: '+4.8%', up: true }} accent="high" footnote="Last 7 days" delay={60} />
        <MetricCard label="Potential Loss Prevented" value={formatINRShort(1870000)} icon={IndianRupee} accent="safe" footnote="Demo estimate" delay={120} />
        <MetricCard label="Model Precision" value="91.4%" icon={Target} accent="brand" footnote="Demo benchmark" delay={180} />
      </div>

      {/* System status */}
      <div className="card card-pad animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
              <Server className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-ink-50">PayShield Risk Engine</h3>
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Operational
                </span>
              </div>
              <p className="mt-0.5 text-xs text-ink-400">PayShield Fraud Model v1.0 · Prototype</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            <StatusItem label="Model" value="v1.0" />
            <StatusItem label="Last updated" value="2m ago" />
            <StatusItem label="Latency" value="142 ms" icon={Clock} />
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="card card-pad lg:col-span-2 animate-fade-in" style={{ animationDelay: '60ms' }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="section-title">Risk Distribution</h3>
            <span className="text-xs text-ink-400">Last 7 days</span>
          </div>
          <RiskDonut transactions={transactions} />
          <div className="mt-4">
            <RiskDonutLegend transactions={transactions} />
          </div>
        </div>
        <div className="card card-pad lg:col-span-3 animate-fade-in" style={{ animationDelay: '120ms' }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="section-title">Risk Trend</h3>
            <span className="text-xs text-ink-400">Last 7 days</span>
          </div>
          <RiskTrendChart data={buildTrendData(transactions)} />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="card animate-fade-in" style={{ animationDelay: '180ms' }}>
        <div className="flex items-center justify-between px-5 py-4 sm:px-6">
          <h3 className="section-title">Recent Transactions</h3>
          <Link to="/transactions" className="flex items-center gap-1 text-xs font-medium text-brand-300 hover:text-brand-200">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <TransactionTable rows={transactions.slice(0, 8)} />
      </div>
    </div>
  );
}

function StatusItem({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof Clock }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-ink-500">{label}</p>
      <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-ink-100">
        {Icon && <Icon className="h-3.5 w-3.5 text-ink-400" />}
        {value}
      </p>
    </div>
  );
}
