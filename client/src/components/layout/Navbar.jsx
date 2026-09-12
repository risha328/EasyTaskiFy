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
      {/* User Circular Avatar & Logout Only */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
          {getInitials(user?.name)}
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-zinc-900 leading-tight">{user?.name || 'User'}</p>
          <p className="text-[10px] text-zinc-500 font-mono">{user?.role || 'USER'}</p>
        </div>

        <button
          onClick={logout}
          title="Sign Out"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white text-zinc-700 text-xs font-medium transition-all ml-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
