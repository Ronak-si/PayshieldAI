import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; up: boolean };
  accent?: 'brand' | 'safe' | 'medium' | 'high' | 'critical';
  footnote?: string;
  delay?: number;
}

const accents = {
  brand: 'text-brand-300 bg-brand-500/10 border-brand-500/20',
  safe: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  medium: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  high: 'text-orange-300 bg-orange-500/10 border-orange-500/20',
  critical: 'text-red-300 bg-red-500/10 border-red-500/20',
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = 'brand',
  footnote,
  delay = 0,
}: MetricCardProps) {
  return (
    <div
      className="card card-hover card-pad animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-ink-300">{label}</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-ink-50 sm:text-[28px]">{value}</p>
        </div>
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl border', accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {(trend || footnote) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold',
                trend.up ? 'text-emerald-300 bg-emerald-500/10' : 'text-red-300 bg-red-500/10',
              )}
            >
              {trend.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {trend.value}
            </span>
          )}
          {footnote && <span className="text-ink-400">{footnote}</span>}
        </div>
      )}
    </div>
  );
}
