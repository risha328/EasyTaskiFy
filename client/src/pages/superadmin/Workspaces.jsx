import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { Building2, Plus, Check, ArrowRight, Loader2, X, Mail, Users } from 'lucide-react';

export const SuperadminWorkspaces = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { organizations, activeOrg, canCreateWorkspace, switchOrganization, createOrganization } = useOrganization();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-lato">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-semibold">
              SUPERADMIN DIRECTORY
            </span>
            <span>• Global Workspaces Governance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            Workspaces Management
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

      {/* Workspaces List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {organizations.map((org) => {
          const isActive = activeOrg?.id === org.id;

          return (
            <div
              key={org.id}
              className={`p-6 rounded-2xl border transition-all space-y-4 flex flex-col justify-between ${
                isActive ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl' : 'bg-white text-zinc-900 border-zinc-200 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${isActive ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'}`}>
                      {org.name ? org.name[0].toUpperCase() : 'W'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base truncate">{org.name}</h3>
                      <p className={`text-[11px] font-mono ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        Role: <span className="font-semibold">{org.role || 'ADMIN'}</span>
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20 font-semibold shrink-0">
                      ACTIVE
                    </span>
                  )}
                </div>

                {org.assignedAdminEmail && (
                  <div className={`flex items-center gap-2 text-xs p-2.5 rounded-lg font-mono ${isActive ? 'bg-white/10 text-zinc-200' : 'bg-zinc-50 text-zinc-700 border border-zinc-200'}`}>
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Admin: {org.assignedAdminEmail}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate(`/superadmin/team?workspaceId=${org.id}`)}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Enter Workspace & View Team</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto text-zinc-400" />
                </button>
              </div>
            </div>
          );
        })}
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
                <p className="text-[10px] text-zinc-500">
                  Superadmin can assign a designated Admin to manage this workspace.
                </p>
              </div>

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

export default SuperadminWorkspaces;
