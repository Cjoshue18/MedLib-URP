import React from 'react';
import { ConferenceReport } from '../../types';


interface ConferenceReportSummaryCardsProps {
  report: ConferenceReport;
  pctAsistencia: number;
}

export const ConferenceReportSummaryCards: React.FC<ConferenceReportSummaryCardsProps> = ({
  report,
  pctAsistencia,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-[10px] font-black uppercase text-slate-500 block">Total Pre-inscritos</span>
        <p className="text-2xl font-display font-black text-slate-900 mt-1">{report.totalInscritos}</p>
        <span className="text-[10px] font-semibold text-blue-600 block mt-0.5">Formulario previo</span>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-[10px] font-black uppercase text-slate-500 block">Total Asistentes</span>
        <p className="text-2xl font-display font-black text-slate-900 mt-1">{report.totalAsistentes}</p>
        <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">Marcaciones Registradas</span>
      </div>

      <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-xs">
        <span className="text-[10px] font-black uppercase text-emerald-800 block">Acreditados (Oficial)</span>
        <p className="text-2xl font-display font-black text-emerald-900 mt-1">{report.totalAcreditados}</p>
        <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">Inscritos + Asistieron</span>
      </div>

      <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-xs">
        <span className="text-[10px] font-black uppercase text-amber-800 block">Espontáneos</span>
        <p className="text-2xl font-display font-black text-amber-900 mt-1">{report.totalEspontaneos}</p>
        <span className="text-[10px] font-bold text-amber-700 block mt-0.5">Sin pre-inscripción</span>
      </div>

      <div className="bg-red-50/70 p-4 rounded-2xl border border-red-200 shadow-xs">
        <span className="text-[10px] font-black uppercase text-red-800 block">Inasistencias</span>
        <p className="text-2xl font-display font-black text-red-900 mt-1">{report.totalInasistencias}</p>
        <span className="text-[10px] font-bold text-red-700 block mt-0.5">Inscritos que faltaron</span>
      </div>

      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-xs">
        <span className="text-[10px] font-black uppercase text-slate-300 block">Efectividad</span>
        <p className="text-2xl font-display font-black text-emerald-400 mt-1">{pctAsistencia}%</p>
        <span className="text-[10px] font-bold text-slate-300 block mt-0.5">Tasa de acreditación</span>
      </div>
    </div>
  );
};
