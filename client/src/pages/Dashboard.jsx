import React from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  CheckCircle2,
  Server,
  Database,
  Globe,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Zap,
  Terminal,
  Clock,
  ShieldAlert
} from 'lucide-react';

export const Dashboard = () => {
  const { healthData, isHealthLoading } = useOutletContext();

  const phaseChecklist = [
    { id: 1, text: 'Monorepo Root Setup & Config', completed: true },
    { id: 2, text: 'Express API Server on Port 5000', completed: true },
    { id: 3, text: 'Mongoose Connection with Retry Logic', completed: true },
    { id: 4, text: 'Health Check API (/api/health)', completed: true },
    { id: 5, text: 'Vite + React Client with Tailwind CSS', completed: true },
    { id: 6, text: 'Base Layout (Navbar, Sidebar, Main Shell)', completed: true },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 font-semibold">
              PHASE 1 IN PRODUCTION
            </span>
            <span>• Architecture Baseline</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            TaskFlow System Control Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Progressive Evolution Engine — Foundation & Infrastructure Health
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh State</span>
          </button>
        </div>
      </div>

      {/* System Telemetry Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Backend Server Status */}
        <div className="p-5 rounded-xl glass-card relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Backend Server</span>
            <Server className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-bold text-white">
              {isHealthLoading ? 'Loading...' : healthData?.status === 'ok' ? '200 OK' : 'Offline'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
              Port 5000
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono truncate">
            {healthData?.service || 'TaskFlow Express API'}
          </p>
        </div>

        {/* MongoDB Connection Status */}
        <div className="p-5 rounded-xl glass-card relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">MongoDB Database</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-bold text-white uppercase">
              {isHealthLoading ? 'Checking...' : healthData?.dbStatus || 'Disconnected'}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium border ${
                healthData?.dbStatus === 'connected'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}
            >
              Port 27017
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono truncate">
            {healthData?.dbStatus === 'connected' ? 'Handshake Established' : 'Standalone Mode Active'}
          </p>
        </div>

        {/* Client App */}
        <div className="p-5 rounded-xl glass-card relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Frontend Client</span>
            <Globe className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-bold text-white">Vite React</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-medium">
              Port 5173
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono truncate">
            Tailwind CSS v4 Enabled
          </p>
        </div>

        {/* Uptime */}
        <div className="p-5 rounded-xl glass-card relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Server Uptime</span>
            <Clock className="w-4 h-4 text-pink-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-bold text-white">
              {healthData?.uptime ? `${Math.floor(healthData.uptime)}s` : '0s'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 font-medium">
              Live
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-mono truncate">
            Env: {healthData?.environment || 'development'}
          </p>
        </div>
      </div>

      {/* Main Content Split: Checklist & Terminal Payload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phase 1 Completion Checklist */}
        <div className="lg:col-span-2 p-6 rounded-xl glass-panel border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Phase 1 Milestone Checklist</h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
              100% Completed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {phaseChecklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-200 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-lg bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-3">
            <Zap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-indigo-300">Phase 1 Infrastructure Active</p>
              <p className="text-slate-400 leading-relaxed">
                The folder structure has been cleanly separated into <code className="text-indigo-400 bg-slate-900 px-1 py-0.5 rounded">/server</code> and <code className="text-indigo-400 bg-slate-900 px-1 py-0.5 rounded">/client</code>. All baseline components, routes, and error handling are live and ready for Phase 2 (Authentication & User Management).
              </p>
            </div>
          </div>
        </div>

        {/* Live Payload Viewer */}
        <div className="p-6 rounded-xl glass-panel border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>Live `/api/health` Payload</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">JSON Response</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-900 font-mono text-xs text-emerald-400 overflow-x-auto">
              <pre>
                {JSON.stringify(
                  healthData || {
                    status: 'connecting',
                    service: 'TaskFlow API Server',
                    timestamp: new Date().toISOString(),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800/50">
            <span>Polling every 15s</span>
            <a
              href="http://localhost:5000/api/health"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <span>Open Endpoint</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
