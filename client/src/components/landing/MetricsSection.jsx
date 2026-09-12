import React from 'react';

export const MetricsSection = () => {
  const stats = [
    { value: '50ms', label: 'Average search query latency', detail: 'Powered by local indexed DB cache' },
    { value: '3.8x', label: 'Faster planning speed', detail: 'Compared to legacy spreadsheet trackers' },
    { value: '99.99%', label: 'System uptime & SLA', detail: 'Enterprise multi-region availability' },
    { value: '40%', label: 'Saved engineering hours', detail: 'With automated AI epic spec breakdown' },
  ];

  return (
    <section className="py-16 border-y border-zinc-800 bg-zinc-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="space-y-2">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                {s.value}
              </div>
              <div className="text-xs font-semibold text-zinc-300">{s.label}</div>
              <div className="text-[11px] font-mono text-zinc-500">{s.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
