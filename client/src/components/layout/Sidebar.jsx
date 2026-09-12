import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  SquareTerminal
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Task Board', path: '/tasks', icon: CheckSquare },
  { name: 'Team & Roles', path: '/team', icon: Users },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Logo */}
      <div className="h-16 px-6 flex items-center border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white">
            <SquareTerminal className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-zinc-900 leading-none">TaskFlow</h1>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white font-semibold shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Settings */}
      <div className="p-3 border-t border-zinc-200">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`
          }
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};
