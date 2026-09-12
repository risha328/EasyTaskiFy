import React from 'react';
import { Cpu, Globe, Server, Layers, ShieldCheck } from 'lucide-react';

export const LogosBanner = () => {
  const brands = [
    { name: 'Linear', icon: Layers },
    { name: 'Vercel', icon: Globe },
    { name: 'Supabase', icon: Server },
    { name: 'Cloudflare', icon: Cpu },
    { name: 'Stripe', icon: ShieldCheck },
  ];

  return (
    <section className="border-y border-zinc-800/80 bg-zinc-950/60 py-10">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
        <p className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
          POWERING HIGH-PERFORMANCE ENGINEERING TEAMS AT
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-60 hover:opacity-100 transition-opacity">
          {brands.map((brand) => {
            const Icon = brand.icon;
            return (
              <div key={brand.name} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                <Icon className="w-5 h-5 text-zinc-300" />
                <span className="font-bold tracking-tight text-sm text-zinc-200">{brand.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
