import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-space-850/60">
        <Compass className="h-7 w-7 text-brand-300" />
      </div>
      <p className="mt-5 font-mono text-5xl font-bold text-ink-50">404</p>
      <p className="mt-2 text-sm text-ink-300">This route drifted off the risk map.</p>
      <Link to="/dashboard" className="btn-primary mt-6">
        Return to Dashboard
      </Link>
    </div>
  );
}
