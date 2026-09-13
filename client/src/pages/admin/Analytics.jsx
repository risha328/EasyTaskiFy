import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { fetchProjectsApi, fetchTasksApi } from '../../services/api';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
  CheckSquare,
  Users,
  Loader2,
  Calendar,
  ArrowUpRight,
  Filter
} from 'lucide-react';

export const AdminAnalytics = () => {
  const { activeOrg, members } = useOrganization();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30_DAYS');

  const loadAnalyticsData = async () => {
    if (!activeOrg?.id) return;
    try {
      setIsLoading(true);
      const [projectsRes, tasksRes] = await Promise.all([
        fetchProjectsApi(activeOrg.id),
        fetchTasksApi(activeOrg.id),
      ]);
      if (projectsRes.status === 'success') setProjects(projectsRes.projects || []);
      if (tasksRes.status === 'success') setTasks(tasksRes.tasks || []);
    } catch (err) {
      console.error('Failed to load analytics data:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [activeOrg]);

  // Derived Metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length;
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED').length;
  const planningProjects = projects.filter((p) => p.status === 'PLANNING').length;

  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const inReviewTasks = tasks.filter((t) => t.status === 'IN_REVIEW').length;
  const doneTasks = tasks.filter((t) => t.status === 'DONE').length;

  const urgentTasks = tasks.filter((t) => t.priority === 'URGENT').length;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'HIGH').length;
  const mediumPriorityTasks = tasks.filter((t) => t.priority === 'MEDIUM').length;
  const lowPriorityTasks = tasks.filter((t) => t.priority === 'LOW').length;

  const overallCompletionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-lato">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-semibold">
              WORKSPACE METRICS
            </span>
            <span>• {activeOrg?.name || 'Workspace'} Analytics & Reports</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            Analytics Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-xl p-1 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-zinc-500 ml-2" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-zinc-700 focus:outline-none pr-2 cursor-pointer"
            >
              <option value="7_DAYS">Last 7 Days</option>
              <option value="30_DAYS">Last 30 Days</option>
              <option value="90_DAYS">Last 90 Days</option>
              <option value="ALL">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center items-center gap-2 text-zinc-500 text-xs font-mono">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-900" />
          <span>Generating workspace analytics...</span>
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Tasks & Completion */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500 font-bold uppercase">Task Volume</span>
                <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-zinc-900">{totalTasks}</p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{overallCompletionRate}% Completion Rate</span>
                </div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500 font-bold uppercase">Tasks Delivered</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-zinc-900">{doneTasks}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {inProgressTasks} currently in progress
                </p>
              </div>
            </div>

            {/* Active Projects */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500 uppercase font-bold">Projects Portfolio</span>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                  <FolderKanban className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-zinc-900">{totalProjects}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {activeProjects} Active • {planningProjects} Planning
                </p>
              </div>
            </div>

            {/* Urgent Items */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500 uppercase font-bold">Urgent Priority</span>
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-rose-600">{urgentTasks}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {highPriorityTasks} High Priority Items
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Status Distribution */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-zinc-900" />
                  <h2 className="text-sm font-bold text-zinc-900">Task Status Distribution</h2>
                </div>
                <span className="text-xs font-mono text-zinc-400">{totalTasks} Total Tasks</span>
              </div>

              <div className="space-y-4">
                {/* To Do */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-blue-700 font-semibold">To Do</span>
                    <span className="text-zinc-600">{todoTasks} ({totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${totalTasks > 0 ? (todoTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* In Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-amber-700 font-semibold">In Progress</span>
                    <span className="text-zinc-600">{inProgressTasks} ({totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* In Review */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-purple-700 font-semibold">In Review</span>
                    <span className="text-zinc-600">{inReviewTasks} ({totalTasks > 0 ? Math.round((inReviewTasks / totalTasks) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${totalTasks > 0 ? (inReviewTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Done */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-emerald-700 font-semibold">Completed (Done)</span>
                    <span className="text-zinc-600">{doneTasks} ({totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Task Priority Spectrum */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-zinc-900" />
                  <h2 className="text-sm font-bold text-zinc-900">Task Priority Breakdown</h2>
                </div>
                <span className="text-xs font-mono text-zinc-400">Risk Allocation</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                  <p className="text-[11px] font-mono text-rose-700 uppercase font-bold">Urgent</p>
                  <p className="text-2xl font-extrabold text-rose-900">{urgentTasks}</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                  <p className="text-[11px] font-mono text-amber-700 uppercase font-bold">High</p>
                  <p className="text-2xl font-extrabold text-amber-900">{highPriorityTasks}</p>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                  <p className="text-[11px] font-mono text-blue-700 uppercase font-bold">Medium</p>
                  <p className="text-2xl font-extrabold text-blue-900">{mediumPriorityTasks}</p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-100 border border-zinc-200 space-y-1">
                  <p className="text-[11px] font-mono text-zinc-600 uppercase font-bold">Low</p>
                  <p className="text-2xl font-extrabold text-zinc-900">{lowPriorityTasks}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Project Progress Overview Table */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-zinc-900" />
                <h2 className="text-sm font-bold text-zinc-900">Project Progress Overview</h2>
              </div>
              <span className="text-xs font-mono text-zinc-400">{projects.length} Active Projects</span>
            </div>

            {projects.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No project metrics available.</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {projects.map((project) => {
                  const pct = project.totalTasks > 0 ? Math.round((project.completedTasks / project.totalTasks) * 100) : 0;
                  return (
                    <div key={project._id} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-xs text-zinc-900 truncate">{project.name}</h3>
                          <span
                            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
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
                        <p className="text-[11px] text-zinc-500 font-mono">
                          Manager: {project.managerId?.name || 'Unassigned'} • Members: {project.members?.length || 0}
                        </p>
                      </div>

                      <div className="w-full md:w-64 space-y-1">
                        <div className="flex justify-between text-xs font-mono text-zinc-600">
                          <span>{project.completedTasks}/{project.totalTasks} Tasks</span>
                          <span className="font-bold">{pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-zinc-900 rounded-full transition-all duration-300"
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
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
