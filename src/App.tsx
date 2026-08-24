import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { SpaceBackground } from '@/components/SpaceBackground';
import { Toaster } from '@/components/Toaster';

const Landing = lazy(() => import('@/pages/Landing'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Analyze = lazy(() => import('@/pages/Analyze'));
const Transactions = lazy(() => import('@/pages/Transactions'));
const TransactionDetails = lazy(() => import('@/pages/TransactionDetails'));
const Model = lazy(() => import('@/pages/Model'));
const Intelligence = lazy(() => import('@/pages/Intelligence'));
const Audit = lazy(() => import('@/pages/Audit'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/20 border-t-brand-400" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SpaceBackground />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/:id" element={<TransactionDetails />} />
            <Route path="/model" element={<Model />} />
            <Route path="/intelligence" element={<Intelligence />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </BrowserRouter>
  );
}
