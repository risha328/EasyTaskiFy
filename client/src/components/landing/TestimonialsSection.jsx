import React from 'react';
import { Quote } from 'lucide-react';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "TaskFlow gave our 120-person engineering team the keyboard speed of Linear with the strict multi-tenant governance our security auditors demanded.",
      author: "Marcus Sterling",
      role: "VP of Engineering",
      company: "CloudScale Inc.",
    },
    {
      quote: "The AI Spec Deconstruction engine cut our sprint refinement meetings by half. Writing epics and getting clean Kanban subtasks in seconds is pure magic.",
      author: "Elena Rostova",
      role: "Chief Technology Officer",
      company: "DevOps Prime",
    },
    {
      quote: "Role-based views mean our Superadmins, Org Admins, Managers, and Engineers all get the exact perspective they need without interface noise.",
      author: "Arjun Mehta",
      role: "Principal Lead Architect",
      company: "NextGen FinTech",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">TRUST & TESTIMONIALS</span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Loved by the world's most demanding engineering leaders.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.author}
            className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <Quote className="w-8 h-8 text-zinc-700" />
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                "{t.quote}"
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 font-bold text-xs text-white flex items-center justify-center">
                {t.author.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{t.author}</h4>
                <p className="text-[11px] font-mono text-zinc-400">{t.role} • {t.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
