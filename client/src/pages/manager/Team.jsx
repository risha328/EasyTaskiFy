import React from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { Users } from 'lucide-react';

export const ManagerTeam = () => {
  const { members } = useOrganization();

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-lato">
      <div className="border-b border-zinc-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-1">
          <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-semibold">
            ENGINEERING SQUAD
          </span>
          <span>• Developer Directory</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
          Squad Members
        </h1>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-700" />
            <span>Assigned Developers</span>
          </h3>
        </div>

        <div className="divide-y divide-zinc-100">
          {members.map((member) => (
            <div key={member.userId || member.email} className="p-4 px-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                  {member.name ? member.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">{member.name || 'User'}</h4>
                  <p className="text-[11px] text-zinc-500 font-mono">{member.email}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
                {member.role || 'MEMBER'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerTeam;
