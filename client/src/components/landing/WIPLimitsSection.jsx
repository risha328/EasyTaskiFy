import React from 'react';
import { GitPullRequest, AlertTriangle, ShieldCheck, ArrowRight, Gauge, Check } from 'lucide-react';

export const WIPLimitsSection = () => {
  return (
    <section id="wip-limits" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Text */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
            <Gauge className="w-3.5 h-3.5 text-zinc-200" />
            <span>KANBAN VELOCITY CONTROL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Next-generation Kanban: strict WIP limits with zero team friction.
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Prevent work-in-progress bloat and eliminate context switching. Set hard or soft WIP limits on column levels to maintain continuous delivery flow.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 text-xs text-zinc-300">
              <div className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-200 flex items-center justify-center font-bold shrink-0 mt-0.5">✓</div>
              <div>
                <strong className="text-white">Automatic Bottleneck Detection:</strong> Highlights columns exceeding capacity before sprint velocity drops.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-zinc-300">
              <div className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-200 flex items-center justify-center font-bold shrink-0 mt-0.5">✓</div>
              <div>
                <strong className="text-white">Flexible Override Governance:</strong> Engineering Managers can grant temporary WIP limit expansions with audit rationale.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-zinc-300">
              <div className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-200 flex items-center justify-center font-bold shrink-0 mt-0.5">✓</div>
              <div>
                <strong className="text-white">Real-Time Flow Analytics:</strong> Measure cycle time and throughput metrics automatically.
              </div>
            </div>
          </div>
        </div>

        {/* Right UI Card Preview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">In Progress Column Rules</h4>
              <p className="text-[11px] font-mono text-zinc-500">Core Engineering Board</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>3/3 Limit Reached</span>
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <span className="text-zinc-400 font-mono">[FE-102] Implement WebSocket sync</span>
                <p className="text-white font-medium">Assignee: Alex R.</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-800 text-zinc-300">Active</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <span className="text-zinc-400 font-mono">[BE-204] Redis cache keys</span>
                <p className="text-white font-medium">Assignee: Sam K.</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-zinc-800 text-zinc-300">Active</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-rose-950 bg-rose-950/10 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <span className="text-rose-400 font-mono">[BLOCKED] Extra ticket drag blocked</span>
                <p className="text-zinc-400">Resolve active tasks before adding new work.</p>
              </div>
              <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
