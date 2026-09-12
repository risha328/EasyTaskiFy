import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  ShieldCheck,
  User,
  Key
} from 'lucide-react';

export const Dashboard = () => {
  const { healthData, isHealthLoading } = useOutletContext();
  const { user } = useAuth();

  const phaseChecklist = [
    { id: 1, text: 'Monorepo Architecture Baseline', completed: true },
    { id: 2, text: 'Express API Server & MongoDB Connection', completed: true },
    { id: 3, text: 'User Mongoose Model with bcrypt Hashing', completed: true },
    { id: 4, text: 'JWT Token Generation & Expiration', completed: true },
    { id: 5, text: 'Protected Middleware (/api/auth/me)', completed: true },
    { id: 6, text: 'AuthContext & High-Contrast Black/White UI', completed: true },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
            <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-semibold">
              SYSTEM ACTIVE
            </span>
            <span>• Authentication & DevOps Platform</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            TaskFlow Control Dashboard
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Welcome back, <span className="text-zinc-900 font-semibold">{user?.name}</span> ({user?.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-medium shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh State</span>
          </button>
        </div>
      </div>

      {/* Telemetry Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* User Auth Profile Card */}
        <div className="p-5 rounded-xl bw-card relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Authenticated User</span>
            <User className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-lg font-bold text-zinc-900 truncate max-w-[150px]">{user?.name || 'User'}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-800 font-medium uppercase">
              {user?.role || 'USER'}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 font-mono truncate">{user?.email}</p>
        </div>

        {/* MongoDB Connection Status */}
        <div className="p-5 rounded-xl bw-card relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">MongoDB Database</span>
            <Database className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-bold text-zinc-900 uppercase">
              {isHealthLoading ? 'Checking...' : healthData?.dbStatus || 'Disconnected'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-white font-medium">
              Atlas Cloud
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 font-mono truncate">
            {healthData?.dbStatus === 'connected' ? 'Atlas Cluster Connected' : 'Connecting to Cloud...'}
          </p>
        </div>

        {/* Auth Strategy */}
        <div className="p-5 rounded-xl bw-card relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Auth Engine</span>
            <Key className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-bold text-zinc-900">JWT + Bcrypt</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-800 font-medium">
              Bearer Token
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 font-mono truncate">
            Session Expire: 7 Days
          </p>
        </div>

        {/* Server Health */}
        <div className="p-5 rounded-xl bw-card relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Server Health</span>
            <Server className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-bold text-zinc-900">
              {isHealthLoading ? 'Loading...' : healthData?.status === 'ok' ? '200 OK' : 'Offline'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-800 font-medium">
              Port 5000
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 font-mono truncate">
            Uptime: {healthData?.uptime ? `${Math.floor(healthData.uptime)}s` : '0s'}
          </p>
        </div>
      </div>

      {/* Main Content Split: Milestone Checklist & User Session Context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Milestone Checklist */}
        <div className="lg:col-span-2 p-6 rounded-xl bw-panel space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-zinc-900" />
              <h2 className="text-lg font-semibold text-zinc-900">System Infrastructure Checklist</h2>
            </div>
            <span className="text-xs font-mono text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-full border border-zinc-300 font-semibold">
              Completed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {phaseChecklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 hover:border-zinc-400 transition-all"
              >
                <CheckCircle2 className="w-5 h-5 text-zinc-900 shrink-0" />
                <span className="text-xs text-zinc-800 font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 rounded-lg bg-zinc-900 text-white flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-zinc-300 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-200 space-y-1">
              <p className="font-semibold text-white">Monochrome High-Contrast Theme Active</p>
              <p className="text-zinc-300 leading-relaxed">
                Clean black & white theme styling applied across all layout shells, navbar, sidebar, forms, and control dashboard cards.
              </p>
            </div>
          </div>
        </div>

        {/* User Context Viewer */}
        <div className="p-6 rounded-xl bw-panel flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
                <Terminal className="w-4 h-4 text-zinc-700" />
                <span>Active User Context (`/api/auth/me`)</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">JSON Payload</span>
            </div>

            <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-100 overflow-x-auto">
              <pre>
                {JSON.stringify(
                  user || {
                    status: 'unauthenticated',
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-zinc-500 flex items-center justify-between border-t border-zinc-200">
            <span>Protected Route Active</span>
            <a
              href="http://localhost:5000/api/auth/me"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-900 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Verify /me API</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
