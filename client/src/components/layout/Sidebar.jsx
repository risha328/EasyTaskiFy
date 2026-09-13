import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { EasyTaskiFyLogo } from '../common/Logo';

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Dynamic role folder prefix based on user role
  let rolePrefix = '/admin';
  if (user?.role === 'SUPER_ADMIN') rolePrefix = '/superadmin';
  else if (user?.role === 'ADMIN') rolePrefix = '/admin';
  else if (user?.role === 'MANAGER') rolePrefix = '/manager';
  else if (user?.role === 'MEMBER' || user?.role === 'USER') rolePrefix = '/member';

  const navigationItems = [
    { name: 'Dashboard', path: `${rolePrefix}/dashboard`, icon: LayoutDashboard },
    { name: 'Workspaces', path: `${rolePrefix}/workspaces`, icon: Building2 },
    { name: 'Projects', path: `${rolePrefix}/projects`, icon: FolderKanban },
    { name: 'Task Board', path: `${rolePrefix}/tasks`, icon: CheckSquare },
    { name: 'Team & Roles', path: `${rolePrefix}/team`, icon: Users },
    { name: 'Analytics', path: `${rolePrefix}/analytics`, icon: BarChart3 },
  ];

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
                  {user?.name || 'User'}
                </h4>
                <p className="text-[10px] text-zinc-500 font-mono truncate">
                  {user?.email || 'user@taskflow.dev'}
                </p>
              </div>
            </div>

            {/* Logout Action Button */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              title="Sign Out"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-all shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
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
                className="text-zinc-400 hover:text-zinc-700 transition-colors p-1 cursor-pointer"
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
                No
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Yes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
