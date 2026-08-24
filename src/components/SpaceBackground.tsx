import { useMemo } from 'react';

interface Star {
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
}

export function SpaceBackground({ withGrid = true }: { withGrid?: boolean }) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 60 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() < 0.85 ? 1 : 2,
      delay: `${Math.random() * 4}s`,
      duration: `${3 + Math.random() * 4}s`,
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-space-950" />
      {/* radial blue glow top-left */}
      <div
        className="absolute -top-1/3 -left-1/4 h-[80vh] w-[80vh] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(26,130,245,0.18) 0%, rgba(26,130,245,0) 65%)',
        }}
      />
      {/* purple glow bottom-right */}
      <div
        className="absolute -bottom-1/3 -right-1/4 h-[70vh] w-[70vh] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.16) 0%, rgba(99,102,241,0) 65%)',
        }}
      />
      {/* faint center glow */}
      <div
        className="absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(34,211,238,0.10) 0%, rgba(34,211,238,0) 70%)',
        }}
      />
      {/* stars */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
              animationDuration: s.duration,
              opacity: 0.2,
            }}
          />
        ))}
      </div>
      {/* grid */}
      {withGrid && (
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage:
              'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          }}
        />
      )}
      {/* noise */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
