import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  LogOut,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { EasyTaskiFyLogo } from '../common/Logo';

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('taskflow_sidebar_collapsed') === 'true';
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('taskflow_sidebar_collapsed', isCollapsed);
  }, [isCollapsed]);

  // Dynamic role folder prefix & tailored navigation links per role
  let rolePrefix = '/admin';
  let navigationItems = [];

  if (user?.role === 'SUPER_ADMIN') {
    rolePrefix = '/superadmin';
    navigationItems = [
      { name: 'System Dashboard', path: '/superadmin/dashboard', icon: LayoutDashboard },
      { name: 'Workspaces Directory', path: '/superadmin/workspaces', icon: Building2 },
      { name: 'System Team & Roles', path: '/superadmin/team', icon: Users },
      { name: 'Global Projects', path: '/superadmin/projects', icon: FolderKanban },
      { name: 'Audit & Analytics', path: '/superadmin/analytics', icon: BarChart3 },
    ];
  } else if (user?.role === 'ADMIN') {
    rolePrefix = '/admin';
    navigationItems = [
      { name: 'Workspace Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'My Workspace', path: '/admin/workspaces', icon: Building2 },
      { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
      { name: 'Task Board', path: '/admin/tasks', icon: CheckSquare },
      { name: 'Team & Roles', path: '/admin/team', icon: Users },
      { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    ];
  } else if (user?.role === 'MANAGER') {
    rolePrefix = '/manager';
    navigationItems = [
      { name: 'Manager Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
      { name: 'My Projects', path: '/manager/projects', icon: FolderKanban },
      { name: 'Kanban Task Board', path: '/manager/tasks', icon: CheckSquare },
      { name: 'Project Team', path: '/manager/team', icon: Users },
      { name: 'Team Analytics', path: '/manager/analytics', icon: BarChart3 },
    ];
  } else {
    rolePrefix = '/member';
    navigationItems = [
      { name: 'My Dashboard', path: '/member/dashboard', icon: LayoutDashboard },
      { name: 'My Task Board', path: '/member/tasks', icon: CheckSquare },
      { name: 'Assigned Projects', path: '/member/projects', icon: FolderKanban },
      { name: 'Team & Activity', path: '/member/team', icon: Users },
    ];
  }

  const getInitial = (name) => {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  return (
    <>
      <aside
        className={`bg-white border-r border-zinc-200 flex flex-col h-screen sticky top-0 shrink-0 select-none transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Logo Header & Toggle Button */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-100">
          {!isCollapsed ? (
            <Link to="/" className="flex items-center gap-2 overflow-hidden truncate">
              <EasyTaskiFyLogo className="h-7" theme="light" textSize="text-xl" />
            </Link>
          ) : (
            <Link to="/" className="mx-auto flex items-center justify-center p-1 hover:opacity-80 transition-opacity" title="EasyTaskiFy">
              <EasyTaskiFyLogo className="h-7" showText={false} theme="light" />
            </Link>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer shrink-0"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Navigation Links */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4">
          <nav className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  title={isCollapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
                    } ${
                      isActive
                        ? 'bg-zinc-900 text-white font-semibold shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                    }`
                  }
                >
                  <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} shrink-0`} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card & Logout */}
        <div className="p-2.5 border-t border-zinc-200 bg-zinc-50/50">
          {!isCollapsed ? (
            <div className="p-2.5 rounded-xl bg-white border border-zinc-200 flex items-center justify-between gap-2.5 shadow-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                  {getInitial(user?.name)}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-zinc-900 truncate leading-tight">
                    {user?.name || 'User'}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-mono truncate">
                    {user?.email || 'user@taskflow.dev'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                title="Sign Out"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <div
                className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shadow-md"
                title={`${user?.name || 'User'} (${user?.email})`}
              >
                {getInitial(user?.name)}
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                title="Sign Out"
                className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4 relative">
            <div className="flex items-start justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-900">Confirm Logout</h3>
                <p className="text-xs text-zinc-500">Are you sure you want to sign out?</p>
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 text-xs font-semibold hover:bg-zinc-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-md transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
