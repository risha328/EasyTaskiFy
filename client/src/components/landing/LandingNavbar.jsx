import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SquareTerminal, ArrowRight, Menu, X, ChevronDown, Shield, UserCheck, Users, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import { EasyTaskiFyLogo } from '../common/Logo';

export const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const roleLinks = [
    { name: 'Superadmin Dashboard', path: '/superadmin/dashboard', icon: Shield, badge: 'Full Access' },
    { name: 'Workspace Admin', path: '/admin/dashboard', icon: UserCheck, badge: 'Org Manager' },
    { name: 'Engineering Manager', path: '/manager/dashboard', icon: Briefcase, badge: 'Sprint Lead' },
    { name: 'Team Employee', path: '/employee/dashboard', icon: Users, badge: 'Contributor' },
  ];

  return (
    <nav className="w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <EasyTaskiFyLogo className="h-8" textClassName="text-white" />
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#ai-specs" className="hover:text-white transition-colors">AI Specs</a>
          <a href="#wip-limits" className="hover:text-white transition-colors">WIP Limits</a>
          <a href="#roles" className="hover:text-white transition-colors">Role Views</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          
          {/* Quick Role Dashboards Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              onBlur={() => setTimeout(() => setRoleDropdownOpen(false), 200)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:text-white text-xs font-medium transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
              <span>Role Dashboards</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-1.5 z-50 space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Direct Role Access
                </div>
                {roleLinks.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.path}
                      onClick={() => navigate(role.path)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{role.name}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {role.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Auth & CTA Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to="/superadmin/dashboard"
              className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10"
              >
                <span>Try TaskFlow Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-2 pb-6 space-y-3">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-300">Features</a>
          <a href="#ai-specs" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-300">AI Specs</a>
          <a href="#wip-limits" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-300">WIP Limits</a>
          <a href="#roles" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-zinc-300">Role Views</a>
          
          <div className="pt-2 border-t border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Role Dashboards</span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link to="/superadmin/dashboard" className="p-2 rounded bg-zinc-900 text-xs text-zinc-300 font-mono">/superadmin</Link>
              <Link to="/admin/dashboard" className="p-2 rounded bg-zinc-900 text-xs text-zinc-300 font-mono">/admin</Link>
              <Link to="/manager/dashboard" className="p-2 rounded bg-zinc-900 text-xs text-zinc-300 font-mono">/manager</Link>
              <Link to="/employee/dashboard" className="p-2 rounded bg-zinc-900 text-xs text-zinc-300 font-mono">/employee</Link>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
            <Link to="/login" className="w-full py-2 rounded-xl text-center border border-zinc-800 text-zinc-300 text-xs font-semibold">Sign In</Link>
            <Link to="/register" className="w-full py-2 rounded-xl text-center bg-white text-zinc-950 text-xs font-semibold">Try TaskFlow Free</Link>
          </div>
        </div>
      )}
    </nav>
  );
};
