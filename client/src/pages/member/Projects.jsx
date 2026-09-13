import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { fetchProjectsApi } from '../../services/api';
import {
  FolderKanban,
  Search,
  Loader2,
  Layers,
  Clock,
  CheckCircle,
  UserCheck,
  Users
} from 'lucide-react';

export const MemberProjects = () => {
  const { activeOrg } = useOrganization();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadProjects = async () => {
    if (!activeOrg?.id) return;
    try {
      setIsLoading(true);
      const data = await fetchProjectsApi(activeOrg.id);
      if (data.status === 'success') {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load member projects:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [activeOrg]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = projects.filter((p) => p.status === 'ACTIVE').length;
  const planningCount = projects.filter((p) => p.status === 'PLANNING').length;
  const completedCount = projects.filter((p) => p.status === 'COMPLETED').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-lato">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-semibold">
              MEMBER WORKSPACE
            </span>
            <span>• {activeOrg?.name || 'Workspace'} My Projects</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            Assigned Projects
          </h1>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-mono text-zinc-500 uppercase font-bold">Assigned Projects</p>
            <p className="text-xl font-extrabold text-zinc-900">{projects.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-sm shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-mono text-zinc-500 uppercase font-bold">Active Sprints</p>
            <p className="text-xl font-extrabold text-zinc-900">{activeCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-sm shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-mono text-zinc-500 uppercase font-bold">Planning</p>
            <p className="text-xl font-extrabold text-zinc-900">{planningCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold text-sm shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-mono text-zinc-500 uppercase font-bold">Completed</p>
            <p className="text-xl font-extrabold text-zinc-900">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assigned projects..."
            className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'ACTIVE', 'PLANNING', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="p-12 flex items-center justify-center text-zinc-500 text-xs font-mono gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
          <span>Loading projects...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-white border border-zinc-200 rounded-2xl text-zinc-500 text-xs font-mono space-y-2">
          <p>No assigned projects found for you in this workspace.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const pct = project.totalTasks > 0 ? Math.round((project.completedTasks / project.totalTasks) * 100) : 0;

            return (
              <div
                key={project._id}
                className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs hover:border-zinc-400 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                        {project.name ? project.name[0].toUpperCase() : 'P'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-zinc-900 truncate">{project.name}</h3>
                        <p className="text-[11px] text-zinc-500 font-mono">
                          Lead: {project.ownerId?.name || 'Project Lead'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                        project.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : project.status === 'PLANNING'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {project.description && (
                    <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  {/* Assigned Manager & Team Members */}
                  <div className="pt-2 border-t border-zinc-100 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-zinc-700">
                      <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="font-semibold text-[11px]">Manager:</span>
                      <span className="text-[11px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200 font-medium truncate">
                        {project.managerId?.name || 'Unassigned'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-zinc-700">
                      <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-semibold text-[11px]">Team Members ({project.members?.length || 0}):</span>
                      {project.members && project.members.length > 0 ? (
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {project.members.slice(0, 4).map((m, idx) => (
                            <span
                              key={m._id || idx}
                              title={m.name}
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 text-white text-[9px] font-bold border border-white"
                            >
                              {m.name ? m.name[0].toUpperCase() : 'M'}
                            </span>
                          ))}
                          {project.members.length > 4 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-200 text-zinc-700 text-[9px] font-bold border border-white">
                              +{project.members.length - 4}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-400">None assigned</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-600">
                    <span>Tasks: {project.completedTasks}/{project.totalTasks}</span>
                    <span className="font-bold">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemberProjects;
