import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Terminal, Zap, Shield, GitPullRequest } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto space-y-8">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-800/30 blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Release Announcement Pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 hover:border-zinc-700 transition-all cursor-pointer shadow-xl">
        <Sparkles className="w-3.5 h-3.5 text-zinc-100 animate-pulse" />
        <span className="text-zinc-100 font-semibold">Introducing EasyTaskiFy 2.0</span>
        <span className="text-zinc-500">•</span>
        <span className="text-zinc-400">AI Specs Engine</span>
        <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
      </div>

      {/* Main Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
        Project management engineered for high-velocity teams.
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
        EasyTaskiFy integrates issue tracking, sprint planning, strict WIP limits, and AI spec breakdown into a unified platform built for speed and engineering precision.
      </p>

      {/* Action CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          to="/register"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-white/10"
        >
          <span>Try EasyTaskiFy for free</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/dashboard"
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900 text-zinc-200 border border-zinc-800 font-semibold text-sm hover:bg-zinc-850 hover:border-zinc-700 transition-all flex items-center justify-center gap-2"
        >
          <Terminal className="w-4 h-4 text-zinc-400" />
          <span>Request a live walkthrough</span>
        </Link>
      </div>

      {/* Feature Badges */}
      <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-zinc-400" />
          <span>Sub-50ms Global Query Latency</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-zinc-400" />
          <span>4-Tier Role Governance</span>
        </div>
        <div className="flex items-center gap-2">
          <GitPullRequest className="w-3.5 h-3.5 text-zinc-400" />
          <span>Strict WIP Enforcement</span>
        </div>
      </div>
    </section>
  );
};
