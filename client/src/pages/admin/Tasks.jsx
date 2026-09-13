import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { fetchTasksApi, createTaskApi, updateTaskApi, deleteTaskApi, fetchProjectsApi } from '../../services/api';
import {
  CheckSquare,
  Plus,
  Search,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
  Trash2,
  User,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react';

export const AdminTasks = () => {
  const { activeOrg, members } = useOrganization();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

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
      console.error('Failed to load tasks data:', err.message);
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

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTaskApi(taskId);
      await loadData();
    } catch (err) {
      console.error('Failed to delete task:', err.message);
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
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-semibold">
              WORKSPACE TASK GOVERNANCE
            </span>
            <span>• {activeOrg?.name || 'Workspace'} Kanban Board</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            Task Board & Kanban
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-zinc-800 shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title..."
            className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Project Selector */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>

          {/* Priority Selector */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">URGENT</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Grid */}
      {isLoading ? (
        <div className="p-12 flex items-center justify-center text-zinc-500 text-xs font-mono gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
          <span>Loading task board...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.key);

            return (
              <div
                key={col.key}
                className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-4 flex flex-col justify-between min-h-[500px]"
              >
                <div className="space-y-4">
                  {/* Column Header */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between font-bold text-xs ${col.color}`}>
                    <span>{col.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${col.countBg}`}>
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Task Cards Stack */}
                  <div className="space-y-3">
                    {colTasks.length === 0 ? (
                      <div className="p-6 text-center text-zinc-400 text-xs font-mono border border-dashed border-zinc-200 rounded-xl">
                        No tasks
                      </div>
                    ) : (
                      colTasks.map((task) => (
                        <div
                          key={task._id}
                          className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs hover:border-zinc-400 transition-all space-y-3 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-zinc-900 leading-snug">{task.title}</h4>
                            <span
                              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                task.priority === 'URGENT'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : task.priority === 'HIGH'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-zinc-100 text-zinc-700'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          {task.description && (
                            <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {task.projectId?.name && (
                            <span className="inline-block text-[9px] font-mono px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-md">
                              📁 {task.projectId.name}
                            </span>
                          )}

                          {/* Footer Info & Move Controller */}
                          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px]">
                            <div className="flex items-center gap-1.5 text-zinc-600 font-mono">
                              <User className="w-3 h-3 text-zinc-400" />
                              <span className="truncate max-w-[90px]">{task.assigneeId?.name || 'Unassigned'}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                className="text-[10px] bg-zinc-50 border border-zinc-200 rounded-md px-1.5 py-0.5 font-mono text-zinc-700"
                              >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="IN_REVIEW">In Review</option>
                                <option value="DONE">Done</option>
                              </select>

                              <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="text-zinc-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 relative">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-zinc-900" />
                <h3 className="text-sm font-bold text-zinc-900">Create New Task</h3>
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

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-800">Task Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Implement Auth JWT Refresh Tokens"
                  required
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-800">Task Description</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Task requirements and acceptance criteria..."
                  rows={3}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-800">Project</label>
                  <select
                    value={taskProjectId}
                    onChange={(e) => setTaskProjectId(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  >
                    <option value="">No Project Assigned</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-800">Assignee</label>
                  <select
                    value={taskAssigneeId}
                    onChange={(e) => setTaskAssigneeId(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.userId || m.email} value={m.userId}>{m.name || m.email}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-800">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-800">Initial Status</label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
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
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
