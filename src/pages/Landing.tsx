import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  ScanSearch,
  BrainCircuit,
  Gauge,
  Activity,
  CheckCircle2,
  Eye,
  Ban,
  Lock,
  Zap,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { RiskBadge } from '@/components/RiskBadge';
import { DecisionBadge } from '@/components/DecisionBadge';

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-space-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <div className="hidden items-center gap-7 md:flex">
            <a href="#how" className="text-sm text-ink-300 transition hover:text-ink-50">How it works</a>
            <a href="#value" className="text-sm text-ink-300 transition hover:text-ink-50">Features</a>
            <a href="#metrics" className="text-sm text-ink-300 transition hover:text-ink-50">Benchmarks</a>
            <Link to="/dashboard" className="text-sm text-ink-300 transition hover:text-ink-50">Dashboard</Link>
          </div>
          <Link to="/dashboard" className="btn-primary">
            Launch Console
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/[0.06] px-3 py-1.5 text-xs font-medium text-brand-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-400" />
              </span>
              Explainable Payment Risk Intelligence
            </div>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-ink-50 sm:text-5xl lg:text-6xl">
              See risk before{' '}
              <span className="bg-gradient-to-r from-brand-300 via-cyan-300 to-brand-400 bg-clip-text text-transparent">
                it becomes loss.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-ink-300 sm:text-lg">
              PayShield AI gives merchants an explainable, data-driven risk layer for payment fraud —
              predicting risk, explaining the signals, and recommending the safest action before money is lost.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to="/dashboard" className="btn-primary text-base">
                Launch Risk Console
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/analyze" className="btn-ghost text-base">
                <ScanSearch className="h-4 w-4" />
                View Demo
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-5 text-xs text-ink-400">
              <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> No real card data</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> 142ms latency</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Audit-ready</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative animate-scale-in">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Trust metrics */}
      <section id="metrics" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat value="24,821+" label="Transactions analyzed" />
          <Stat value="91.4%" label="Precision" />
          <Stat value="88.7%" label="Recall" />
          <Stat value="94.2%" label="ROC-AUC" />
        </div>
        <p className="mt-4 text-center text-xs text-ink-500">
          Demo benchmark values on a prototype dataset. Not measured from a deployed model.
        </p>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="card card-pad">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 className="text-2xl font-bold text-ink-50 sm:text-3xl">Fraud is not a binary decision.</h2>
              <p className="mt-4 text-ink-300">
                A transaction can look completely normal while containing multiple weak risk signals.
                Traditional rule systems often struggle to combine these signals intelligently —
                PayShield combines them into a single explainable risk assessment.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: AlertTriangle, label: 'New customer', detail: 'No behavioural history' },
                { icon: TrendingUp, label: 'Unusual amount', detail: '6× typical value' },
                { icon: Activity, label: 'New device', detail: 'Unrecognised fingerprint' },
                { icon: Zap, label: 'Rapid attempts', detail: '4 tries in 90s' },
                { icon: Eye, label: 'Location anomaly', detail: 'Different region' },
                { icon: Ban, label: 'Refund history', detail: 'Prior chargebacks' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/[0.06] bg-space-900/50 p-3">
                  <s.icon className="h-4 w-4 text-brand-300" />
                  <p className="mt-2 text-sm font-medium text-ink-100">{s.label}</p>
                  <p className="text-xs text-ink-400">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-ink-50 sm:text-3xl">How it works</h2>
          <p className="mt-2 text-ink-300">A four-stage pipeline from capture to decision.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { n: '01', title: 'Capture', desc: 'Transaction and behavioural signals', icon: ScanSearch },
            { n: '02', title: 'Analyze', desc: 'ML risk model evaluates the transaction', icon: BrainCircuit },
            { n: '03', title: 'Explain', desc: 'Risk factors are surfaced and ranked', icon: Activity },
            { n: '04', title: 'Act', desc: 'Approve / Review / Block', icon: Shield },
          ].map((s, i) => (
            <div key={s.n} className="relative card card-hover card-pad animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="font-mono text-xs font-semibold text-brand-400">{s.n}</span>
              <s.icon className="mt-3 h-6 w-6 text-brand-300" />
              <h3 className="mt-3 text-base font-semibold text-ink-50">{s.title}</h3>
              <p className="mt-1 text-sm text-ink-400">{s.desc}</p>
              {i < 3 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-ink-600 md:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Core value */}
      <section id="value" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-ink-50 sm:text-3xl">Predict. Explain. Act. Measure.</h2>
          <p className="mt-2 text-ink-300">Four capabilities, one risk layer.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BrainCircuit, title: 'Predict', desc: 'Estimate the probability of payment fraud for every transaction.' },
            { icon: Activity, title: 'Explain', desc: 'Understand exactly which signals influenced the decision.' },
            { icon: Shield, title: 'Act', desc: 'Recommend approve, review or block — with configurable thresholds.' },
            { icon: Gauge, title: 'Measure', desc: 'Track precision, recall, false positives and model performance.' },
          ].map((c, i) => (
            <div key={c.title} className="card card-hover card-pad animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10">
                <c.icon className="h-5 w-5 text-brand-300" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink-50">{c.title}</h3>
              <p className="mt-1.5 text-sm text-ink-400">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-space-850 to-space-900 p-10 text-center sm:p-16">
          <div
            className="absolute -top-1/2 left-1/2 h-[80%] w-[80%] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(26,130,245,0.25) 0%, transparent 70%)' }}
          />
          <div className="relative">
            <h2 className="text-balance text-3xl font-bold text-ink-50 sm:text-4xl">
              Don't wait for fraud to become loss.
            </h2>
            <p className="mt-3 text-lg text-ink-300">Predict. Explain. Decide.</p>
            <Link to="/dashboard" className="btn-primary mt-7 text-base">
              Launch PayShield AI
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-space-950/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <Logo />
              <p className="mt-3 max-w-xs text-sm text-ink-400">
                Explainable Payment Risk Intelligence.
              </p>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">Product</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {['Dashboard', 'Analyze', 'Model', 'Intelligence', 'Audit', 'Settings'].map((l) => (
                  <Link key={l} to={`/${l.toLowerCase()}`} className="text-ink-300 transition hover:text-ink-50">
                    {l}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-400">Status</p>
              <div className="flex items-center gap-2 text-sm text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Risk Engine Online
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-white/[0.06] pt-6">
            <p className="text-xs leading-relaxed text-ink-500">
              PayShield AI is a prototype risk-assessment system for demonstration purposes.
              Risk scores are probabilistic and should not be treated as guaranteed fraud determinations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card card-pad text-center">
      <p className="font-mono text-3xl font-bold text-ink-50 sm:text-4xl">{value}</p>
      <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-ink-400">{label}</p>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      {/* animated data lines */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px w-full opacity-30"
            style={{
              top: `${10 + i * 11}%`,
              background: 'linear-gradient(90deg, transparent, rgba(26,130,245,0.5), transparent)',
              animation: `fade-in ${2 + i * 0.2}s ease-out infinite alternate`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
      <div className="card overflow-hidden p-6 shadow-glow-brand">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-ink-50">Risk Console</span>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            LIVE
          </span>
        </div>

        <div className="mt-5 rounded-2xl border border-white/[0.06] bg-space-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-400">Transaction</span>
            <span className="font-mono text-xs text-ink-500">TXN-92831</span>
          </div>
          <p className="mt-1 font-mono text-3xl font-bold text-ink-50">₹8,999</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-ink-400">
            <span>CUS-1048</span>
            <span>·</span>
            <span>Credit Card</span>
            <span>·</span>
            <span>23:14</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/[0.08] p-4">
            <p className="text-[10px] uppercase tracking-wider text-orange-300">Risk</p>
            <p className="mt-1 font-mono text-3xl font-bold text-orange-300">91%</p>
            <div className="mt-2"><RiskBadge level="HIGH" size="xs" /></div>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.08] p-4">
            <p className="text-[10px] uppercase tracking-wider text-amber-300">Decision</p>
            <p className="mt-1 text-lg font-bold text-amber-300">MANUAL REVIEW</p>
            <div className="mt-2"><DecisionBadge decision="REVIEW" size="xs" /></div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {[
            { label: 'New customer', val: 18 },
            { label: 'Multiple payment attempts', val: 20 },
            { label: 'New device', val: 15 },
            { label: 'Unusual amount', val: 17 },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="w-44 shrink-0 text-xs text-ink-300">{s.label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                  style={{ width: `${s.val * 4}%` }}
                />
              </div>
              <span className="font-mono text-xs text-orange-300">+{s.val}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.06] bg-space-900/40 p-3">
          <div className="flex items-center gap-2 text-xs text-ink-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Audit trail recorded
          </div>
          <span className="font-mono text-[11px] text-ink-500">14:32:14</span>
        </div>
      </div>
    </div>
  );
}
