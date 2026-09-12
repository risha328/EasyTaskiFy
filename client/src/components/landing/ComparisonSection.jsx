import React from 'react';
import { Check, X, Shield, Zap } from 'lucide-react';

export const ComparisonSection = () => {
  const rows = [
    { feature: 'Sub-50ms Query Latency', taskflow: true, jira: false, trello: false },
    { feature: 'AI Epic Spec Deconstruction', taskflow: true, jira: false, trello: false },
    { feature: 'Strict Kanban WIP Enforcement', taskflow: true, jira: true, trello: false },
    { feature: '4-Tier Role Isolation (/superadmin, /admin...)', taskflow: true, jira: false, trello: false },
    { feature: 'Keyboard-First Navigation (⌘K)', taskflow: true, jira: false, trello: false },
    { feature: 'Zero Setup Overhead', taskflow: true, jira: false, trello: true },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">FEATURE COMPARISON</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How TaskFlow stands against traditional alternatives.
        </h2>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-400">
                <th className="p-4 sm:p-5 font-semibold">Capabilities</th>
                <th className="p-4 sm:p-5 text-center font-bold text-white bg-zinc-900 border-x border-zinc-800">
                  TaskFlow 2.0
                </th>
                <th className="p-4 sm:p-5 text-center">Legacy Jira</th>
                <th className="p-4 sm:p-5 text-center">Basic Kanban</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-xs font-medium text-zinc-300">
              {rows.map((r) => (
                <tr key={r.feature} className="hover:bg-zinc-950/40 transition-colors">
                  <td className="p-4 sm:p-5 text-zinc-200 font-semibold">{r.feature}</td>

                  {/* TaskFlow */}
                  <td className="p-4 sm:p-5 text-center bg-zinc-900 border-x border-zinc-800">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </td>

                  {/* Jira */}
                  <td className="p-4 sm:p-5 text-center">
                    {r.jira ? (
                      <Check className="w-4 h-4 text-zinc-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-zinc-600 mx-auto" />
                    )}
                  </td>

                  {/* Trello */}
                  <td className="p-4 sm:p-5 text-center">
                    {r.trello ? (
                      <Check className="w-4 h-4 text-zinc-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-zinc-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
