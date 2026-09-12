import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  LogOut
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { EasyTaskiFyLogo } from '../common/Logo';

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Keep active role path if navigating inside role dashboard
  let currentDashboardPath = '/superadmin/dashboard';
  if (location.pathname.includes('/admin/')) currentDashboardPath = '/admin/dashboard';
  else if (location.pathname.includes('/manager/')) currentDashboardPath = '/manager/dashboard';
  else if (location.pathname.includes('/employee/')) currentDashboardPath = '/employee/dashboard';

  const navigationItems = [
    { name: 'Dashboard', path: currentDashboardPath, icon: LayoutDashboard },
    { name: 'Workspaces', path: '/workspaces', icon: Building2 },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Task Board', path: '/tasks', icon: CheckSquare },
    { name: 'Team & Roles', path: '/team', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ];

  const getInitial = (name) => {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  };

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Logo Header (No underline border) */}
      <div className="h-16 px-6 flex items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <EasyTaskiFyLogo className="h-8" theme="light" textSize="text-2xl" />
        </Link>
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

      {/* User Profile Card & Logout (Replaces Settings) */}
      <div className="p-3 border-t border-zinc-200 bg-zinc-50/50">
        <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* User Initial Circle (Dark Mode Circle matching image) */}
            <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
              {getInitial(user?.name)}
            </div>

            <div className="min-w-0">
              <h4 className="text-xs font-bold text-zinc-900 truncate leading-tight">
                {user?.name || 'Admin User'}
              </h4>
              <p className="text-[10px] text-zinc-500 font-mono truncate">
                {user?.email || 'admin@taskify.com'}
              </p>
            </div>
          </div>

          {/* Logout Action Button */}
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
