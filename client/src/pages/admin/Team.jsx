import React, { useState } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { Users, UserPlus, Trash2, Loader2, X } from 'lucide-react';

export const AdminTeam = () => {
  const { members, isAdmin, addMember, removeMember } = useOrganization();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');

    if (!inviteEmail.trim()) {
      setError('Please provide user email address');
      return;
    }

    try {
      setIsSubmitting(true);
      await addMember(inviteEmail.trim(), inviteRole);
      setInviteEmail('');
      setIsInviteModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to invite member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-lato">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
            <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-semibold">
              ADMIN TEAM MANAGEMENT
            </span>
            <span>• Member Privileges</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            Workspace Members
          </h1>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 shadow-md transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-700" />
            <span>Active Team Members</span>
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
    </div>
  );
};

export default AdminTeam;
