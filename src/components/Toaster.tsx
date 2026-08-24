import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const cfg = {
  success: { icon: CheckCircle2, color: 'text-emerald-300', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  info: { icon: Info, color: 'text-brand-300', border: 'border-brand-500/30', bg: 'bg-brand-500/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-300', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  error: { icon: XCircle, color: 'text-red-300', border: 'border-red-500/30', bg: 'bg-red-500/10' },
} as const;

export function Toaster() {
  const toasts = useStore((s) => s.toasts);
  const dismiss = useStore((s) => s.dismissToast);
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const c = cfg[t.variant];
        const Icon = c.icon;
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-xl border bg-space-850/95 p-3.5 shadow-card backdrop-blur-xl animate-scale-in',
              c.border,
            )}
          >
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', c.color)} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink-50">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs text-ink-300">{t.description}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded-md p-1 text-ink-400 transition hover:bg-white/5 hover:text-ink-100"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
