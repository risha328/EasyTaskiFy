import React, { useState } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { useAuth } from '../../context/AuthContext';
import { Users, UserPlus, Shield, Trash2, Loader2, X, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export const SuperadminTeam = () => {
  const { activeOrg, members, isAdmin, canInviteMembers, addMember, removeMember } = useOrganization();
  const { user } = useAuth();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('ADMIN');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      await addMember(inviteEmail.trim(), inviteRole);
      setSuccess(`User '${inviteEmail}' invited as ${inviteRole}.`);
      setInviteEmail('');
      setIsInviteModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to invite user.');
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
              SUPERADMIN GOVERNANCE
            </span>
            <span>• Global Team & RBAC Roles</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            System Team & Roles
          </h1>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 shadow-md transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite System Admin</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-700" />
            <span>Workspace Members Directory ({members.length})</span>
          </h3>
        </div>

        <div className="divide-y divide-zinc-100">
          {members.map((member) => (
            <div key={member.userId || member.email} className="p-4 px-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                  {member.name ? member.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">{member.name || 'User'}</h4>
                  <p className="text-[11px] text-zinc-500 font-mono">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
                  {member.role || 'MEMBER'}
                </span>

                {isAdmin && (
                  <button onClick={() => removeMember(member.userId)} className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-zinc-900" />
                <h3 className="text-sm font-bold text-zinc-900">Invite Team Member</h3>
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
                <label className="text-xs font-semibold text-zinc-800">User Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="admin@taskflow.dev"
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
