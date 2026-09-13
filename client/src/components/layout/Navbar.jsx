import React, { useState } from 'react';
import { LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'US';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  return (
    <>
      <header className="h-16 border-b border-zinc-200 bg-white sticky top-0 z-30 px-6 flex items-center justify-end">
        {/* User Circular Avatar with Hover Logout */}
        <div className="relative group">
          <button
            onClick={() => setShowLogoutModal(true)}
            title="Logout"
            className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-md transition-all duration-200 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 cursor-pointer"
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

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4 relative text-left">
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
