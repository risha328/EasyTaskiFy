import React from 'react';
import { Zap, Shield, Sliders, CheckCircle2, ArrowRight } from 'lucide-react';

export const ValuePropsSection = () => {
  const cards = [
    {
      title: 'Linear Speed',
      description: 'Sub-50ms query responses with keyboard-first navigation and instant local-first sync.',
      icon: Zap,
      badge: 'Core Performance',
      bullets: [
        'Instant keyboard shortcuts (⌘K / ⌘J)',
        'Optimistic client state updates',
        'Sub-50ms global query latency',
      ],
    },
    {
      title: 'Enterprise Governance',
      description: 'Granular multi-tenant RBAC with 4-tier role separation, SSO integration, and audit trails.',
      icon: Shield,
      badge: 'Security & Compliance',
      bullets: [
        '4-Tier system & org role hierarchy',
        'SAML SSO & OAuth2 single sign-on',
        'Immutable activity audit logging',
      ],
    },
    {
      title: 'Config Flexibility',
      description: 'Tailor workflows, WIP thresholds, and automated triage rules per engineering squad.',
      icon: Sliders,
      badge: 'Workflow Customization',
      bullets: [
        'Strict WIP limits per column',
        'Custom status & workflow pipelines',
        'Webhook & API integrations',
      ],
    },
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">ENGINEERED FOR EXCELLENCE</span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Why settle for compromise? All three strengths in one single core.
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base">
          TaskFlow eliminates the trade-off between lightweight dev speed and heavy enterprise governance.
        </p>
      </div>

      {/* 3-Column Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-6 group hover:shadow-2xl hover:shadow-white/5"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-zinc-100" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{card.badge}</span>
                  <h3 className="text-xl font-bold text-white tracking-tight">{card.title}</h3>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">{card.description}</p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 space-y-2">
                {card.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{bullet}</span>
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
