import { useEffect, useState } from 'react';
import type { RiskLevel } from '@/types';
import { riskColor, riskGlow } from '@/lib/riskEngine';
import { cn } from '@/lib/utils';

export function RiskGauge({
  score,
  level,
  size = 220,
}: {
  score: number;
  level: RiskLevel;
  size?: number;
}) {
  const [display, setDisplay] = useState(0);
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  // 270deg arc (3/4 circle)
  const arc = 0.75;
  const dash = c * arc;
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const offset = dash * (1 - pct);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = display;
    const to = score;
    const dur = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const color = riskColor(level);
  const glow = riskGlow(level);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-[135deg]">
        <defs>
          <linearGradient id={`g-${level}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
        {/* progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#g-${level})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)',
            filter: `drop-shadow(0 0 8px ${glow})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono text-5xl font-bold tabular-nums"
          style={{ color, textShadow: `0 0 24px ${glow}` }}
        >
          {display}
        </span>
        <span className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-ink-300">
          Risk Score
        </span>
        <span
          className={cn(
            'mt-3 rounded-full border px-3 py-1 text-xs font-bold tracking-wider',
          )}
          style={{
            color,
            borderColor: `${color}55`,
            backgroundColor: `${color}14`,
          }}
        >
          {level} RISK
        </span>
      </div>
    </div>
  );
}
