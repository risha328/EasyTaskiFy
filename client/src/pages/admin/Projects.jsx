import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { fetchProjectsApi, createProjectApi, updateProjectApi, deleteProjectApi } from '../../services/api';
import {
  FolderKanban,
  Plus,
  Search,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Pencil,
  Layers,
  Clock,
  CheckCircle,
  UserCheck,
  Users
} from 'lucide-react';

export const AdminProjects = () => {
  const { activeOrg, members } = useOrganization();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectStatus, setProjectStatus] = useState('ACTIVE');
  const [projectManagerId, setProjectManagerId] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProjects = async () => {
    if (!activeOrg?.id) return;
    try {
      setIsLoading(true);
      const data = await fetchProjectsApi(activeOrg.id);
      if (data.status === 'success') {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load projects:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [activeOrg]);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setProjectName('');
    setProjectDescription('');
    setProjectStatus('ACTIVE');
    setProjectManagerId('');
    setSelectedMemberIds([]);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setProjectName(project.name || '');
    setProjectDescription(project.description || '');
    setProjectStatus(project.status || 'ACTIVE');
    setProjectManagerId(project.managerId?._id || project.managerId || '');
    setSelectedMemberIds((project.members || []).map((m) => m._id || m));
    setError('');
    setIsModalOpen(true);
  };

  const handleMemberToggle = (memberUserId) => {
    if (selectedMemberIds.includes(memberUserId)) {
      setSelectedMemberIds(selectedMemberIds.filter((id) => id !== memberUserId));
    } else {
      setSelectedMemberIds([...selectedMemberIds, memberUserId]);
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!projectName.trim()) {
      setError('Please provide a project name');
      return;
    }

    if (!projectManagerId) {
      setError('Assign Manager is mandatory. Please select a manager.');
      return;
    }

    if (!projectStatus) {
      setError('Lifecycle Status is mandatory. Please select a status.');
      return;
    }

    if (!selectedMemberIds || selectedMemberIds.length === 0) {
      setError('Assign Team Members is mandatory. Please select at least one team member.');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        name: projectName.trim(),
        description: projectDescription.trim(),
        organizationId: activeOrg.id,
        status: projectStatus,
        managerId: projectManagerId || null,
        members: selectedMemberIds,
      };

      if (editingProject) {
        await updateProjectApi(editingProject._id, payload);
        setSuccess(`Project '${projectName}' updated successfully.`);
      } else {
        await createProjectApi(payload);
        setSuccess(`Project '${projectName}' created successfully.`);
      }

      setProjectName('');
      setProjectDescription('');
      setProjectStatus('ACTIVE');
      setProjectManagerId('');
      setSelectedMemberIds([]);
      setEditingProject(null);
      setIsModalOpen(false);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project and all its tasks?')) return;
    try {
      await deleteProjectApi(projectId);
      await loadProjects();
    } catch (err) {
      console.error('Failed to delete project:', err.message);
    }
  };

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
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-semibold">
              WORKSPACE GOVERNANCE
            </span>
            <span>• {activeOrg?.name || 'Workspace'} Projects</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            Projects Management
          </h1>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Project</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess('')} className="hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-mono text-zinc-500 uppercase font-bold">Total Projects</p>
            <p className="text-xl font-extrabold text-zinc-900">{projects.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-sm shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-mono text-zinc-500 uppercase font-bold">Active</p>
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

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
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
        <div className="p-12 text-center bg-white border border-zinc-200 rounded-2xl text-zinc-500 text-xs font-mono space-y-3">
          <p>No projects found in this workspace.</p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Project</span>
          </button>
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
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {project.name ? project.name[0].toUpperCase() : 'P'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-zinc-900 truncate">{project.name}</h3>
                        <p className="text-[11px] text-zinc-500 font-mono">
                          Owner: {project.ownerId?.name || 'Admin'}
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
                      <span className={`text-[11px] px-2 py-0.5 rounded-md border font-medium truncate ${
                        project.managerId?.name 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : 'bg-zinc-100 text-zinc-500 border-zinc-200 italic'
                      }`}>
                        {project.managerId?.name || 'Unassigned (Click edit to add)'}
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

                {/* Task Completion Bar & Action Controls */}
                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-600">
                    <span>Tasks: {project.completedTasks}/{project.totalTasks}</span>
                    <span className="font-bold">{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-1">
                    <button
                      onClick={() => handleOpenEditModal(project)}
                      className="text-zinc-500 hover:text-zinc-900 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
                      title="Edit Project & Assign Manager"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-zinc-900" />
                <h3 className="text-sm font-bold text-zinc-900">
                  {editingProject ? `Edit Project: ${editingProject.name}` : 'Create New Project'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-800">Project Name *</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Backend API Migration"
                  required
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-800">Project Description</label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Summary of project goals and targets..."
                  rows={2}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-800">
                    Assign Manager <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={projectManagerId}
                    onChange={(e) => setProjectManagerId(e.target.value)}
                    required
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                  >
                    <option value="">Select Manager *</option>
                    {(() => {
                      const workspaceManagers = members.filter((m) => {
                        const isManagerRole = m.role === 'MANAGER' || m.userId?.role === 'MANAGER';
                        const isCurrentAssignedManager =
                          projectManagerId &&
                          (m.userId?._id === projectManagerId || m.userId === projectManagerId || m.id === projectManagerId);
                        return isManagerRole || isCurrentAssignedManager;
                      });

                      const listToRender = workspaceManagers.length > 0 ? workspaceManagers : members;

                      return listToRender.map((m) => {
                        const uId = m.userId?._id || m.userId || m.id;
                        const uName = m.name || m.userId?.name || m.email || m.userId?.email || 'User';
                        return (
                          <option key={uId} value={uId}>
                            {uName} ({m.role || 'Member'})
                          </option>
                        );
                      });
                    })()}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-800">
                    Lifecycle Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value)}
                    required
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PLANNING">PLANNING</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              {/* Assign Team Members Checkboxes */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-zinc-800 flex items-center justify-between">
                  <span>
                    Assign Team Members <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">{selectedMemberIds.length} selected</span>
                </label>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 max-h-36 overflow-y-auto space-y-2">
                  {members.length === 0 ? (
                    <p className="text-xs text-zinc-400">No workspace members found.</p>
                  ) : (
                    members.map((m) => {
                      const uId = m.userId?._id || m.userId || m.id;
                      const uName = m.name || m.userId?.name || m.email || m.userId?.email || 'User';
                      const isSelected = selectedMemberIds.includes(uId);

                      return (
                        <label
                          key={uId}
                          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-zinc-100 cursor-pointer text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleMemberToggle(uId)}
                              className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                            />
                            <span className="font-medium text-zinc-800">{uName}</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 text-zinc-700">
                            {m.role}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-zinc-200 text-zinc-600 text-xs hover:bg-zinc-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingProject ? (
                    'Save Changes'
                  ) : (
                    'Create Project'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
