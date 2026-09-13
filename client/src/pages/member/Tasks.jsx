import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { fetchTasksApi, createTaskApi, updateTaskApi, fetchProjectsApi } from '../../services/api';
import {
  CheckSquare,
  Plus,
  Search,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
  User,
  Filter
} from 'lucide-react';

export const MemberTasks = () => {
  const { activeOrg, members } = useOrganization();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [filterMyTasksOnly, setFilterMyTasksOnly] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('TODO');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [taskProjectId, setTaskProjectId] = useState('');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    if (!activeOrg?.id) return;
    try {
      setIsLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([
        fetchTasksApi(activeOrg.id),
        fetchProjectsApi(activeOrg.id),
      ]);
      if (tasksRes.status === 'success') setTasks(tasksRes.tasks || []);
      if (projectsRes.status === 'success') setProjects(projectsRes.projects || []);
    } catch (err) {
      console.error('Failed to load member tasks:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeOrg]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!taskTitle.trim()) {
      setError('Please provide a task title');
      return;
    }

    try {
      setIsSubmitting(true);
      await createTaskApi({
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        organizationId: activeOrg.id,
        projectId: taskProjectId || null,
        status: taskStatus,
        priority: taskPriority,
        assigneeId: taskAssigneeId || null,
      });

      setSuccess(`Task '${taskTitle}' created successfully.`);
      setTaskTitle('');
      setTaskDescription('');
      setTaskStatus('TODO');
      setTaskPriority('MEDIUM');
      setTaskProjectId('');
      setTaskAssigneeId('');
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskApi(taskId, { status: newStatus });
      await loadData();
    } catch (err) {
      console.error('Failed to update task status:', err.message);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesProject = selectedProjectId === 'ALL' || (t.projectId && (t.projectId._id === selectedProjectId || t.projectId === selectedProjectId));
    const matchesPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;
    return matchesSearch && matchesProject && matchesPriority;
  });

  const columns = [
    { key: 'TODO', label: 'To Do', color: 'bg-blue-50 text-blue-800 border-blue-200', countBg: 'bg-blue-200 text-blue-900' },
    { key: 'IN_PROGRESS', label: 'In Progress', color: 'bg-amber-50 text-amber-800 border-amber-200', countBg: 'bg-amber-200 text-amber-900' },
    { key: 'IN_REVIEW', label: 'In Review', color: 'bg-purple-50 text-purple-800 border-purple-200', countBg: 'bg-purple-200 text-purple-900' },
    { key: 'DONE', label: 'Done', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', countBg: 'bg-emerald-200 text-emerald-900' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-lato">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-semibold">
              MEMBER BOARD
            </span>
            <span>• {activeOrg?.name || 'Workspace'} Task Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            Task Board
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess('')} className="hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-zinc-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Kanban Columns */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.key);
            return (
              <div key={col.key} className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 flex flex-col h-full min-h-[500px]">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${col.color}`}>
                      {col.label}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${col.countBg}`}>
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="py-10 text-center border-2 border-dashed border-zinc-200 rounded-lg text-xs text-zinc-400">
                      No tasks
                    </div>
                  ) : (
                    colTasks.map((t) => (
                      <div
                        key={t._id}
                        className="bg-white rounded-xl p-4 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                t.priority === 'URGENT'
                                  ? 'bg-red-100 text-red-700'
                                  : t.priority === 'HIGH'
                                  ? 'bg-amber-100 text-amber-700'
                                  : t.priority === 'MEDIUM'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-zinc-100 text-zinc-600'
                              }`}
                            >
                              {t.priority}
                            </span>
                            {t.projectId?.name && (
                              <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded truncate max-w-[100px]">
                                {t.projectId.name}
                              </span>
                            )}
                          </div>

                          <h3 className="font-semibold text-sm text-zinc-900 leading-snug mb-1">
                            {t.title}
                          </h3>

                          {t.description && (
                            <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
                              {t.description}
                            </p>
                          )}
                        </div>

                        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-zinc-600">
                            <User className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="text-[11px] truncate max-w-[90px]">
                              {t.assigneeId?.name || 'Unassigned'}
                            </span>
                          </div>

                          {/* Quick Status Selector */}
                          <select
                            value={t.status}
                            onChange={(e) => handleStatusChange(t._id, e.target.value)}
                            className="text-[11px] bg-zinc-50 border border-zinc-200 rounded px-1.5 py-1 text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer"
                          >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="IN_REVIEW">In Review</option>
                            <option value="DONE">Done</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full p-6 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h2 className="text-lg font-bold text-zinc-900">Create New Task</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement login authorization flow"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Details, specs, or task notes..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Project
                  </label>
                  <select
                    value={taskProjectId}
                    onChange={(e) => setTaskProjectId(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="">No Project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Assignee
                  </label>
                  <select
                    value={taskAssigneeId}
                    onChange={(e) => setTaskAssigneeId(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => {
                      const uId = m.userId?._id || m.userId || m.id;
                      const uName = m.name || m.userId?.name || m.email || m.userId?.email || 'User';
                      return (
                        <option key={uId} value={uId}>
                          {uName} ({m.role || 'Member'})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Status
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-600 font-semibold hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
