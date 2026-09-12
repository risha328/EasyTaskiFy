import React from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { Building2, Check, ArrowRight } from 'lucide-react';

export const MemberWorkspaces = () => {
  const { organizations, activeOrg, switchOrganization } = useOrganization();

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-lato">
      <div className="border-b border-zinc-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-semibold">
            MEMBER WORKSPACES
          </span>
          <span>• Joined Orgs</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
          My Workspaces
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {organizations.map((org) => {
          const isActive = activeOrg?.id === org.id;

          return (
            <div key={org.id} className={`p-6 rounded-2xl border transition-all space-y-4 flex flex-col justify-between ${isActive ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl' : 'bg-white text-zinc-900 border-zinc-200 shadow-sm'}`}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${isActive ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'}`}>
                    {org.name ? org.name[0].toUpperCase() : 'W'}
                  </div>
                  <div>
                    <h3 className="font-bold text-base">{org.name}</h3>
                    <p className={`text-[11px] font-mono ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      Role: {org.role || 'MEMBER'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                {isActive ? (
                  <button disabled className="w-full py-2.5 rounded-xl bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Active Workspace</span>
                  </button>
                ) : (
                  <button onClick={() => switchOrganization(org.id)} className="w-full py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold flex items-center justify-center gap-2">
                    <span>Switch Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberWorkspaces;
