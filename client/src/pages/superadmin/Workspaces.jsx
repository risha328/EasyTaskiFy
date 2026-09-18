import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrganization } from '../../context/OrganizationContext';
import {
  Building2,
  Plus,
  ArrowRight,
  Loader2,
  X,
  Mail,
  Users,
  Search,
  LayoutGrid,
  Table as TableIcon,
  ChevronDown,
  Check,
  Sparkles,
  Filter
} from 'lucide-react';

export const SuperadminWorkspaces = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { organizations, activeOrg, canCreateWorkspace, switchOrganization, createOrganization } = useOrganization();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('RECENT');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const searchInputRef = useRef(null);

  // Keyboard shortcut (⌘K or Ctrl+K) to focus search
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

  const handleEnterWorkspace = (org) => {
    if (activeOrg?.id !== org.id) {
      switchOrganization(org.id);
    }
    navigate(`/superadmin/team?workspaceId=${org.id}`);
  };

  // Filtering and Sorting logic
  const filteredOrganizations = organizations
    .filter((org) => {
      const nameMatch = org.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const emailMatch = org.assignedAdminEmail?.toLowerCase().includes(searchQuery.toLowerCase());
      const roleMatch = org.role?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = nameMatch || emailMatch || roleMatch;

      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'ACTIVE'
          ? activeOrg?.id === org.id || org.status === 'ACTIVE'
          : org.status === statusFilter;

      const matchesRole =
        roleFilter === 'ALL' ? true : (org.role || 'ADMIN').toUpperCase() === roleFilter.toUpperCase();

      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
      if (sortBy === 'NAME_DESC') return b.name.localeCompare(a.name);
      return 0; // Default: RECENT
    });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-lato">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">
            Workspaces Management
          </h1>
        </div>

        {canCreateWorkspace && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Workspace</span>
          </button>
        )}
      </div>

      {/* Search & Filter Toolbar Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left Side: Search input */}
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workspaces by name, admin, or email..."
            className="w-full bg-white border border-zinc-200/90 rounded-xl pl-9 pr-16 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 shadow-2xs transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="text-zinc-400 hover:text-zinc-600 p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 border border-zinc-200 rounded">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* Right Side: Filter Dropdowns & View Toggle */}
        <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2.5">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-zinc-200/90 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-zinc-700 hover:border-zinc-300 focus:outline-none focus:border-zinc-900 cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none bg-white border border-zinc-200/90 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-zinc-700 hover:border-zinc-300 focus:outline-none focus:border-zinc-900 cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="MEMBER">MEMBER</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          

          {/* View toggle switcher */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200/80 shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              title="Cards View"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/50'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header status bar */}
      <div className="flex items-center justify-between text-xs text-zinc-500 font-medium px-1">
        <div>
          Showing <span className="font-bold text-zinc-900">{filteredOrganizations.length}</span> of{' '}
          <span className="font-bold text-zinc-900">{organizations.length}</span> workspaces
        </div>
       
      </div>

      {/* Workspaces List / Grid */}
      {filteredOrganizations.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-zinc-300 rounded-2xl bg-zinc-50/50 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-200/70 flex items-center justify-center mx-auto text-zinc-600">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900">No Workspaces Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {searchQuery
              ? `No workspaces match your search term "${searchQuery}".`
              : 'Click Create Workspace to add your first organization.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-zinc-900 hover:underline cursor-pointer"
            >
              Clear search filter
            </button>
          )}
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredOrganizations.map((org) => {
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
                  {/* Top row: Avatar + Title & Role + Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-xs ${
                          isActive
                            ? 'bg-white text-zinc-900'
                            : 'bg-zinc-900 text-white'
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

                  {/* Admin Email container */}
                  {org.assignedAdminEmail ? (
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
                  ) : (
                    <div
                      className={`flex items-center gap-2.5 text-xs p-3 rounded-xl font-mono ${
                        isActive
                          ? 'bg-zinc-800/50 text-zinc-400 border border-zinc-800'
                          : 'bg-zinc-50/50 text-zinc-400 border border-zinc-100'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0 opacity-50" />
                      <span className="truncate italic">No designated email</span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Button */}
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
        /* Table View */
        <div className="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-700 border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200/80 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Workspace Name</th>
                  <th className="py-3 px-4 font-semibold">Assigned Admin</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredOrganizations.map((org) => {
                  const isActive = activeOrg?.id === org.id;

                  return (
                    <tr
                      key={org.id}
                      className={`hover:bg-zinc-50/80 transition-colors ${
                        isActive ? 'bg-zinc-50/60' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-medium text-zinc-900">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isActive ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900 border border-zinc-200'
                            }`}
                          >
                            {org.name ? org.name[0].toUpperCase() : 'W'}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-900">{org.name}</div>
                            {isActive && (
                              <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                                Current Active Workspace
                              </span>
                            )}
                          </div>
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
                      <td className="py-3.5 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[10px] font-mono font-medium border border-zinc-200">
                            STANDBY
                          </span>
                        )}
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
        </div>
      )}

      {/* Create Workspace Modal */}
      {isModalOpen && canCreateWorkspace && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-zinc-900" />
                <h3 className="text-sm font-bold text-zinc-900">Create New Workspace</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg hover:bg-zinc-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
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
                  className="w-full bg-zinc-50 border border-zinc-300/80 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700">
                  Assign Workspace Admin Email <span className="text-zinc-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="e.g. admin@acme.com"
                  className="w-full bg-zinc-50 border border-zinc-300/80 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                />
                <p className="text-[10px] text-zinc-500">
                  Superadmin can assign a designated Admin to manage this workspace.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-zinc-200 text-zinc-600 text-xs hover:bg-zinc-100 font-semibold cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Create Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperadminWorkspaces;
