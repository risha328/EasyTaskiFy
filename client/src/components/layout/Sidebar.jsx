import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Bot,
  Container,
  Activity,
  Settings,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderKanban, badge: 'Phase 4' },
  { name: 'Task Board', path: '/tasks', icon: CheckSquare, badge: 'Phase 5' },
  { name: 'Team & Roles', path: '/team', icon: Users, badge: 'Phase 3' },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, badge: 'Phase 8' },
];

const devOpsItems = [
  { name: 'AI Generator', path: '/ai-gen', icon: Bot, badge: 'Phase 17' },
  { name: 'Container Topology', path: '/containers', icon: Container, badge: 'Phase 10' },
  { name: 'System Telemetry', path: '/telemetry', icon: Activity, badge: 'Phase 28' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Logo */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight gradient-text leading-none">TaskFlow</h1>
            <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">DevOps Edition</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Core Product</p>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500 font-mono">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">DevOps & AI Engine</p>
          <nav className="space-y-1">
            {devOpsItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-400 font-mono">
                    {item.badge}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Profile/Settings */}
      <div className="p-3 border-t border-slate-800/80">
        <NavLink
          to="/settings"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4" />
            <span>Settings & Env</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        </NavLink>
      </div>
    </aside>
  );
};
