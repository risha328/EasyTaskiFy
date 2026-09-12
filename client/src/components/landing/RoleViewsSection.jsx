import React from 'react';
import { User, Briefcase, Shield, CheckCircle2 } from 'lucide-react';

export const RoleViewsSection = () => {
  const roles = [
    {
      title: 'Individual Contributors',
      roleKey: 'EMPLOYEE',
      icon: User,
      desc: 'Distraction-free personal task backlog, instant keyboard shortcuts, and seamless Git branch updates.',
      bullets: [
        'Personal My Work view',
        'Sub-50ms global issue search',
        'Automatic Git PR linking',
      ],
    },
    {
      title: 'Engineering Managers',
      roleKey: 'MANAGER',
      icon: Briefcase,
      desc: 'Sprint planning board, WIP capacity limits, automated triage, and team velocity metrics.',
      bullets: [
        'Interactive Kanban sprint planner',
        'WIP limit threshold enforcement',
        'Velocity and burndown analytics',
      ],
    },
    {
      title: 'Executives & Admins',
      roleKey: 'SUPER_ADMIN',
      icon: Shield,
      desc: 'Multi-tenant organization management, system-wide security, SAML SSO, and audit compliance.',
      bullets: [
        'Workspace creation & admin assignment',
        'Multi-tenant audit log stream',
        'Global role RBAC management',
      ],
    },
  ];

  return (
    <section id="roles" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">ROLE-BASED DESIGN SYSTEM</span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Tailored interfaces. One unified source of truth.
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base">
          Whether you are a Superadmin configuring workspaces or a developer picking up your next task, TaskFlow adapts to your role.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <div
              key={role.title}
              className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all space-y-6 group"
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">{role.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{role.desc}</p>
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-2">
                {role.bullets.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
