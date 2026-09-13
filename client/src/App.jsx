import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import AdminProjects from './pages/admin/Projects';
import AdminTasks from './pages/admin/Tasks';
import { AdminAnalytics } from './pages/admin/Analytics';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import ManagerWorkspaces from './pages/manager/Workspaces';
import ManagerTeam from './pages/manager/Team';
import { ManagerProjects } from './pages/manager/Projects';
import { ManagerTasks } from './pages/manager/Tasks';

// Member Pages
import MemberDashboard from './pages/member/Dashboard';
import MemberWorkspaces from './pages/member/Workspaces';
import MemberTeam from './pages/member/Team';
import { MemberProjects } from './pages/member/Projects';
import { MemberTasks } from './pages/member/Tasks';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 10000,
    },
  },
});

// Smart dashboard redirect based on logged-in user role
const DashboardRedirect = () => {
  const { user } = useAuth();
  const role = user?.role;

  if (role === 'SUPER_ADMIN') return <Navigate to="/superadmin/dashboard" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'MANAGER') return <Navigate to="/manager/dashboard" replace />;
  if (role === 'MEMBER' || role === 'USER') return <Navigate to="/member/dashboard" replace />;

  return <Navigate to="/admin/dashboard" replace />;
};

// Route guard restricting routes to designated role levels only
const RequireRole = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const role = user?.role;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <DashboardRedirect />;
  }
  return children;
};

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
                {/* Dynamic Role-Based /dashboard Redirect */}
                <Route path="/dashboard" element={<DashboardRedirect />} />
                
                {/* Superadmin Routes */}
                <Route path="/superadmin/dashboard" element={<RequireRole allowedRoles={['SUPER_ADMIN']}><SuperadminDashboard /></RequireRole>} />
                <Route path="/superadmin/workspaces" element={<RequireRole allowedRoles={['SUPER_ADMIN']}><SuperadminWorkspaces /></RequireRole>} />
                <Route path="/superadmin/team" element={<RequireRole allowedRoles={['SUPER_ADMIN']}><SuperadminTeam /></RequireRole>} />
                <Route path="/superadmin/projects" element={<RequireRole allowedRoles={['SUPER_ADMIN']}><SuperadminWorkspaces /></RequireRole>} />
                <Route path="/superadmin/analytics" element={<RequireRole allowedRoles={['SUPER_ADMIN']}><SuperadminDashboard /></RequireRole>} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN']}><AdminDashboard /></RequireRole>} />
                <Route path="/admin/workspaces" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN']}><AdminWorkspaces /></RequireRole>} />
                <Route path="/admin/team" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN']}><AdminTeam /></RequireRole>} />
                <Route path="/admin/projects" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN']}><AdminProjects /></RequireRole>} />
                <Route path="/admin/tasks" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN']}><AdminTasks /></RequireRole>} />
                <Route path="/admin/analytics" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN']}><AdminAnalytics /></RequireRole>} />

                {/* Manager Routes */}
                <Route path="/manager/dashboard" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER']}><ManagerDashboard /></RequireRole>} />
                <Route path="/manager/workspaces" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER']}><ManagerWorkspaces /></RequireRole>} />
                <Route path="/manager/team" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER']}><ManagerTeam /></RequireRole>} />
                <Route path="/manager/projects" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER']}><ManagerProjects /></RequireRole>} />
                <Route path="/manager/tasks" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER']}><ManagerTasks /></RequireRole>} />
                <Route path="/manager/analytics" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER']}><ManagerDashboard /></RequireRole>} />

                {/* Member / Employee Routes */}
                <Route path="/member/dashboard" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'MEMBER', 'USER']}><MemberDashboard /></RequireRole>} />
                <Route path="/member/workspaces" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'MEMBER', 'USER']}><MemberWorkspaces /></RequireRole>} />
                <Route path="/member/team" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'MEMBER', 'USER']}><MemberTeam /></RequireRole>} />
                <Route path="/member/projects" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'MEMBER', 'USER']}><MemberProjects /></RequireRole>} />
                <Route path="/member/tasks" element={<RequireRole allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'MEMBER', 'USER']}><MemberTasks /></RequireRole>} />

                {/* Fallback Workspaces & Team */}
                <Route path="/workspaces" element={<AdminWorkspaces />} />
                <Route path="/team" element={<AdminTeam />} />

                {/* Catch-all */}
                <Route
                  path="*"
                  element={
                    <div className="p-8 text-center space-y-3 font-lato">
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
