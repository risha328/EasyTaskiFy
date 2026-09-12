import React from 'react';
import { Bell, Search, Activity, Sparkles, User, ShieldCheck } from 'lucide-react';

export const Navbar = ({ healthData, isHealthLoading }) => {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-72 md:w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, tasks, or AI actions... (Ctrl + K)"
            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all"
          />
        </div>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-4">
        {/* System Health Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <div className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                healthData?.status === 'ok' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                healthData?.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
          </div>
          <span className="text-slate-400 font-medium">API:</span>
          <span
            className={`font-semibold ${
              healthData?.status === 'ok' ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {isHealthLoading ? 'Checking...' : healthData?.status === 'ok' ? 'Healthy' : 'Connecting'}
          </span>
          {healthData?.dbStatus && (
            <span className="text-slate-500 text-[10px] uppercase font-mono border-l border-slate-800 pl-2">
              DB: {healthData.dbStatus}
            </span>
          )}
        </div>

        {/* AI Quick Button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-medium shadow-md shadow-indigo-500/10 transition-all">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Assist</span>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-xs font-bold text-indigo-400">
              AD
            </div>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-tight">DevOps Admin</p>
            <p className="text-[10px] text-slate-400">Owner & Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};
