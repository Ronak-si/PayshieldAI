import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanSearch,
  Play,
  RotateCcw,
  ShieldCheck,
  Eye,
  Ban,
  Check,
  FileText,
  Sparkles,
  Info,
} from 'lucide-react';
import { RiskGauge } from '@/components/RiskGauge';
import { RiskSignalBar } from '@/components/RiskSignal';
import { DecisionBadge, decisionConfig } from '@/components/DecisionBadge';
import { AnalysisLoader } from '@/components/AnalysisLoader';
import { DecisionModal } from '@/components/DecisionModal';
import { AuditTimeline } from '@/components/AuditTimeline';
import { useStore } from '@/lib/store';
import { analyzeTransaction, MODEL_VERSION, withAnalysis } from '@/lib/riskEngine';
import { demoScenarios } from '@/lib/demoData';
import type { Decision, RiskAnalysis, Transaction } from '@/types';
import { cn, formatINR } from '@/lib/utils';

interface FormState {
  amount: string;
  accountAge: string;
  previousTransactions: string;
  paymentAttempts: string;
  deviceChanged: boolean;
  locationChanged: boolean;
  previousRefunds: string;
  timeSinceLastTransaction: string;
  historicalRisk: string;
  transactionHour: string;
  paymentMethod: string;
}

const emptyForm: FormState = {
  amount: '5000',
  accountAge: '120',
  previousTransactions: '20',
  paymentAttempts: '1',
  deviceChanged: false,
  locationChanged: false,
  previousRefunds: '0',
  timeSinceLastTransaction: '24',
  historicalRisk: '10',
  transactionHour: '14',
  paymentMethod: 'UPI',
};

export default function Analyze() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskAnalysis | null>(null);
  const [resultTxn, setResultTxn] = useState<Transaction | null>(null);
  const [modal, setModal] = useState<Decision | null>(null);
  const [finalAction, setFinalAction] = useState<string | undefined>(undefined);

  const addTransaction = useStore((s) => s.addTransaction);
  const setDecision = useStore((s) => s.setDecision);
  const pushToast = useStore((s) => s.pushToast);
  const thresholds = useStore((s) => s.settings.thresholds);

  function loadScenario(key: keyof typeof demoScenarios) {
    const s = demoScenarios[key].values;
    setForm({
      amount: String(s.amount),
      accountAge: String(s.accountAge),
      previousTransactions: String(s.previousTransactions),
      paymentAttempts: String(s.paymentAttempts),
      deviceChanged: Boolean(s.deviceChanged),
      locationChanged: Boolean(s.locationChanged),
      previousRefunds: String(s.previousRefunds),
      timeSinceLastTransaction: String(s.timeSinceLastTransaction),
      historicalRisk: String(s.historicalRisk),
      transactionHour: String(s.transactionHour),
      paymentMethod: String(s.paymentMethod),
    });
    setResult(null);
    setResultTxn(null);
    setFinalAction(undefined);
  }

  function runAnalysis() {
    setLoading(true);
    setResult(null);
    setResultTxn(null);
    setFinalAction(undefined);
  }

  function handleAnalysisDone() {
    const a = analyzeTransaction({
      amount: Number(form.amount) || 0,
      accountAge: Number(form.accountAge) || 0,
      previousTransactions: Number(form.previousTransactions) || 0,
      paymentAttempts: Number(form.paymentAttempts) || 1,
      deviceChanged: form.deviceChanged,
      locationChanged: form.locationChanged,
      previousRefunds: Number(form.previousRefunds) || 0,
      timeSinceLastTransaction: Number(form.timeSinceLastTransaction) || 0,
      historicalRisk: Number(form.historicalRisk) || 0,
      transactionHour: Number(form.transactionHour) || 12,
      paymentMethod: form.paymentMethod,
    });
    setResult(a);
    const id = `TXN-${92900 + Math.floor(Math.random() * 999)}`;
    const txn = withAnalysis({
      id,
      amount: Number(form.amount) || 0,
      currency: 'INR',
      customerId: `CUS-${1048 + Math.floor(Math.random() * 200)}`,
      accountAge: Number(form.accountAge) || 0,
      previousTransactions: Number(form.previousTransactions) || 0,
      paymentAttempts: Number(form.paymentAttempts) || 1,
      deviceChanged: form.deviceChanged,
      locationChanged: form.locationChanged,
      previousRefunds: Number(form.previousRefunds) || 0,
      timeSinceLastTransaction: Number(form.timeSinceLastTransaction) || 0,
      historicalRisk: Number(form.historicalRisk) || 0,
      paymentMethod: form.paymentMethod,
      transactionHour: Number(form.transactionHour) || 12,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      customerName: 'Demo Customer',
    });
    setResultTxn(txn);
    addTransaction(txn);
    setLoading(false);
    pushToast({
      variant: a.riskLevel === 'SAFE' ? 'success' : a.riskLevel === 'CRITICAL' ? 'error' : 'info',
      title: 'Analysis complete',
      description: `${id} · ${a.riskScore} ${a.riskLevel} · ${a.decision}`,
    });
  }

  function confirmDecision() {
    if (!modal || !resultTxn) return;
    setDecision(resultTxn.id, modal, 'Ronak Singh', `Analyst selected ${modal} from analyzer.`);
    setFinalAction(modal);
    setModal(null);
  }

  const maxContribution = result ? Math.max(...result.signals.map((s) => s.contribution), 25) : 25;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* Demo scenarios */}
      <div className="card card-pad animate-fade-in">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-300" />
          <h3 className="text-sm font-semibold text-ink-50">Load Demo Scenario</h3>
          <span className="text-xs text-ink-400">— populate the form instantly</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(demoScenarios) as (keyof typeof demoScenarios)[]).map((k) => {
            const s = demoScenarios[k];
            const tone =
              k === 'safe'
                ? 'border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/[0.06]'
                : k === 'suspicious'
                ? 'border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/[0.06]'
                : k === 'high'
                ? 'border-orange-500/20 hover:border-orange-500/40 hover:bg-orange-500/[0.06]'
                : 'border-red-500/20 hover:border-red-500/40 hover:bg-red-500/[0.06]';
            return (
              <button
                key={k}
                onClick={() => loadScenario(k)}
                className={cn(
                  'rounded-xl border bg-space-900/40 p-3 text-left transition-all hover:-translate-y-0.5',
                  tone,
                )}
              >
                <p className="text-sm font-semibold text-ink-50">{s.label}</p>
                <p className="mt-0.5 text-xs text-ink-400">{s.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Form */}
        <div className="card card-pad animate-fade-in" style={{ animationDelay: '60ms' }}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScanSearch className="h-4 w-4 text-brand-300" />
              <h3 className="text-sm font-semibold text-ink-50">Transaction Input</h3>
            </div>
            <button
              onClick={() => {
                setForm(emptyForm);
                setResult(null);
                setResultTxn(null);
                setFinalAction(undefined);
              }}
              className="flex items-center gap-1 text-xs text-ink-400 transition hover:text-ink-100"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Transaction Amount (₹)">
              <input className="input" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </Field>
            <Field label="Payment Method">
              <select className="input" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="Customer Account Age (days)">
              <input className="input" type="number" value={form.accountAge} onChange={(e) => setForm({ ...form, accountAge: e.target.value })} />
            </Field>
            <Field label="Previous Transaction Count">
              <input className="input" type="number" value={form.previousTransactions} onChange={(e) => setForm({ ...form, previousTransactions: e.target.value })} />
            </Field>
            <Field label="Payment Attempts">
              <input className="input" type="number" value={form.paymentAttempts} onChange={(e) => setForm({ ...form, paymentAttempts: e.target.value })} />
            </Field>
            <Field label="Previous Refund Count">
              <input className="input" type="number" value={form.previousRefunds} onChange={(e) => setForm({ ...form, previousRefunds: e.target.value })} />
            </Field>
            <Field label="Time Since Last Transaction (hrs)">
              <input className="input" type="number" step="0.01" value={form.timeSinceLastTransaction} onChange={(e) => setForm({ ...form, timeSinceLastTransaction: e.target.value })} />
            </Field>
            <Field label="Historical Risk Score (0–100)">
              <input className="input" type="number" value={form.historicalRisk} onChange={(e) => setForm({ ...form, historicalRisk: e.target.value })} />
            </Field>
            <Field label="Transaction Hour (0–23)">
              <input className="input" type="number" value={form.transactionHour} onChange={(e) => setForm({ ...form, transactionHour: e.target.value })} />
            </Field>
            <div className="flex items-end gap-3">
              <Toggle label="New Device" checked={form.deviceChanged} onChange={(v) => setForm({ ...form, deviceChanged: v })} />
              <Toggle label="Location Change" checked={form.locationChanged} onChange={(v) => setForm({ ...form, locationChanged: v })} />
            </div>
          </div>

          <button onClick={runAnalysis} disabled={loading} className="btn-primary mt-5 w-full">
            <Play className="h-4 w-4" />
            {loading ? 'Analyzing…' : 'Run Risk Analysis'}
          </button>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-500">
            <Info className="h-3 w-3" /> Prototype Risk Engine · thresholds: APPROVE &lt;{thresholds.approve} · REVIEW &lt;{thresholds.review} · BLOCK ≥{thresholds.block}
          </p>
        </div>

        {/* Result */}
        <div className="space-y-5">
          {loading ? (
            <AnalysisLoader onDone={handleAnalysisDone} />
          ) : result && resultTxn ? (
            <ResultPanel
              result={result}
              txn={resultTxn}
              maxContribution={maxContribution}
              finalAction={finalAction}
              onDecision={(d) => setModal(d)}
            />
          ) : (
            <div className="card card-pad flex h-full min-h-[400px] flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-space-900/50">
                <ScanSearch className="h-6 w-6 text-ink-500" />
              </div>
              <p className="mt-4 text-sm font-medium text-ink-200">No analysis yet</p>
              <p className="mt-1 max-w-xs text-xs text-ink-400">
                Fill the form or load a demo scenario, then run the risk analysis to see the result here.
              </p>
            </div>
          )}
        </div>
      </div>

      {modal && resultTxn && (
        <DecisionModal
          decision={modal}
          transactionId={resultTxn.id}
          onConfirm={confirmDecision}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex flex-1 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition',
        checked
          ? 'border-brand-500/40 bg-brand-500/10 text-brand-200'
          : 'border-white/[0.08] bg-space-900/60 text-ink-300 hover:border-white/15',
      )}
    >
      {label}
      <span className={cn('relative h-4 w-7 rounded-full transition', checked ? 'bg-brand-500' : 'bg-white/10')}>
        <span className={cn('absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all', checked ? 'left-3.5' : 'left-0.5')} />
      </span>
    </button>
  );
}

function ResultPanel({
  result,
  txn,
  maxContribution,
  finalAction,
  onDecision,
}: {
  result: RiskAnalysis;
  txn: Transaction;
  maxContribution: number;
  finalAction?: string;
  onDecision: (d: Decision) => void;
}) {
  const cfg = decisionConfig[result.decision];
  return (
    <>
      {/* Gauge + decision */}
      <div className="card card-pad animate-scale-in">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-8">
          <RiskGauge score={result.riskScore} level={result.riskLevel} size={180} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-wider text-ink-400">Recommended Action</p>
              <span className="rounded-full border border-white/[0.06] bg-space-900/60 px-2 py-0.5 text-[10px] text-ink-400">
                {MODEL_VERSION}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <cfg.icon className={cn('h-6 w-6', cfg.text)} />
              <h2 className={cn('text-2xl font-bold', cfg.text)}>{result.decision}</h2>
            </div>
            <p className="mt-2 text-sm text-ink-300">
              {result.decision === 'APPROVE' &&
                'No significant risk signals detected. The transaction can proceed automatically.'}
              {result.decision === 'REVIEW' &&
                'The transaction contains multiple independent risk signals. Manual verification is recommended before completing the payment.'}
              {result.decision === 'BLOCK' &&
                'The risk score exceeds the block threshold. The transaction should be blocked to prevent potential fraud loss.'}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-white/[0.06] bg-space-900/40 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-ink-500">Fraud Probability</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-ink-50">{result.fraudProbability}</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-space-900/40 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-ink-500">Confidence</p>
                <p className="mt-0.5 font-mono text-sm font-semibold text-ink-50">{result.confidence}</p>
              </div>
            </div>
          </div>
        </div>

        {finalAction ? (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] py-3 text-sm font-semibold text-emerald-300">
            <Check className="h-4 w-4" />
            Decision recorded: {finalAction}
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-3 gap-2">
            <button onClick={() => onDecision('APPROVE')} className={cn('btn border', decisionConfig.APPROVE.border, decisionConfig.APPROVE.bg, decisionConfig.APPROVE.text, decisionConfig.APPROVE.hover)}>
              <Check className="h-4 w-4" /> Approve
            </button>
            <button onClick={() => onDecision('REVIEW')} className={cn('btn border', decisionConfig.REVIEW.border, decisionConfig.REVIEW.bg, decisionConfig.REVIEW.text, decisionConfig.REVIEW.hover)}>
              <Eye className="h-4 w-4" /> Hold for Review
            </button>
            <button onClick={() => onDecision('BLOCK')} className={cn('btn border', decisionConfig.BLOCK.border, decisionConfig.BLOCK.bg, decisionConfig.BLOCK.text, decisionConfig.BLOCK.hover)}>
              <Ban className="h-4 w-4" /> Block
            </button>
          </div>
        )}
      </div>

      {/* Explainability */}
      <div className="card card-pad animate-fade-in" style={{ animationDelay: '80ms' }}>
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-brand-300" />
          <h3 className="text-sm font-semibold text-ink-50">Why was this transaction flagged?</h3>
        </div>
        {result.signals.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-sm text-emerald-200">
            <ShieldCheck className="h-5 w-5" />
            No risk signals detected. The transaction matches the customer's normal behaviour.
          </div>
        ) : (
          <div className="space-y-2.5">
            {result.signals.map((s, i) => (
              <div key={s.name} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <RiskSignalBar signal={s} max={maxContribution} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit timeline */}
      <div className="card card-pad animate-fade-in" style={{ animationDelay: '140ms' }}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand-300" />
            <h3 className="text-sm font-semibold text-ink-50">Audit Trail</h3>
          </div>
          <Link to="/audit" className="text-xs text-brand-300 hover:text-brand-200">View all →</Link>
        </div>
        <AuditTimeline txn={txn} finalAction={finalAction} />
        <div className="mt-4 flex items-center justify-between rounded-lg border border-white/[0.06] bg-space-900/40 p-3 text-xs">
          <span className="text-ink-400">Transaction</span>
          <Link to={`/transactions/${txn.id}`} className="font-mono text-brand-300 hover:text-brand-200">
            {txn.id} · {formatINR(txn.amount)} →
          </Link>
        </div>
      </div>
    </>
  );
}
