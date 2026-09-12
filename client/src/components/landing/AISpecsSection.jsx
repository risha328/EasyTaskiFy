import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Code, Bot, FileText, CheckSquare } from 'lucide-react';

export const AISpecsSection = () => {
  const [deconstructing, setDeconstructing] = useState(false);
  const [deconstructed, setDeconstructed] = useState(true);

  const samplePrompt = `Epic: Implement One-Click Multi-Region Database Failover with Zero Data Loss.
Requirements:
1. Healthcheck heartbeat daemon every 5 seconds.
2. Read-replica promotion script with automated DNS switcher.
3. Slack alert notification on failover event.`;

  return (
    <section id="ai-specs" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-8 sm:p-12 space-y-10">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300">
            <Bot className="w-3.5 h-3.5 text-zinc-100" />
            <span>AI SPECIFICATION ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Stop writing manual specs. Let AI deconstruct epics in seconds.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Paste high-level PRD requirements or user stories. TaskFlow's AI engine automatically extracts technical subtasks, acceptance criteria, and estimation points directly into your backlog.
          </p>
        </div>

        {/* Demo Playground Split Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input Editor */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <FileText className="w-4 h-4 text-zinc-300" />
                <span>EPIC_INPUT.md</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Markdown Format</span>
            </div>

            <textarea
              readOnly
              value={samplePrompt}
              rows={6}
              className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 text-xs font-mono text-zinc-300 focus:outline-none cursor-default resize-none"
            />

            <button
              onClick={() => {
                setDeconstructing(true);
                setTimeout(() => {
                  setDeconstructing(false);
                  setDeconstructed(true);
                }, 800);
              }}
              className="w-full py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{deconstructing ? 'Deconstructing Specs...' : 'Auto-Deconstruct Epic with AI'}</span>
            </button>
          </div>

          {/* Right: Deconstructed Output */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-semibold">Generated Backlog Issues (3)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                READY FOR SPRINT
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="text-zinc-300 font-bold">[BE-501] Heartbeat Daemon</span>
                  <span className="text-zinc-500">3 Story Pts</span>
                </div>
                <p className="text-xs text-zinc-300">Implement Go heartbeat checker polling primary DB node every 5s</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="text-zinc-300 font-bold">[INFRA-102] DNS Route53 Switcher</span>
                  <span className="text-zinc-500">5 Story Pts</span>
                </div>
                <p className="text-xs text-zinc-300">Automated DNS CNAME TTL update script to point to read-replica</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="text-zinc-300 font-bold">[OPS-88] Failover Slack Bot</span>
                  <span className="text-zinc-500">2 Story Pts</span>
                </div>
                <p className="text-xs text-zinc-300">Post high-priority incident webhook to #engineering-alerts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
