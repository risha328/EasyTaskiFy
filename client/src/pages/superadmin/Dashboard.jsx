import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { fetchSuperadminAnalyticsApi } from '../../services/api';
import {
  Building2,
  Plus,
  Loader2,
  X,
  ChevronDown,
  Users,
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  TrendingUp,
  Layers,
  ShieldCheck,
  Mail
} from 'lucide-react';

export const SuperadminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { organizations, activeOrg, canCreateWorkspace, switchOrganization, createOrganization } = useOrganization();

  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [filterTenant, setFilterTenant] = useState('All Tenants');

  const loadDashboardAnalytics = async () => {
    try {
      setIsLoadingAnalytics(true);
      const res = await fetchSuperadminAnalyticsApi();
      if (res.status === 'success' && res.data) {
        setAnalyticsData(res.data);
      }
    } catch (err) {
      console.error('Failed to load backend analytics for dashboard:', err.message);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    loadDashboardAnalytics();
  }, []);

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    setError('');

    if (!newOrgName.trim()) {
      setError('Please provide an organization name');
      return;
    }

    try {
      setIsSubmitting(true);
      await createOrganization(newOrgName.trim(), adminEmail.trim());
      setNewOrgName('');
      setAdminEmail('');
      setIsModalOpen(false);
      await loadDashboardAnalytics();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create workspace.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const summary = analyticsData?.summary || {
    totalWorkspaces: organizations.length || 0,
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
  };

  const displayOrgs = organizations;

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-lato pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">
            Workspaces & Operational Overview
          </h1>
        </div>

        {canCreateWorkspace && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Workspace</span>
          </button>
        )}
      </div>

      {/* Backend Live Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Workspaces Card */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">TOTAL WORKSPACES</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center shrink-0">
              <Building2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-zinc-900 font-mono">
              {isLoadingAnalytics ? <Loader2 className="w-5 h-5 animate-spin inline" /> : summary.totalWorkspaces}
            </span>
          </div>
        </div>

        {/* Total User Seats Card */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">TOTAL USER SEATS</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 flex items-center justify-center shrink-0">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-zinc-900 font-mono">
              {isLoadingAnalytics ? <Loader2 className="w-5 h-5 animate-spin inline" /> : summary.totalUsers}
            </span>
          </div>
        </div>

        {/* Active Projects Card */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">ACTIVE PROJECTS</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
              <FolderKanban className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-zinc-900 font-mono">
              {isLoadingAnalytics ? <Loader2 className="w-5 h-5 animate-spin inline" /> : summary.totalProjects}
            </span>
          </div>
        </div>

        {/* Tasks Delivered Card */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">TASKS DELIVERED</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-zinc-900 font-mono">
              {isLoadingAnalytics ? (
                <Loader2 className="w-5 h-5 animate-spin inline" />
              ) : (
                `${summary.completedTasks} / ${summary.totalTasks}`
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Created Workspaces Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200/60 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-zinc-700" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 font-mono">CREATED WORKSPACES</h2>
            <span className="text-xs font-mono bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded-full border border-zinc-200 font-bold">
              {displayOrgs.length}
            </span>
          </div>
        </div>

        {displayOrgs.length === 0 ? (
          <div className="p-10 text-center border border-dashed border-zinc-300 rounded-2xl bg-zinc-50/50 space-y-2">
            <Building2 className="w-8 h-8 text-zinc-400 mx-auto" />
            <h3 className="text-xs font-bold text-zinc-900">No Workspaces Created Yet</h3>
            <p className="text-xs text-zinc-500">Click "Create Workspace" above to set up your first organization.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayOrgs.map((org) => {
              const isActive = activeOrg?.id === org.id;

              return (
                <div
                  key={org.id}
                  className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-6 ${
                    isActive
                      ? 'bg-white border-2 border-zinc-900 shadow-xl'
                      : 'bg-white border border-zinc-200 hover:border-zinc-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md">
                          {org.name ? org.name[0].toUpperCase() : 'W'}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-base text-zinc-900 truncate">{org.name}</h3>
                          <p className="text-[11px] font-mono text-zinc-500">
                            Role: <span className="font-bold text-zinc-800">{org.role || 'ADMIN'}</span>
                          </p>
                        </div>
                      </div>

                      {isActive && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold shrink-0">
                          • ACTIVE
                        </span>
                      )}
                    </div>

                    {org.assignedAdminEmail ? (
                      <div className="flex items-center gap-2.5 text-xs p-3 rounded-xl font-mono bg-zinc-50 text-zinc-700 border border-zinc-200/80">
                        <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">Admin: {org.assignedAdminEmail}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 text-xs p-3 rounded-xl font-mono bg-zinc-50/50 text-zinc-400 border border-zinc-100">
                        <Mail className="w-3.5 h-3.5 opacity-50 shrink-0" />
                        <span className="truncate italic">No designated email</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => navigate(`/superadmin/team?workspaceId=${org.id}`)}
                      className="w-full py-3 px-4 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Users className="w-4 h-4 text-zinc-300 shrink-0" />
                        <span className="truncate">Enter Workspace & View Team</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Workspace Modal */}
      {isModalOpen && canCreateWorkspace && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-zinc-900" />
                <h3 className="text-sm font-bold text-zinc-900">Create New Workspace</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
                {error}
              </p>
            )}

            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">Workspace Name</label>
                <input
                  type="text"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. Acme DevOps Core"
                  required
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                />
              </div>

              {user?.role === 'SUPER_ADMIN' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-700">
                    Assign Workspace Admin Email <span className="text-zinc-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="e.g. admin@acme.com"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 text-xs hover:bg-zinc-100 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperadminDashboard;
