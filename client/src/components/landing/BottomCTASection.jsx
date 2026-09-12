import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const BottomCTASection = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-10 sm:p-16 text-center space-y-8 overflow-hidden shadow-2xl">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-zinc-800/40 blur-3xl rounded-full pointer-events-none" />

        <div className="space-y-3 relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Build faster, unblock sooner, ship with confidence.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base font-normal">
            Join thousands of high-velocity engineering teams using TaskFlow to manage sprints, enforce WIP limits, and deconstruct specs automatically.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-2">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-white/10"
          >
            <span>Try TaskFlow for free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 text-zinc-200 border border-zinc-800 font-semibold text-sm hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-2"
          >
            <span>Request a live walkthrough</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
