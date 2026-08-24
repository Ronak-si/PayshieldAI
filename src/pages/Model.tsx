import { useState } from 'react';
import { Target, Crosshair, Activity, TrendingUp, Percent, AlertTriangle, Info, CheckCircle2, Cpu } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { DEMO_METRICS, MODEL_COMPARISON, costOfBeingWrong, simulateThreshold, thresholdSeries } from '@/lib/modelMetrics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { cn, formatINR } from '@/lib/utils';

export default function Model() {
  const [avgLegit, setAvgLegit] = useState(2500);
  const [fpRate, setFpRate] = useState(0.062);
  const [avgFraudLoss, setAvgFraudLoss] = useState(15000);
  const [fnRate, setFnRate] = useState(0.113);
  const [threshold, setThreshold] = useState(70);

  const cost = costOfBeingWrong({
    avgLegitValue: avgLegit,
    fpRate,
    avgFraudLoss,
    fnRate,
    legitVolume: 18000,
    fraudVolume: 800,
  });

  const series = thresholdSeries({ avgLegitValue: avgLegit, avgFraudLoss });
  const point = simulateThreshold(threshold, { avgLegitValue: avgLegit, avgFraudLoss });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Precision" value={`${(DEMO_METRICS.precision * 100).toFixed(1)}%`} icon={Target} accent="brand" footnote="Demo" delay={0} />
        <MetricCard label="Recall" value={`${(DEMO_METRICS.recall * 100).toFixed(1)}%`} icon={Crosshair} accent="safe" footnote="Demo" delay={40} />
        <MetricCard label="F1 Score" value={DEMO_METRICS.f1.toFixed(3)} icon={Activity} accent="brand" footnote="Demo" delay={80} />
        <MetricCard label="ROC-AUC" value={DEMO_METRICS.rocAuc.toFixed(3)} icon={TrendingUp} accent="brand" footnote="Demo" delay={120} />
        <MetricCard label="Accuracy" value={`${(DEMO_METRICS.accuracy * 100).toFixed(1)}%`} icon={Percent} accent="safe" footnote="Demo" delay={160} />
        <MetricCard label="False Positive Rate" value={`${(DEMO_METRICS.falsePositiveRate * 100).toFixed(1)}%`} icon={AlertTriangle} accent="high" footnote="Demo" delay={200} />
      </div>
      <p className="flex items-center gap-1.5 text-xs text-ink-500">
        <Info className="h-3.5 w-3.5" /> Demo benchmark values on a prototype dataset. Replace with held-out test-set metrics once a model is trained.
      </p>

      {/* Confusion matrix + explanations */}
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="card card-pad lg:col-span-3 animate-fade-in">
          <h3 className="section-title mb-4">Confusion Matrix</h3>
          <ConfusionMatrix />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <div className="card card-pad animate-fade-in" style={{ animationDelay: '60ms' }}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-300" />
              <h4 className="text-sm font-semibold text-ink-50">False Positive</h4>
            </div>
            <p className="mt-2 text-xs text-ink-400">
              A legitimate transaction incorrectly flagged as risky. Creates customer friction and lost revenue.
            </p>
          </div>
          <div className="card card-pad animate-fade-in" style={{ animationDelay: '120ms' }}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-300" />
              <h4 className="text-sm font-semibold text-ink-50">False Negative</h4>
            </div>
            <p className="mt-2 text-xs text-ink-400">
              A fraudulent transaction incorrectly classified as safe. Results in direct financial loss.
            </p>
          </div>
        </div>
      </div>

      {/* Cost of being wrong */}
      <div className="card card-pad animate-fade-in">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-300" />
          <h3 className="section-title">Cost of Being Wrong</h3>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <NumField label="Avg Legit Transaction Value (₹)" value={avgLegit} onChange={setAvgLegit} />
            <NumField label="False Positive Rate" value={fpRate} onChange={setFpRate} step={0.001} />
            <NumField label="Avg Fraud Loss (₹)" value={avgFraudLoss} onChange={setAvgFraudLoss} />
            <NumField label="False Negative Rate" value={fnRate} onChange={setFnRate} step={0.001} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.06] p-4">
              <p className="text-[10px] uppercase tracking-wider text-orange-300">Estimated FP Cost</p>
              <p className="mt-1 font-mono text-2xl font-bold text-orange-300">{formatINR(cost.fpCost)}</p>
              <p className="mt-1 text-[11px] text-ink-400">Customer friction + review cost</p>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">
              <p className="text-[10px] uppercase tracking-wider text-red-300">Estimated FN Cost</p>
              <p className="mt-1 font-mono text-2xl font-bold text-red-300">{formatINR(cost.fnCost)}</p>
              <p className="mt-1 text-[11px] text-ink-400">Direct fraud loss</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs text-ink-400">
          Threshold selection should balance customer friction against expected fraud loss.
        </p>
      </div>

      {/* Threshold simulator */}
      <div className="card card-pad animate-fade-in">
        <div className="mb-1 flex items-center gap-2">
          <Activity className="h-4 w-4 text-brand-300" />
          <h3 className="section-title">Decision Threshold Simulator</h3>
        </div>
        <p className="mb-5 text-xs text-ink-400">
          Move the threshold to explore the trade-off between fraud prevention and legitimate customer friction.
        </p>
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-400">Risk Threshold</span>
            <span className="font-mono text-lg font-bold text-brand-300">{threshold}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="mt-2 w-full accent-brand-500"
          />
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="threshold" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#0B1026', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" iconSize={8} />
              <ReferenceLine x={threshold} stroke="#1A82F5" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="precision" name="Precision" stroke="#1A82F5" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="recall" name="Recall" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="falsePositives" name="False Positives" stroke="#F59E0B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="falseNegatives" name="False Negatives" stroke="#EF4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <SimStat label="Precision" value={point.precision.toFixed(3)} color="text-brand-300" />
          <SimStat label="Recall" value={point.recall.toFixed(3)} color="text-emerald-300" />
          <SimStat label="False Positives" value={String(point.falsePositives)} color="text-amber-300" />
          <SimStat label="False Negatives" value={String(point.falseNegatives)} color="text-red-300" />
          <SimStat label="Est. Loss" value={formatINR(point.estimatedLoss)} color="text-orange-300" />
          <SimStat label="Friction" value={`${point.customerFriction}%`} color="text-ink-200" />
        </div>
      </div>

      {/* Model comparison */}
      <div className="card animate-fade-in">
        <div className="flex items-center gap-2 px-5 py-4 sm:px-6">
          <Cpu className="h-4 w-4 text-brand-300" />
          <h3 className="section-title">Model Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06] text-left">
                {['Model', 'Precision', 'Recall', 'F1', 'ROC-AUC', 'Latency', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODEL_COMPARISON.map((m) => (
                <tr key={m.name} className={cn('border-b border-white/[0.04]', m.selected && 'bg-brand-500/[0.06]')}>
                  <td className="px-4 py-3 text-sm font-medium text-ink-100">{m.name}</td>
                  <td className="px-4 py-3 font-mono text-sm text-ink-200">{m.precision.toFixed(3)}</td>
                  <td className="px-4 py-3 font-mono text-sm text-ink-200">{m.recall.toFixed(3)}</td>
                  <td className="px-4 py-3 font-mono text-sm text-ink-200">{m.f1.toFixed(3)}</td>
                  <td className="px-4 py-3 font-mono text-sm text-ink-200">{m.rocAuc.toFixed(3)}</td>
                  <td className="px-4 py-3 font-mono text-sm text-ink-200">{m.latency}ms</td>
                  <td className="px-4 py-3">
                    {m.selected ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-[11px] font-semibold text-brand-200">
                        <CheckCircle2 className="h-3 w-3" /> Selected
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/[0.06] px-5 py-3 sm:px-6">
          <p className="text-xs text-ink-400">
            <span className="font-semibold text-ink-200">Selected:</span> {MODEL_COMPARISON.find((m) => m.selected)?.note}
          </p>
        </div>
      </div>
    </div>
  );
}

function NumField({ label, value, onChange, step }: { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="number"
        step={step ?? 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="input"
      />
    </div>
  );
}

function SimStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-space-900/40 p-2.5">
      <p className="text-[10px] uppercase tracking-wider text-ink-500">{label}</p>
      <p className={cn('mt-0.5 font-mono text-sm font-semibold', color)}>{value}</p>
    </div>
  );
}

function ConfusionMatrix() {
  const m = DEMO_METRICS;
  return (
    <div className="grid grid-cols-[auto_1fr_1fr] gap-2">
      <div />
      <div className="rounded-lg border border-white/[0.06] bg-space-900/40 p-2 text-center text-xs font-semibold text-ink-300">Predicted Legit</div>
      <div className="rounded-lg border border-white/[0.06] bg-space-900/40 p-2 text-center text-xs font-semibold text-ink-300">Predicted Fraud</div>
      <div className="flex items-center justify-end rounded-lg border border-white/[0.06] bg-space-900/40 p-2 text-xs font-semibold text-ink-300">Actual Legit</div>
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-center">
        <p className="text-[10px] uppercase tracking-wider text-emerald-300">True Negative</p>
        <p className="mt-1 font-mono text-2xl font-bold text-emerald-300">{m.trueNegative.toLocaleString('en-IN')}</p>
      </div>
      <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.06] p-4 text-center">
        <p className="text-[10px] uppercase tracking-wider text-orange-300">False Positive</p>
        <p className="mt-1 font-mono text-2xl font-bold text-orange-300">{m.falsePositive.toLocaleString('en-IN')}</p>
      </div>
      <div className="flex items-center justify-end rounded-lg border border-white/[0.06] bg-space-900/40 p-2 text-xs font-semibold text-ink-300">Actual Fraud</div>
      <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4 text-center">
        <p className="text-[10px] uppercase tracking-wider text-red-300">False Negative</p>
        <p className="mt-1 font-mono text-2xl font-bold text-red-300">{m.falseNegative.toLocaleString('en-IN')}</p>
      </div>
      <div className="rounded-xl border border-brand-500/20 bg-brand-500/[0.06] p-4 text-center">
        <p className="text-[10px] uppercase tracking-wider text-brand-300">True Positive</p>
        <p className="mt-1 font-mono text-2xl font-bold text-brand-300">{m.truePositive.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
}
