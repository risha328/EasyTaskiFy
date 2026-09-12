import React, { useState } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { useAuth } from '../../context/AuthContext';
import { Building2, ChevronDown, Plus, Check, Loader2, X } from 'lucide-react';

export const OrgSwitcher = () => {
  const { organizations, activeOrg, canCreateWorkspace, switchOrganization, createOrganization } = useOrganization();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create organization.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 rounded-lg border border-zinc-200 hover:border-zinc-400 bg-zinc-50 hover:bg-zinc-100 transition-all text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-md bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {activeOrg?.name ? activeOrg.name[0].toUpperCase() : 'W'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-900 truncate">
              {activeOrg?.name || 'Select Workspace'}
            </p>
            <p className="text-[10px] text-zinc-500 font-mono">
              Role: <span className="font-semibold text-zinc-700">{activeOrg?.role || 'MEMBER'}</span>
            </p>
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg z-50 p-1.5 space-y-1">
            <p className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
              Workspaces ({organizations.length})
            </p>

            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    switchOrganization(org.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                    activeOrg?.id === org.id
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <span className="truncate">{org.name}</span>
                  {activeOrg?.id === org.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>

            {/* Render Create Workspace button only for ADMIN or MANAGER */}
            {canCreateWorkspace && (
              <div className="pt-1 border-t border-zinc-100">
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Workspace</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

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
                  <p className="text-[10px] text-zinc-500">
                    Superadmin can assign a designated Admin to manage this workspace.
                  </p>
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
