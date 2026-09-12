import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import { Building2, Users, FolderKanban, CheckSquare, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { activeOrg, organizations } = useOrganization();

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-lato">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
            <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-semibold">
              ORGANIZATION ADMIN PORTAL
            </span>
            <span>• Workspace Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            {activeOrg?.name || 'Workspace'} Admin Overview
          </h1>
        </div>

        <Link
          to="/admin/team"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 shadow-md transition-all shrink-0"
        >
          <Users className="w-4 h-4" />
          <span>Manage Team Members</span>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <span className="text-xs font-mono text-zinc-500 uppercase font-bold">Active Members</span>
          <div className="text-3xl font-extrabold text-zinc-900">24</div>
          <p className="text-xs text-zinc-500">Developers & Leads in this org</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <span className="text-xs font-mono text-zinc-500 uppercase font-bold">Active Projects</span>
          <div className="text-3xl font-extrabold text-zinc-900">8</div>
          <p className="text-xs text-zinc-500">Sprint projects running</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-2">
          <span className="text-xs font-mono text-zinc-500 uppercase font-bold">Open Tasks</span>
          <div className="text-3xl font-extrabold text-zinc-900">142</div>
          <p className="text-xs text-zinc-500">Backlog and active issues</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
