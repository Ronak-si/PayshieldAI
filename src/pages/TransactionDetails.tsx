import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, User, Smartphone, Activity, Clock, Cpu, FileText } from 'lucide-react';
import { RiskBadge } from '@/components/RiskBadge';
import { DecisionBadge } from '@/components/DecisionBadge';
import { RiskGauge } from '@/components/RiskGauge';
import { RiskSignalBar } from '@/components/RiskSignal';
import { AuditTimeline } from '@/components/AuditTimeline';
import { useStore } from '@/lib/store';
import { formatINR, formatDateTime, cn } from '@/lib/utils';

export default function TransactionDetails() {
  const { id } = useParams();
  const transactions = useStore((s) => s.transactions);
  const txn = transactions.find((t) => t.id === id);

  if (!txn) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="card card-pad flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-semibold text-ink-100">Transaction not found</p>
          <p className="mt-1 text-xs text-ink-400">This transaction may have been removed or never existed.</p>
          <Link to="/transactions" className="btn-ghost mt-4">
            <ArrowLeft className="h-4 w-4" /> Back to transactions
          </Link>
        </div>
      </div>
    );
  }

  const maxContribution = txn.signals ? Math.max(...txn.signals.map((s) => s.contribution), 25) : 25;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <Link to="/transactions" className="inline-flex items-center gap-1.5 text-xs text-ink-400 transition hover:text-ink-100">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to transactions
      </Link>

      {/* Header */}
      <div className="card card-pad animate-fade-in">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-ink-50">{txn.id}</span>
              <RiskBadge level={txn.riskLevel} size="sm" />
              <DecisionBadge decision={txn.decision} size="sm" past />
            </div>
            <p className="mt-1.5 text-xs text-ink-400">
              {formatDateTime(txn.createdAt)} · {txn.modelVersion}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <RiskGauge score={txn.riskScore} level={txn.riskLevel} size={130} />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Amount" value={formatINR(txn.amount)} />
              <Info label="Probability" value={String(txn.fraudProbability ?? '—')} />
              <Info label="Status" value={txn.status} />
              <Info label="Method" value={txn.paymentMethod} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Info panels */}
        <div className="space-y-5 lg:col-span-2">
          <div className="grid gap-5 sm:grid-cols-2">
            <Panel icon={User} title="Customer Information">
              <Row label="Customer ID" value={txn.customerId} mono />
              <Row label="Name" value={txn.customerName ?? '—'} />
              <Row label="Account Age" value={`${txn.accountAge} days`} />
              <Row label="Previous Transactions" value={String(txn.previousTransactions)} />
              <Row label="Historical Risk" value={String(txn.historicalRisk)} />
            </Panel>
            <Panel icon={Smartphone} title="Device Information">
              <Row label="New Device" value={txn.deviceChanged ? 'Yes' : 'No'} />
              <Row label="Location Change" value={txn.locationChanged ? 'Yes' : 'No'} />
              <Row label="Payment Method" value={txn.paymentMethod} />
              <Row label="Payment Attempts" value={String(txn.paymentAttempts)} />
            </Panel>
            <Panel icon={Activity} title="Behavioral Information">
              <Row label="Previous Refunds" value={String(txn.previousRefunds)} />
              <Row label="Time Since Last Txn" value={`${txn.timeSinceLastTransaction} hrs`} />
              <Row label="Transaction Hour" value={`${txn.transactionHour}:00`} />
            </Panel>
            <Panel icon={Cpu} title="Model Information">
              <Row label="Model Version" value={txn.modelVersion} />
              <Row label="Risk Score" value={String(txn.riskScore)} mono />
              <Row label="Risk Level" value={txn.riskLevel} />
              <Row label="Decision" value={txn.decision} />
            </Panel>
          </div>

          {/* Risk factors */}
          <div className="card card-pad animate-fade-in" style={{ animationDelay: '60ms' }}>
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-300" />
              <h3 className="text-sm font-semibold text-ink-50">Risk Factors</h3>
            </div>
            {txn.signals && txn.signals.length > 0 ? (
              <div className="space-y-2.5">
                {txn.signals.map((s) => (
                  <RiskSignalBar key={s.name} signal={s} max={maxContribution} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-400">No risk signals detected for this transaction.</p>
            )}
          </div>
        </div>

        {/* Audit timeline */}
        <div className="space-y-5">
          <div className="card card-pad animate-fade-in" style={{ animationDelay: '120ms' }}>
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-300" />
              <h3 className="text-sm font-semibold text-ink-50">Audit Timeline</h3>
            </div>
            <AuditTimeline txn={txn} finalAction={txn.decision} compact />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-space-900/40 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-ink-500">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-semibold text-ink-50">{value}</p>
    </div>
  );
}

function Panel({ icon: Icon, title, children }: { icon: typeof User; title: string; children: React.ReactNode }) {
  return (
    <div className="card card-pad animate-fade-in">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-300" />
        <h3 className="text-sm font-semibold text-ink-50">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.04] py-1.5 last:border-0">
      <span className="text-xs text-ink-400">{label}</span>
      <span className={cn('text-xs font-medium text-ink-100', mono && 'font-mono')}>{value}</span>
    </div>
  );
}
