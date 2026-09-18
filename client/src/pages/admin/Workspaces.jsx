import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '../../context/OrganizationContext';
import {
  Building2,
  ArrowRight,
  Mail,
  Users,
  Search,
  LayoutGrid,
  Table as TableIcon,
  ChevronDown,
  Check
} from 'lucide-react';

export const AdminWorkspaces = () => {
  const navigate = useNavigate();
  const { organizations, activeOrg, switchOrganization } = useOrganization();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEnterWorkspace = (org) => {
    if (activeOrg?.id !== org.id) {
      switchOrganization(org.id);
    }
    navigate(`/admin/dashboard`);
  };

  const filteredOrgs = organizations.filter((org) => {
    const query = searchQuery.toLowerCase();
    return (
      org.name?.toLowerCase().includes(query) ||
      org.assignedAdminEmail?.toLowerCase().includes(query) ||
      org.role?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-lato">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
            <span className="px-2.5 py-1 rounded bg-indigo-600 text-white font-semibold tracking-wide text-[11px] uppercase">
              WORKSPACES DIRECTORY
            </span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-600 font-medium">Enterprise Organizations</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">
            Workspaces Directory
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workspaces by name or role..."
              className="w-full bg-white border border-zinc-200/90 rounded-xl pl-9 pr-16 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 shadow-2xs"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 border border-zinc-200 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200/80 shrink-0">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500 font-medium px-1">
        <div>
          Showing <span className="font-bold text-zinc-900">{filteredOrgs.length}</span> of{' '}
          <span className="font-bold text-zinc-900">{organizations.length}</span> workspaces
        </div>
        <div className="flex items-center gap-1.5 text-zinc-600 font-medium text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
          <span>Live updates enabled</span>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredOrgs.map((org) => {
            const isActive = activeOrg?.id === org.id;

            return (
              <div
                key={org.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-5 ${
                  isActive
                    ? 'bg-[#18181b] text-white border-zinc-800 shadow-xl'
                    : 'bg-white text-zinc-900 border-zinc-200/90 hover:border-zinc-300 shadow-2xs hover:shadow-md'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-xs ${
                          isActive ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'
                        }`}
                      >
                        {org.name ? org.name[0].toUpperCase() : 'W'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base truncate tracking-tight">{org.name}</h3>
                        <p className={`text-xs font-mono mt-0.5 ${isActive ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          Role: <span className="font-semibold text-zinc-300">{org.role || 'ADMIN'}</span>
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-bold uppercase tracking-wider shrink-0">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  {org.assignedAdminEmail && (
                    <div
                      className={`flex items-center gap-2.5 text-xs p-3 rounded-xl font-mono ${
                        isActive
                          ? 'bg-zinc-800/80 text-zinc-200 border border-zinc-700/50'
                          : 'bg-zinc-50 text-zinc-700 border border-zinc-200/80'
                      }`}
                    >
                      <Mail className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-zinc-400' : 'text-zinc-500'}`} />
                      <span className="truncate">Admin: {org.assignedAdminEmail}</span>
                    </div>
                  )}
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => handleEnterWorkspace(org)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer shadow-2xs group ${
                      isActive
                        ? 'bg-zinc-800/90 hover:bg-zinc-800 text-white border border-zinc-700/60'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-zinc-300" />
                      <span>Enter Workspace & View Team</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs text-zinc-700 border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200/80 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Workspace Name</th>
                <th className="py-3 px-4 font-semibold">Assigned Admin</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredOrgs.map((org) => {
                const isActive = activeOrg?.id === org.id;

                return (
                  <tr key={org.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-zinc-900">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isActive ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900 border border-zinc-200'
                          }`}
                        >
                          {org.name ? org.name[0].toUpperCase() : 'W'}
                        </div>
                        <span className="font-bold text-zinc-900">{org.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-600">
                      {org.assignedAdminEmail || 'Not assigned'}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 font-semibold">
                        {org.role || 'ADMIN'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleEnterWorkspace(org)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-semibold text-xs shadow-2xs transition-all cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Enter Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminWorkspaces;
