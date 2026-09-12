import React from 'react';
import { Database, ShieldCheck, Globe, CheckCircle2 } from 'lucide-react';

interface AdminMetricsGridProps {
  totalCount: number;
  subscriptionCount: number;
  openAccessCount: number;
  activeCount: number;
}

export const AdminMetricsGrid: React.FC<AdminMetricsGridProps> = ({
  totalCount,
  subscriptionCount,
  openAccessCount,
  activeCount,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Recursos</p>
          <p className="text-2xl font-black font-display text-slate-900 mt-0.5">{totalCount}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
          <Database className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suscripción URP</p>
          <p className="text-2xl font-black font-display text-[#008744] mt-0.5">{subscriptionCount}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#008744] flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Acceso Abierto</p>
          <p className="text-2xl font-black font-display text-sky-600 mt-0.5">{openAccessCount}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
          <Globe className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activos en Portal</p>
          <p className="text-2xl font-black font-display text-emerald-700 mt-0.5">{activeCount}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
