import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import {
  Building2,
  Plus,
  Check,
  Loader2,
  X,
  ChevronDown
} from 'lucide-react';

export const SuperadminDashboard = () => {
  const { user } = useAuth();
  const { organizations, activeOrg, canCreateWorkspace, switchOrganization, createOrganization } = useOrganization();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [filterTenant, setFilterTenant] = useState('All Tenants');

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
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create workspace.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayOrgs = organizations.length > 0 ? organizations : [
    {
      id: 'acme-corp-01',
      name: 'Acme Corp',
      role: 'ADMIN',
      assignedAdminEmail: 'admin@acme.com',
      tenantId: 'acme-corp-01',
      teamMembers: '128 active',
      activeProjects: '14 sprints',
      status: 'ACTIVE'
    },
    {
      id: 'veloce-infra-99',
      name: 'Veloce Cloud',
      role: 'MEMBER',
      assignedAdminEmail: 'ops@veloce.io',
      tenantId: 'veloce-infra-99',
      teamMembers: '42 active',
      activeProjects: '8 sprints',
      status: 'STANDBY'
    },
    {
      id: 'stripe-dev-04',
      name: 'Stripe Sandbox',
      role: 'VIEWER',
      assignedAdminEmail: 'fin-eng@stripe.org',
      tenantId: 'stripe-dev-04',
      teamMembers: '16 active',
      activeProjects: '3 sprints',
      status: 'SANDBOX'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-lato">
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Another Workspace</span>
          </button>
        )}
      </div>

      {/* Top 4 KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">TOTAL WORKSPACES</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-900 font-mono">{displayOrgs.length}</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              1 Active Primary
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-medium">Multi-tenant isolated Orgs</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">TOTAL USERS MANAGED</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-900 font-mono">1,428</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              +18% MoM
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-medium">Across 4 user roles</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">UPTIME SLA</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-900 font-mono">99.99%</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Zero Incidents
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-medium">Global edge routing</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">SYSTEM GOVERNANCE</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-zinc-900">Enforced</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-300">
              MFA 100%
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-medium">Strict isolation active</p>
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

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span>Filter:</span>
            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-800 font-medium hover:border-zinc-300">
              <span>{filterTenant}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayOrgs.map((org, index) => {
            const isActive = activeOrg?.id === org.id || index === 0;
            const orgRole = org.role || (index === 0 ? 'ADMIN' : index === 1 ? 'MEMBER' : 'VIEWER');
            const tenantId = org.tenantId || `${org.name.toLowerCase().replace(/\s+/g, '-')}-0${index + 1}`;
            const admin = org.assignedAdminEmail || (index === 0 ? 'admin@acme.com' : index === 1 ? 'ops@veloce.io' : 'fin-eng@stripe.org');
            const members = org.teamMembers || (index === 0 ? '128 active' : index === 1 ? '42 active' : '16 active');
            const projects = org.activeProjects || (index === 0 ? '14 sprints' : index === 1 ? '8 sprints' : '3 sprints');
            const statusLabel = isActive ? 'ACTIVE' : (index === 1 ? 'STANDBY' : 'SANDBOX');

            return (
              <div
                key={org.id || org.name}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-6 ${
                  isActive
                    ? 'bg-white border-2 border-zinc-900 shadow-xl'
                    : 'bg-white border border-zinc-200 hover:border-zinc-300 shadow-sm'
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
                          Role: <span className="font-bold text-zinc-800">{orgRole}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border shrink-0 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      {isActive && <span className="mr-1 text-emerald-500">•</span>}
                      {statusLabel}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2 text-xs font-mono border-t border-zinc-100">
                    <div className="flex items-center justify-between text-zinc-500">
                      <span>Tenant ID</span>
                      <span className="text-zinc-800 font-semibold">{tenantId}</span>
                    </div>

                    <div className="flex items-center justify-between text-zinc-500">
                      <span>Org Admin</span>
                      <span className="text-zinc-800 font-semibold truncate max-w-[150px]">{admin}</span>
                    </div>

                    <div className="flex items-center justify-between text-zinc-500">
                      <span>Team Members</span>
                      <span className="text-zinc-800 font-semibold">{members}</span>
                    </div>

                    <div className="flex items-center justify-between text-zinc-500">
                      <span>Active Projects</span>
                      <span className="text-zinc-800 font-semibold">{projects}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isActive ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-default shadow-md"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Active Workspace</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => switchOrganization(org.id)}
                      className="w-full py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-800 text-xs font-semibold hover:border-zinc-400 hover:bg-zinc-50 transition-all text-center"
                    >
                      Switch to Workspace
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
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
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 text-xs hover:bg-zinc-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 flex items-center gap-1.5"
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
