import { ShieldCheck, ShieldAlert, Shield, ShieldX } from 'lucide-react';
import type { RiskLevel } from '@/types';
import { cn } from '@/lib/utils';

const map = {
  SAFE: {
    icon: ShieldCheck,
    color: 'text-risk-safe',
    bg: 'bg-risk-safe/10 border-risk-safe/30',
    dot: 'bg-risk-safe',
    label: 'SAFE',
  },
  MEDIUM: {
    icon: Shield,
    color: 'text-risk-medium',
    bg: 'bg-risk-medium/10 border-risk-medium/30',
    dot: 'bg-risk-medium',
    label: 'MEDIUM',
  },
  HIGH: {
    icon: ShieldAlert,
    color: 'text-risk-high',
    bg: 'bg-risk-high/10 border-risk-high/30',
    dot: 'bg-risk-high',
    label: 'HIGH',
  },
  CRITICAL: {
    icon: ShieldX,
    color: 'text-risk-critical',
    bg: 'bg-risk-critical/10 border-risk-critical/30',
    dot: 'bg-risk-critical',
    label: 'CRITICAL',
  },
} as const;

export function RiskBadge({
  level,
  size = 'sm',
  showIcon = true,
}: {
  level: RiskLevel;
  size?: 'xs' | 'sm' | 'md';
  showIcon?: boolean;
}) {
  const cfg = map[level];
  const Icon = cfg.icon;
  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 gap-1',
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold tracking-wide',
        cfg.bg,
        cfg.color,
        sizes[size],
      )}
    >
      {showIcon && <Icon className={cn(size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />}
      {cfg.label}
    </span>
  );
}

export function RiskDot({ level }: { level: RiskLevel }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn('h-2 w-2 rounded-full', map[level].dot)} />
      <span className={cn('text-xs font-semibold', map[level].color)}>{map[level].label}</span>
    </span>
  );
}
