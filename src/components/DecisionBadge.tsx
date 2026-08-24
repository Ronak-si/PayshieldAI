import { Check, Eye, Ban } from 'lucide-react';
import type { Decision } from '@/types';
import { cn } from '@/lib/utils';

const map = {
  APPROVE: {
    icon: Check,
    cls: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
  label: 'APPROVE',
  label2: 'APPROVED',
  dot: 'bg-emerald-400',
  text: 'text-emerald-300',
  border: 'border-emerald-500/30',
  bg: 'bg-emerald-500/10',
  iconBg: 'bg-emerald-500/15 text-emerald-300',
  hover: 'hover:border-emerald-500/50 hover:bg-emerald-500/15',
  solid: 'bg-emerald-500 text-white hover:bg-emerald-400',
  ring: 'ring-emerald-500/40',
  glow: 'shadow-[0_0_24px_-4px_rgba(16,185,129,0.4)]',
  hex: '#10B981',
} as const,
  REVIEW: {
  icon: Eye,
  cls: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  label: 'REVIEW',
  label2: 'HELD FOR REVIEW',
  dot: 'bg-amber-400',
  text: 'text-amber-300',
  border: 'border-amber-500/30',
  bg: 'bg-amber-500/10',
  iconBg: 'bg-amber-500/15 text-amber-300',
  hover: 'hover:border-amber-500/50 hover:bg-amber-500/15',
  solid: 'bg-amber-500 text-white hover:bg-amber-400',
  ring: 'ring-amber-500/40',
  glow: 'shadow-[0_0_24px_-4px_rgba(245,158,11,0.4)]',
  hex: '#F59E0B',
} as const,
  BLOCK: {
    icon: Ban,
    cls: 'text-red-300 bg-red-500/10 border-red-500/30',
    label: 'BLOCK',
  label2: 'BLOCKED',
    dot: 'bg-red-400',
  text: 'text-red-300',
  border: 'border-red-500/30',
  bg: 'bg-red-500/10',
  iconBg: 'bg-red-500/15 text-red-300',
  hover: 'hover:border-red-500/50 hover:bg-red-500/15',
  solid: 'bg-red-500 text-white hover:bg-red-400',
  ring: 'ring-red-500/40',
  glow: 'shadow-[0_0_28px_-4px_rgba(239,68,68,0.45)]',
  hex: '#EF4444',
} as const,
} as const;

export function DecisionBadge({
  decision,
  past = false,
  size = 'sm',
}: {
  decision: Decision;
  past?: boolean;
  size?: 'xs' | 'sm' | 'md';
}) {
  const cfg = map[decision];
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
        cfg.cls,
        sizes[size],
      )}
    >
      <Icon className={cn(size === 'xs' ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
      {past ? cfg.label2 : cfg.label}
    </span>
  );
}

export const decisionConfig = map;
