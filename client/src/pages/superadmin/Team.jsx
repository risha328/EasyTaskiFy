import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useOrganization } from '../../context/OrganizationContext';
import { useAuth } from '../../context/AuthContext';
import { fetchOrgMembersApi } from '../../services/api';
import {
  Users,
  UserPlus,
  Building2,
  Trash2,
  Loader2,
  X,
  Mail,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const SuperadminTeam = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { organizations, activeOrg, switchOrganization, isAdmin, addMember, removeMember } = useOrganization();
  const { user } = useAuth();

  const [selectedOrgId, setSelectedOrgId] = useState(searchParams.get('workspaceId') || activeOrg?.id || '');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('ADMIN');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Keep selectedOrgId in sync with search params or default orgs
  useEffect(() => {
    const paramId = searchParams.get('workspaceId');
    if (paramId && paramId !== selectedOrgId) {
      setSelectedOrgId(paramId);
    } else if (!selectedOrgId && (activeOrg?.id || organizations[0]?.id)) {
      setSelectedOrgId(activeOrg?.id || organizations[0]?.id);
    }
  }, [searchParams, activeOrg, organizations]);

  // Load members for selected organization
  const loadSelectedMembers = async (orgId) => {
    if (!orgId) return;
    try {
      setIsLoadingMembers(true);
      const data = await fetchOrgMembersApi(orgId);
      if (data.status === 'success') {
        setSelectedMembers(data.members || []);
      }
    } catch (err) {
      console.error('Failed to load workspace members:', err.message);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (selectedOrgId) {
      loadSelectedMembers(selectedOrgId);
    }
  }, [selectedOrgId]);

  const handleSelectOrg = (orgId) => {
    setSelectedOrgId(orgId);
    setSearchParams({ workspaceId: orgId });
    switchOrganization(orgId);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!inviteEmail.trim()) {
      setError('Please provide user email address');
      return;
    }

    try {
      setIsSubmitting(true);
      await addMember(inviteEmail.trim(), inviteRole, selectedOrgId);
      setSuccess(`User '${inviteEmail}' invited as ${inviteRole} to workspace.`);
      setInviteEmail('');
      setIsInviteModalOpen(false);
      await loadSelectedMembers(selectedOrgId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to invite user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member from the workspace?')) return;
    try {
      await removeMember(userId, selectedOrgId);
      await loadSelectedMembers(selectedOrgId);
    } catch (err) {
      console.error('Failed to remove member:', err.message);
    }
  };

  const currentOrg = organizations.find((o) => o.id === selectedOrgId) || activeOrg || organizations[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-lato">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-semibold">
              SUPERADMIN GOVERNANCE
            </span>
            <span>• Global Workspaces & Team Directory</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            System Workspaces & Team Members
          </h1>
        </div>

        {currentOrg && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 shadow-md transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Member to Workspace</span>
          </button>
        )}
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Workspace Selection Cards / Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-zinc-700 tracking-wider uppercase flex items-center gap-2 font-mono">
            <Building2 className="w-4 h-4 text-zinc-900" />
            <span>All System Workspaces ({organizations.length})</span>
          </h2>
          <span className="text-[11px] text-zinc-500">Click a workspace to inspect its team members</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org) => {
            const isSelected = org.id === selectedOrgId;

            return (
              <button
                key={org.id}
                type="button"
                onClick={() => handleSelectOrg(org.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 space-y-3 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg ring-2 ring-zinc-900 ring-offset-2'
                    : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-400 hover:shadow-sm'
                }`}
              >
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'
                        }`}
                      >
                        {org.name ? org.name[0].toUpperCase() : 'W'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm truncate">{org.name}</h3>
                        <p className={`text-[10px] font-mono ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          Role: <span className="font-semibold">{org.role || 'ADMIN'}</span>
                        </p>
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white font-bold shrink-0">
                        SELECTED
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                  </div>

                  {org.assignedAdminEmail && (
                    <div
                      className={`text-[10px] font-mono px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 truncate ${
                        isSelected ? 'bg-white/10 text-zinc-200' : 'bg-zinc-50 text-zinc-600 border border-zinc-100'
                      }`}
                    >
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{org.assignedAdminEmail}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Workspace Members Directory */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm space-y-0">
        <div className="px-6 py-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
              {currentOrg?.name ? currentOrg.name[0].toUpperCase() : 'W'}
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                <span>{currentOrg?.name || 'Workspace'} Members Directory</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800 font-mono font-bold">
                  {selectedMembers.length}
                </span>
              </h3>
              <p className="text-[11px] text-zinc-500 font-mono">
                {currentOrg?.assignedAdminEmail ? `Admin: ${currentOrg.assignedAdminEmail}` : 'Managing global team access & roles'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 bg-white border border-zinc-200 hover:bg-zinc-50 px-3 py-1.5 rounded-lg transition-colors shadow-xs shrink-0 self-start sm:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Member</span>
          </button>
        </div>

        {isLoadingMembers ? (
          <div className="p-12 flex items-center justify-center text-zinc-500 text-xs font-mono gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
            <span>Loading members directory...</span>
          </div>
        ) : selectedMembers.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs font-mono">
            No members found in this workspace directory.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {selectedMembers.map((member) => (
              <div
                key={member.userId || member.email}
                className="p-4 px-6 flex items-center justify-between hover:bg-zinc-50/80 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {member.name ? member.name[0].toUpperCase() : member.email ? member.email[0].toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 truncate">{member.name || 'User'}</h4>
                    <p className="text-[11px] text-zinc-500 font-mono truncate">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                      member.role === 'ADMIN'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : member.role === 'MANAGER'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-zinc-100 text-zinc-800 border-zinc-200'
                    }`}
                  >
                    {member.role || 'MEMBER'}
                  </span>

                  {isAdmin && (
                    <button
                      onClick={() => handleRemoveMember(member.userId)}
                      title="Remove Member from Workspace"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-zinc-900" />
                <h3 className="text-sm font-bold text-zinc-900">
                  Invite Member to {currentOrg?.name || 'Workspace'}
                </h3>
              </div>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-800">Target Workspace</label>
                <input
                  type="text"
                  readOnly
                  value={currentOrg?.name || ''}
                  className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-800">User Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@taskflow.dev"
                    required
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-800">Organizational Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                >
                  <option value="ADMIN">ADMIN — Full workspace and member management</option>
                  <option value="MANAGER">MANAGER — Manage projects and team tasks</option>
                  <option value="MEMBER">MEMBER — View and update assigned tasks</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-zinc-200 text-zinc-600 text-xs hover:bg-zinc-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 flex items-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperadminTeam;
