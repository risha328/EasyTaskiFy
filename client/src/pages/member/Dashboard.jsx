import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { CheckSquare, Clock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MemberDashboard = () => {
  const { user } = useAuth();
  const { activeOrg } = useOrganization();

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-lato">
      <div className="border-b border-zinc-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-semibold">
            CONTRIBUTOR DASHBOARD
          </span>
          <span>• My Tasks & Work</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
          Welcome back, {user?.name || 'Contributor'}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <span className="text-xs font-mono text-zinc-500 uppercase font-bold">Assigned Tasks</span>
          <div className="text-3xl font-extrabold text-zinc-900">5 Active</div>
          <p className="text-xs text-zinc-500">In Sprint 42</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <span className="text-xs font-mono text-zinc-500 uppercase font-bold">Completed Tasks</span>
          <div className="text-3xl font-extrabold text-zinc-900">18 Done</div>
          <p className="text-xs text-zinc-500">This month</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <span className="text-xs font-mono text-zinc-500 uppercase font-bold">Workspace</span>
          <div className="text-xl font-extrabold text-zinc-900 truncate">{activeOrg?.name || 'Acme Corp'}</div>
          <p className="text-xs text-zinc-500">Active membership</p>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
