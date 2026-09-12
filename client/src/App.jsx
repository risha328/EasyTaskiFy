import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { OrganizationProvider } from './context/OrganizationContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Superadmin Pages
import SuperadminDashboard from './pages/superadmin/Dashboard';
import SuperadminWorkspaces from './pages/superadmin/Workspaces';
import SuperadminTeam from './pages/superadmin/Team';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminWorkspaces from './pages/admin/Workspaces';
import AdminTeam from './pages/admin/Team';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerWorkspaces from './pages/manager/Workspaces';
import ManagerTeam from './pages/manager/Team';

// Member Pages
import MemberDashboard from './pages/member/Dashboard';
import MemberWorkspaces from './pages/member/Workspaces';
import MemberTeam from './pages/member/Team';

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
              {/* Public Home Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Public Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Application Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                {/* Redirect /dashboard to /superadmin/dashboard */}
                <Route path="/dashboard" element={<Navigate to="/superadmin/dashboard" replace />} />
                
                {/* Superadmin Routes */}
                <Route path="/superadmin/dashboard" element={<SuperadminDashboard />} />
                <Route path="/superadmin/workspaces" element={<SuperadminWorkspaces />} />
                <Route path="/superadmin/team" element={<SuperadminTeam />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/workspaces" element={<AdminWorkspaces />} />
                <Route path="/admin/team" element={<AdminTeam />} />

                {/* Manager Routes */}
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/manager/workspaces" element={<ManagerWorkspaces />} />
                <Route path="/manager/team" element={<ManagerTeam />} />

                {/* Member / Employee Routes */}
                <Route path="/member/dashboard" element={<MemberDashboard />} />
                <Route path="/member/workspaces" element={<MemberWorkspaces />} />
                <Route path="/member/team" element={<MemberTeam />} />
                <Route path="/employee/dashboard" element={<MemberDashboard />} />
                <Route path="/employee/workspaces" element={<MemberWorkspaces />} />
                <Route path="/employee/team" element={<MemberTeam />} />

                {/* Fallback Workspaces & Team */}
                <Route path="/workspaces" element={<SuperadminWorkspaces />} />
                <Route path="/team" element={<SuperadminTeam />} />

                {/* Catch-all */}
                <Route
                  path="*"
                  element={
                    <div className="p-8 text-center space-y-3">
                      <h2 className="text-xl font-bold text-zinc-900 font-lato">Module Under Construction</h2>
                      <p className="text-xs text-zinc-500 font-lato">
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
