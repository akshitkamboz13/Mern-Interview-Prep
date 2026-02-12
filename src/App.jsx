import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { SyllabusProvider } from './context/SyllabusContext';

import RouteTracker from './components/common/RouteTracker';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy Load Layout and Pages
const Layout = React.lazy(() => import('./components/layout/Layout'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Syllabus = React.lazy(() => import('./pages/Syllabus'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Revision = React.lazy(() => import('./pages/Revision'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
import PrivacyPolicy from './pages/PrivacyPolicy';

const LoadingFallback = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400">
    <Loader2 className="w-10 h-10 mb-4 animate-spin text-indigo-500" />
    <p className="text-sm font-medium">Loading App...</p>
  </div>
);

function App() {
  return (
    <SyllabusProvider>
      <BrowserRouter>
        <RouteTracker />
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="syllabus" element={<Syllabus />} />
                <Route path="revision" element={<Revision />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </SyllabusProvider>
  );
}

export default App;
