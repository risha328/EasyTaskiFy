import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { FolderKanban, CheckSquare, Gauge, Users } from 'lucide-react';

export const ManagerDashboard = () => {
  const { user } = useAuth();
  const { activeOrg } = useOrganization();

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-lato">
      <div className="border-b border-zinc-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
          <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-semibold">
            ENGINEERING MANAGER PORTAL
          </span>
          <span>• Sprint Planning & WIP Limits</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
          Sprint Manager Overview
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <span className="text-xs font-mono text-zinc-500 uppercase font-bold">Current Sprint</span>
          <div className="text-3xl font-extrabold text-zinc-900">Sprint 42</div>
          <p className="text-xs text-zinc-500">7 days remaining</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <span className="text-xs font-mono text-zinc-500 uppercase font-bold">WIP Capacity</span>
          <div className="text-3xl font-extrabold text-zinc-900">7 / 10</div>
          <p className="text-xs text-zinc-500">Strict limit enforced</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <span className="text-xs font-mono text-zinc-500 uppercase font-bold">Team Velocity</span>
          <div className="text-3xl font-extrabold text-zinc-900">48 pts</div>
          <p className="text-xs text-zinc-500">+12% vs last sprint</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
