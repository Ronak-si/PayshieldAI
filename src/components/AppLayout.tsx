import { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { SpaceBackground } from './SpaceBackground';
import { Toaster } from './Toaster';

export function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <SpaceBackground />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="md:pl-[260px]">
        <TopBar onMenu={() => setOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-24">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/20 border-t-brand-400" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
