import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useQuery } from '@tanstack/react-query';
import { fetchHealth } from '../../services/api';

export const MainLayout = () => {
  const { data: healthData, isLoading: isHealthLoading } = useQuery({
    queryKey: ['healthCheck'],
    queryFn: fetchHealth,
    refetchInterval: 15000,
    retry: 2,
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar healthData={healthData} isHealthLoading={isHealthLoading} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet context={{ healthData, isHealthLoading }} />
        </main>
      </div>
    </div>
  );
};
