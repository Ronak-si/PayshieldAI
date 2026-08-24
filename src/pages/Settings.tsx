import { useState } from 'react';
import { Shield, Cpu, Bell, Palette, User, Save, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Thresholds } from '@/types';
import { cn } from '@/lib/utils';

export default function Settings() {
  const settings = useStore((s) => s.settings);
  const setThresholds = useStore((s) => s.setThresholds);
  const updateSettings = useStore((s) => s.updateSettings);
  const pushToast = useStore((s) => s.pushToast);

  const [thresholds, setLocalThresholds] = useState<Thresholds>(settings.thresholds);
  const [saved, setSaved] = useState(false);

  function save() {
    setThresholds(thresholds);
    setSaved(true);
    pushToast({ variant: 'success', title: 'Settings updated', description: 'Risk policy thresholds saved.' });
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Risk policy */}
      <div className="card card-pad animate-fade-in">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-brand-300" />
          <h3 className="section-title">Risk Policy</h3>
        </div>
        <p className="mb-4 text-xs text-ink-400">
          Configure the score boundaries that map a risk score to a recommended action.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <ThresholdField
            label="Approve Threshold"
            hint="Below this score → APPROVE"
            value={thresholds.approve}
            onChange={(v) => setLocalThresholds({ ...thresholds, approve: v })}
            color="emerald"
          />
          <ThresholdField
            label="Review Threshold"
            hint="Below this score → REVIEW"
            value={thresholds.review}
            onChange={(v) => setLocalThresholds({ ...thresholds, review: v })}
            color="amber"
          />
          <ThresholdField
            label="Block Threshold"
            hint="At/above this score → BLOCK"
            value={thresholds.block}
            onChange={(v) => setLocalThresholds({ ...thresholds, block: v })}
            color="red"
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={save} className="btn-primary">
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'Saved' : 'Save Policy'}
          </button>
          <span className="text-xs text-ink-400">Changes apply to all new analyses.</span>
        </div>
      </div>

      {/* Model */}
      <div className="card card-pad animate-fade-in" style={{ animationDelay: '60ms' }}>
        <div className="mb-4 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-brand-300" />
          <h3 className="section-title">Model</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Info label="Model Version" value="PayShield Fraud Model v1.0" />
          <Info label="Model Status" value="Operational" status />
          <Info label="Last Trained" value="Prototype" />
        </div>
      </div>

      {/* Notifications */}
      <div className="card card-pad animate-fade-in" style={{ animationDelay: '120ms' }}>
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-brand-300" />
          <h3 className="section-title">Notifications</h3>
        </div>
        <div className="space-y-3">
          <ToggleRow
            label="High-Risk Alerts"
            description="Notify when a transaction is flagged HIGH or CRITICAL."
            checked={settings.notifications.highRisk}
            onChange={(v) => updateSettings({ notifications: { ...settings.notifications, highRisk: v } })}
          />
          <ToggleRow
            label="Model Alerts"
            description="Notify on model drift, retraining, or latency issues."
            checked={settings.notifications.model}
            onChange={(v) => updateSettings({ notifications: { ...settings.notifications, model: v } })}
          />
          <ToggleRow
            label="System Alerts"
            description="Notify on engine availability and system events."
            checked={settings.notifications.system}
            onChange={(v) => updateSettings({ notifications: { ...settings.notifications, system: v } })}
          />
        </div>
      </div>

      {/* Appearance */}
      <div className="card card-pad animate-fade-in" style={{ animationDelay: '180ms' }}>
        <div className="mb-4 flex items-center gap-2">
          <Palette className="h-4 w-4 text-brand-300" />
          <h3 className="section-title">Appearance</h3>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => updateSettings({ appearance: 'dark' })}
            className={cn(
              'flex-1 rounded-xl border p-4 text-left transition',
              settings.appearance === 'dark'
                ? 'border-brand-500/40 bg-brand-500/10'
                : 'border-white/[0.08] bg-space-900/40 hover:border-white/15',
            )}
          >
            <div className="h-12 rounded-lg bg-gradient-to-br from-space-900 to-space-950" />
            <p className="mt-2 text-sm font-semibold text-ink-100">Dark</p>
            <p className="text-xs text-ink-400">Deep space command center</p>
          </button>
          <button
            onClick={() => updateSettings({ appearance: 'light' })}
            disabled
            className="flex-1 rounded-xl border border-white/[0.08] bg-space-900/40 p-4 text-left opacity-50"
          >
            <div className="h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200" />
            <p className="mt-2 text-sm font-semibold text-ink-100">Light</p>
            <p className="text-xs text-ink-400">Coming soon</p>
          </button>
        </div>
      </div>

      {/* Account */}
      <div className="card card-pad animate-fade-in" style={{ animationDelay: '240ms' }}>
        <div className="mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-brand-300" />
          <h3 className="section-title">Account</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-base font-bold text-white">
            RS
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-50">Ronak Singh</p>
            <p className="text-xs text-ink-400">Risk Analyst</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThresholdField({
  label,
  hint,
  value,
  onChange,
  color,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
  color: 'emerald' | 'amber' | 'red';
}) {
  const ring = { emerald: 'focus:border-emerald-500/50 focus:ring-emerald-500/15', amber: 'focus:border-amber-500/50 focus:ring-amber-500/15', red: 'focus:border-red-500/50 focus:ring-red-500/15' }[color];
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn('input', ring)}
      />
      <p className="mt-1.5 text-[11px] text-ink-500">{hint}</p>
    </div>
  );
}

function Info({ label, value, status }: { label: string; value: string; status?: boolean }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-space-900/40 p-3">
      <p className="text-[10px] uppercase tracking-wider text-ink-500">{label}</p>
      {status ? (
        <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {value}
        </p>
      ) : (
        <p className="mt-1 text-sm font-semibold text-ink-100">{value}</p>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-space-900/40 p-3.5">
      <div>
        <p className="text-sm font-medium text-ink-100">{label}</p>
        <p className="text-xs text-ink-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn('relative h-6 w-11 shrink-0 rounded-full transition', checked ? 'bg-brand-500' : 'bg-white/10')}
        aria-pressed={checked}
      >
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </button>
    </div>
  );
}
