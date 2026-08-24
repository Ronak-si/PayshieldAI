import { useEffect, useState } from 'react';
import { Loader2, ScanSearch, BrainCircuit, Gauge, ShieldCheck } from 'lucide-react';

const steps = [
  { label: 'Extracting features', icon: ScanSearch },
  { label: 'Evaluating risk signals', icon: Gauge },
  { label: 'Running model', icon: BrainCircuit },
  { label: 'Calculating decision', icon: ShieldCheck },
  { label: 'Generating explanation', icon: ShieldCheck },
];

export function AnalysisLoader({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= steps.length) {
      const t = setTimeout(onDone, 250);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((s) => s + 1), 420);
    return () => clearTimeout(t);
  }, [step, onDone]);

  return (
    <div className="card card-pad flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
        <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-transparent border-t-brand-400" />
        <Loader2 className="h-7 w-7 animate-spin text-brand-300" />
      </div>
      <p className="text-sm font-semibold text-ink-50">Running Risk Analysis</p>
      <p className="mt-1 text-xs text-ink-400">PayShield Fraud Model v1.0</p>
      <div className="mt-6 w-full max-w-xs space-y-2.5">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const active = i === step;
          return (
            <div
              key={i}
              className={
                'flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-all duration-300 ' +
                (done
                  ? 'border-emerald-500/20 bg-emerald-500/[0.06]'
                  : active
                  ? 'border-brand-500/30 bg-brand-500/[0.08]'
                  : 'border-white/[0.04] bg-space-900/40 opacity-50')
              }
            >
              <Icon
                className={
                  'h-4 w-4 ' + (done ? 'text-emerald-300' : active ? 'text-brand-300' : 'text-ink-500')
                }
              />
              <span
                className={
                  'text-xs font-medium ' + (done ? 'text-emerald-200' : active ? 'text-ink-100' : 'text-ink-500')
                }
              >
                {s.label}
              </span>
              {done && <span className="ml-auto text-[10px] font-semibold text-emerald-300">DONE</span>}
              {active && <Loader2 className="ml-auto h-3.5 w-3.5 animate-spin text-brand-300" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
