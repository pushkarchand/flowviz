import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.default })));
import { ThemeContextProvider } from './contexts/ThemeContext';
import { PageShell } from './components/shared/PageShell';

// JS Pages
const EventLoopPage = lazy(() => import('./pages/js/EventLoopPage').then(m => ({ default: m.EventLoopPage })));

// CSS Pages
const FlexboxPage = lazy(() => import('./pages/css/FlexboxPage').then(m => ({ default: m.FlexboxPage })));
const GridPage = lazy(() => import('./pages/css/GridPage').then(m => ({ default: m.GridPage })));
const PositioningPage = lazy(() => import('./pages/css/PositioningPage').then(m => ({ default: m.PositioningPage })));
const BoxModelPage = lazy(() => import('./pages/css/BoxModelPage').then(m => ({ default: m.BoxModelPage })));

// Browser Pages
const RenderingPipelinePage = lazy(() => import('./pages/browser/RenderingPipelinePage').then(m => ({ default: m.RenderingPipelinePage })));

const Loading: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 48px)', fontSize: 14, color: '#888' }}>
    Loading...
  </div>
);

const App: React.FC = () => (
  <ThemeContextProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<PageShell />}>
          <Route index element={<Navigate to="/event-loop" replace />} />
          {/* JS Routes */}
          <Route path="event-loop" element={<Suspense fallback={<Loading />}><EventLoopPage /></Suspense>} />
          {/* CSS Routes */}
          <Route path="flexbox" element={<Suspense fallback={<Loading />}><FlexboxPage /></Suspense>} />
          <Route path="grid" element={<Suspense fallback={<Loading />}><GridPage /></Suspense>} />
          <Route path="positioning" element={<Suspense fallback={<Loading />}><PositioningPage /></Suspense>} />
          <Route path="box-model" element={<Suspense fallback={<Loading />}><BoxModelPage /></Suspense>} />
          {/* Browser Routes */}
          <Route path="browser/rendering-pipeline" element={<Suspense fallback={<Loading />}><RenderingPipelinePage /></Suspense>} />
          <Route path="browser/parsing" element={<Suspense fallback={<Loading />}><RenderingPipelinePage /></Suspense>} />
          <Route path="browser/cssom" element={<Suspense fallback={<Loading />}><RenderingPipelinePage /></Suspense>} />
          <Route path="browser/render-tree" element={<Suspense fallback={<Loading />}><RenderingPipelinePage /></Suspense>} />
          <Route path="browser/layout" element={<Suspense fallback={<Loading />}><RenderingPipelinePage /></Suspense>} />
          <Route path="browser/paint" element={<Suspense fallback={<Loading />}><RenderingPipelinePage /></Suspense>} />
          <Route path="browser/compositing" element={<Suspense fallback={<Loading />}><RenderingPipelinePage /></Suspense>} />
        </Route>
        {/* 404 Not Found Route */}
        <Route path="*" element={<Suspense fallback={<Loading />}><NotFoundPage /></Suspense>} />
      </Routes>
    </BrowserRouter>
  </ThemeContextProvider>
);

export default App;
