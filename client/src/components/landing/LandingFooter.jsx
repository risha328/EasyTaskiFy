import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { EasyTaskiFyLogo } from '../common/Logo';

export const LandingFooter = () => {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-400 text-xs py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <EasyTaskiFyLogo className="h-8" textClassName="text-white" />
            </Link>
            <p className="text-zinc-500 max-w-sm leading-relaxed">
              Project management engineered for high-velocity teams. Issue tracking, AI spec breakdown, and multi-tenant role governance.
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Issue Tracking</a></li>
              <li><a href="#ai-specs" className="hover:text-white transition-colors">AI Specs Engine</a></li>
              <li><a href="#wip-limits" className="hover:text-white transition-colors">WIP Limits</a></li>
              <li><a href="#roles" className="hover:text-white transition-colors">Role Governance</a></li>
            </ul>
          </div>

          {/* Role Dashboards Links */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] text-white uppercase tracking-wider">Role Portals</h4>
            <ul className="space-y-2 font-mono text-[11px]">
              <li><Link to="/superadmin/dashboard" className="hover:text-white transition-colors">/superadmin</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-white transition-colors">/admin</Link></li>
              <li><Link to="/manager/dashboard" className="hover:text-white transition-colors">/manager</Link></li>
              <li><Link to="/employee/dashboard" className="hover:text-white transition-colors">/employee</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security & Compliance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} TaskFlow Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-zinc-400">
            <Github className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
            <Twitter className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
            <Linkedin className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};
