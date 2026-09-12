import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { Building2, Plus, Check, ArrowRight, Loader2, X, Mail } from 'lucide-react';

export const SuperadminWorkspaces = () => {
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 shadow-md transition-all shrink-0"
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

              <div>
                {isActive ? (
                  <button disabled className="w-full py-2.5 rounded-xl bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-default">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Active Workspace</span>
                  </button>
                ) : (
                  <button onClick={() => switchOrganization(org.id)} className="w-full py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 flex items-center justify-center gap-2 transition-all">
                    <span>Switch Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuperadminWorkspaces;
