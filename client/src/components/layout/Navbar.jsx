import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'US';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 border-b border-zinc-200 bg-white sticky top-0 z-30 px-6 flex items-center justify-end">
      {/* User Circular Avatar with Hover Logout */}
      <div className="relative group">
        <button
          onClick={logout}
          title="Logout"
          className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-md transition-all duration-200 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
        >
          {/* User Initials (Default State) */}
          <span className="group-hover:opacity-0 group-hover:scale-75 transition-all duration-200 font-semibold">
            {getInitials(user?.name)}
          </span>

          {/* Logout Icon (Hover State) */}
          <LogOut className="w-4 h-4 absolute opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200" />
        </button>

        {/* Hover Tooltip Dropdown */}
        <div className="absolute right-0 top-full mt-2 hidden group-hover:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold shadow-xl border border-zinc-800 whitespace-nowrap pointer-events-none z-50 transition-all">
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          <span>Logout</span>
        </div>
      </div>
    </header>
  );
};
