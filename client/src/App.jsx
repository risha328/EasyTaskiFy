import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route
              path="*"
              element={
                <div className="p-8 text-center space-y-3">
                  <h2 className="text-xl font-bold text-slate-200">Module Under Construction</h2>
                  <p className="text-xs text-slate-400">
                    This feature module will be unlocked in upcoming development phases according to the implementation plan.
                  </p>
                </div>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
