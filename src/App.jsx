import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { SyllabusProvider } from './context/SyllabusContext';

// Lazy Load Layout and Pages
const Layout = React.lazy(() => import('./components/layout/Layout'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Syllabus = React.lazy(() => import('./pages/Syllabus'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Revision = React.lazy(() => import('./pages/Revision'));

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
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="tracker" element={<Syllabus />} />
              <Route path="revision" element={<Revision />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SyllabusProvider>
  );
}

export default App;
