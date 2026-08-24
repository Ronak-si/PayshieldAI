import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ size = 'md', withText = true }: { size?: 'sm' | 'md' | 'lg'; withText?: boolean }) {
  const box = { sm: 'h-8 w-8', md: 'h-9 w-9', lg: 'h-11 w-11' }[size];
  const icon = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' }[size];
  const text = { sm: 'text-sm', md: 'text-[15px]', lg: 'text-lg' }[size];
  return (
    <div className="flex items-center gap-2.5">
      <div className={cn('relative flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 shadow-glow-brand', box)}>
        <Shield className={cn('text-white', icon)} strokeWidth={2.5} />
      </div>
      {withText && (
        <div className="flex flex-col leading-none">
          <span className={cn('font-bold tracking-tight text-ink-50', text)}>
            PayShield <span className="text-brand-300">AI</span>
          </span>
          <span className="mt-0.5 text-[10px] font-medium text-ink-400">Risk Intelligence</span>
        </div>
      )}
    </div>
  );
}
