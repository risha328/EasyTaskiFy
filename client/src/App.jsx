import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { OrganizationProvider } from './context/OrganizationContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { Workspaces } from './pages/Workspaces';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Team } from './pages/Team';

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
      <AuthProvider>
        <OrganizationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Home Landing Page at localhost:5173 */}
              <Route path="/" element={<LandingPage />} />

              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Application Routes for 4 Role Dashboard URLs */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                {/* Redirect /dashboard to /superadmin/dashboard */}
                <Route path="/dashboard" element={<Navigate to="/superadmin/dashboard" replace />} />
                
                {/* 4 Role Specific Dashboard Routes */}
                <Route path="/superadmin/dashboard" element={<Dashboard />} />
                <Route path="/super_admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/manager/dashboard" element={<Dashboard />} />
                <Route path="/employee/dashboard" element={<Dashboard />} />
                <Route path="/member/dashboard" element={<Dashboard />} />

                <Route path="/workspaces" element={<Workspaces />} />
                <Route path="/team" element={<Team />} />

                {/* Catch-all */}
                <Route
                  path="*"
                  element={
                    <div className="p-8 text-center space-y-3">
                      <h2 className="text-xl font-bold text-zinc-900">Module Under Construction</h2>
                      <p className="text-xs text-zinc-500">
                        This feature module will be unlocked in upcoming development phases according to the implementation plan.
                      </p>
                    </div>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </OrganizationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
