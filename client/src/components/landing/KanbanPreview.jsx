import React, { useState } from 'react';
import { Search, Filter, Plus, CheckCircle2, AlertCircle, Clock, Sparkles, User, Layers, ArrowUpRight } from 'lucide-react';

export const KanbanPreview = () => {
  const [activeFilter, setActiveFilter] = useState('All Tasks');

  const kanbanColumns = [
    {
      id: 'in-progress',
      title: 'IN PROGRESS',
      count: 3,
      tasks: [
        {
          id: 'FE-102',
          title: 'Implement WebSocket real-time state sync',
          tag: 'High Priority',
          tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          assignee: 'Alex R.',
          estimate: '3 pts',
        },
        {
          id: 'BE-204',
          title: 'Optimize Redis multi-tenant cache keys',
          tag: 'Performance',
          tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          assignee: 'Sam K.',
          estimate: '5 pts',
        },
      ],
    },
    {
      id: 'review',
      title: 'REVIEW',
      count: 2,
      tasks: [
        {
          id: 'BE-401',
          title: 'Refactor database connection pooling schema',
          tag: 'Backend',
          tagColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          assignee: 'David M.',
          estimate: '2 pts',
        },
        {
          id: 'UI-88',
          title: 'Design glassmorphic task board themes',
          tag: 'Design Core',
          tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          assignee: 'Elena T.',
          estimate: '3 pts',
        },
      ],
    },
    {
      id: 'in-qa',
      title: 'IN QA',
      count: 2,
      tasks: [
        {
          id: 'AI-12',
          title: 'Auto-deconstruct epic specs with AI parser',
          tag: 'AI Core',
          tagColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
          assignee: 'AI Agent',
          estimate: '8 pts',
        },
      ],
    },
    {
      id: 'done',
      title: 'DONE',
      count: 4,
      tasks: [
        {
          id: 'SEC-88',
          title: 'Multi-tenant role authentication middleware',
          tag: 'Security',
          tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          assignee: 'Marcus B.',
          estimate: '5 pts',
        },
        {
          id: 'SYS-01',
          title: 'Set up Docker multi-stage CI pipeline',
          tag: 'DevOps',
          tagColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
          assignee: 'Risha M.',
          estimate: '3 pts',
        },
      ],
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-20">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Mock Top Control Bar */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-950/70 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
              <Layers className="w-4 h-4 text-zinc-200" />
              <span className="font-bold text-white">Sprint 42</span>
              <span className="text-zinc-600">•</span>
              <span>Active WIP (7/10)</span>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
              {['All Tasks', 'My Items', 'AI Generated'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activeFilter === tab
                      ? 'bg-zinc-800 text-white font-medium'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                readOnly
                placeholder="Filter tasks... (⌘K)"
                className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded-lg pl-8 pr-3 py-1.5 w-40 sm:w-56 focus:outline-none cursor-default"
              />
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all">
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Issue</span>
            </button>
          </div>
        </div>

        {/* Kanban Columns Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-zinc-950/40 min-h-[360px]">
          {kanbanColumns.map((col) => (
            <div
              key={col.id}
              className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1 text-xs font-mono">
                <span className="text-zinc-400 font-semibold tracking-wider">{col.title}</span>
                <span className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700/80 text-zinc-300 flex items-center justify-center font-bold text-[10px]">
                  {col.count}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5 flex-1">
                {col.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer space-y-2 group shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">
                        {task.id}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${task.tagColor}`}
                      >
                        {task.tag}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-zinc-200 group-hover:text-white leading-snug">
                      {task.title}
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                      <div className="flex items-center gap-1 text-zinc-400">
                        <User className="w-3 h-3 text-zinc-500" />
                        <span>{task.assignee}</span>
                      </div>
                      <span className="text-zinc-500">{task.estimate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
