import React, { useState } from 'react';
import { useOrganization } from '../context/OrganizationContext';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  AlertCircle,
  Loader2,
  X,
  Mail,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export const Team = () => {
  const { activeOrg, members, userRole, isAdmin, canInviteMembers, addMember, removeMember } = useOrganization();
  const { user: currentUser } = useAuth();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
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
      setSuccess(`User '${inviteEmail}' invited successfully as ${inviteRole}.`);
      setInviteEmail('');
      setIsInviteModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to invite user to organization.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (memberUserId, memberName) => {
    if (!isAdmin) return;

    if (window.confirm(`Are you sure you want to remove ${memberName} from this workspace?`)) {
      try {
        await removeMember(memberUserId);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to remove member.');
      }
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-zinc-900 text-white border-zinc-900';
      case 'MANAGER':
        return 'bg-zinc-100 text-zinc-900 border-zinc-300';
      default:
        return 'bg-zinc-50 text-zinc-600 border-zinc-200';
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-semibold">
              ORGANIZATION
            </span>
            <span>• {activeOrg?.name || 'Workspace'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            Team & Role Management
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Manage team access, assign organizational roles, and enforce RBAC permissions
          </p>
        </div>

        {canInviteMembers && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Member</span>
          </button>
        )}
      </div>

      {/* Alert Banner */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess('')} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Member List Table */}
      <div className="bw-panel rounded-xl overflow-hidden space-y-4">
        <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">Workspace Members</h2>
              <p className="text-xs text-zinc-500">{members.length} members in this workspace</p>
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-100 border border-zinc-300 font-semibold text-zinc-800">
            Your Role: {userRole}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-100 text-zinc-600 border-b border-zinc-200 uppercase tracking-wider font-semibold">
                <th className="py-3 px-6">Member Name</th>
                <th className="py-3 px-6">Email Address</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Joined Date</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {members.map((member) => {
                const isSelf = member.userId === currentUser?.id;
                return (
                  <tr key={member.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-zinc-900">
                      <div className="flex items-center gap-2">
                        <span>{member.name}</span>
                        {isSelf && (
                          <span className="text-[10px] bg-zinc-900 text-white px-2 py-0.5 rounded font-mono">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-600 font-mono">{member.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border ${getRoleBadgeStyle(
                          member.role
                        )}`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-500 font-mono">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {isAdmin && !isSelf ? (
                        <button
                          onClick={() => handleRemove(member.userId, member.name)}
                          title="Remove Member"
                          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-zinc-400 text-[10px] font-mono">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
                    placeholder="teammate@taskflow.dev"
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
                  <option value="MEMBER">MEMBER — View and update assigned tasks</option>
                  <option value="MANAGER">MANAGER — Manage projects and team tasks</option>
                  <option value="ADMIN">ADMIN — Full workspace and member management</option>
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
